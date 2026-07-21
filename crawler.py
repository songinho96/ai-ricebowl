#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import urllib.request
import xml.etree.ElementTree as ET
import json
import re
import html
from collections import Counter
from pathlib import Path

FEEDS = [
    {"name": "TechCrunch AI", "url": "https://techcrunch.com/category/artificial-intelligence/feed/", "lang": "en", "region": "overseas"},
    {"name": "Hacker News", "url": "https://news.ycombinator.com/rss", "lang": "en", "region": "overseas"},
    {"name": "VentureBeat AI", "url": "https://venturebeat.com/category/ai/feed", "lang": "en", "region": "overseas"},
    {"name": "Ars Technica AI", "url": "https://arstechnica.com/ai/feed/", "lang": "en", "region": "overseas"},
    {"name": "GitHub Engineering", "url": "https://github.blog/engineering/feed/", "lang": "en", "region": "overseas"},
    {"name": "Netflix TechBlog", "url": "https://netflixtechblog.com/feed", "lang": "en", "region": "overseas"},
    {"name": "Cloudflare Blog", "url": "https://blog.cloudflare.com/rss/", "lang": "en", "region": "overseas"},
    {"name": "AWS ML Blog", "url": "https://aws.amazon.com/blogs/machine-learning/feed/", "lang": "en", "region": "overseas"},
    {"name": "Toss Tech", "url": "https://toss.tech/rss.xml", "lang": "ko", "region": "domestic"},
    {"name": "Kakao Tech", "url": "https://tech.kakao.com/feed/", "lang": "ko", "region": "domestic"},
    {"name": "NAVER D2", "url": "https://d2.naver.com/d2.atom", "lang": "ko", "region": "domestic"},
    {"name": "LINE Engineering", "url": "https://engineering.linecorp.com/ko/feed/", "lang": "ko", "region": "domestic"},
    {"name": "Woowahan Tech", "url": "https://techblog.woowahan.com/feed/", "lang": "ko", "region": "domestic"},
    {"name": "Daangn Tech", "url": "https://medium.com/feed/daangn", "lang": "ko", "region": "domestic"}
]

REGION_LABELS = {
    "overseas": "해외",
    "domestic": "국내"
}

def fetch_rss_feed(feed):
    feed_name = feed["name"]
    url = feed["url"]
    print(f"[{feed_name}] RSS 피드 수집 중...")
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            xml_data = response.read()
            return parse_rss(xml_data, feed)
    except Exception as e:
        print(f"[{feed_name}] 피드 가져오기 실패: {e}")
        return []

def classify_article(title, description):
    text = (title + " " + description).lower()
    categories = []
    
    # Keyword sets for job roles
    keywords = {
        "FE": ["react", "vue", "javascript", "typescript", "css", "html", "next.js", "frontend", "ui", "ux", "tailwindcss", "v0", "lovable", "bolt.new", "web"],
        "BE": ["api", "backend", "django", "spring", "java", "node.js", "go", "rust", "graphql", "microservice", "server", "rest"],
        "DevOps": ["docker", "kubernetes", "k8s", "aws", "gcp", "terraform", "ansible", "devops", "ci/cd", "jenkins", "gitops", "prometheus", "grafana", "infra", "cloud"],
        "AI": ["llm", "ai", "machine learning", "deep learning", "neural", "nlp", "data science", "pytorch", "tensorflow", "agent", "rag", "langchain", "crewai", "langgraph", "deepseek", "openai", "claude", "gemini", "model", "inference"],
        "Mobile": ["ios", "android", "swift", "kotlin", "flutter", "react native", "mobile", "app"],
        "DBA": ["database", "sql", "postgresql", "mysql", "mongodb", "redis", "query", "schema", "dba", "nosql", "migration"],
        "QA": ["test", "qa", "cypress", "playwright", "selenium", "jest", "mock", "validation", "testing"],
        "Security": ["security", "exploit", "cve", "auth", "oauth", "jwt", "vulnerability", "encryption", "firewall", "hack"]
    }
    
    for category, kws in keywords.items():
        for kw in kws:
            if kw in text:
                categories.append(category)
                break
                
    if not categories:
        categories.append("General")
        
    return categories

def parse_rss(xml_data, feed):
    items = []
    source_name = feed["name"]
    try:
        root = ET.fromstring(xml_data)
        rss_items = root.findall('.//item')
        atom_entries = root.findall('.//{http://www.w3.org/2005/Atom}entry')

        for item in rss_items:
            raw_description = get_text(item.find('description'), "")
            content = get_first_child_text(item, ["encoded", "content"])
            rss_categories = get_child_values(item, "category")
            add_parsed_item(
                items,
                feed,
                title=get_text(item.find('title'), "제목 없음"),
                link=get_text(item.find('link'), "#"),
                description=raw_description,
                pub_date=get_text(item.find('pubDate'), ""),
                content=content,
                author=(
                    get_first_child_text(item, ["creator", "author", "dc:creator"])
                    or get_text(item.find('author'), "")
                ),
                guid=get_text(item.find('guid'), ""),
                feed_categories=rss_categories,
                comments=get_text(item.find('comments'), ""),
                enclosure=get_enclosure(item)
            )

        for entry in atom_entries:
            link_node = entry.find('{http://www.w3.org/2005/Atom}link')
            link_text = link_node.get('href') if link_node is not None else "#"
            summary = (
                get_text(entry.find('{http://www.w3.org/2005/Atom}summary'), "")
                or get_text(entry.find('{http://www.w3.org/2005/Atom}content'), "")
            )
            pub_date = (
                get_text(entry.find('{http://www.w3.org/2005/Atom}updated'), "")
                or get_text(entry.find('{http://www.w3.org/2005/Atom}published'), "")
            )
            add_parsed_item(
                items,
                feed,
                title=get_text(entry.find('{http://www.w3.org/2005/Atom}title'), "제목 없음"),
                link=link_text,
                description=summary,
                pub_date=pub_date,
                content=get_text(entry.find('{http://www.w3.org/2005/Atom}content'), ""),
                author=get_atom_author(entry),
                guid=get_text(entry.find('{http://www.w3.org/2005/Atom}id'), ""),
                feed_categories=get_atom_categories(entry),
                comments="",
                enclosure={}
            )
    except Exception as e:
        print(f"[{source_name}] XML 파싱 오류: {e}")
    return items

def get_text(node, fallback=""):
    return node.text if node is not None and node.text is not None else fallback

def local_name(tag):
    return str(tag).split('}', 1)[-1].split(':')[-1]

def clean_text(value):
    if not value:
        return ""
    text = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', value, flags=re.I | re.S)
    text = re.sub('<[^<]+?>', ' ', text)
    text = html.unescape(text)
    return re.sub(r'\s+', ' ', text).strip()

def get_first_child_text(node, names):
    wanted = {name.split(':')[-1] for name in names}
    for child in list(node):
        if local_name(child.tag) in wanted and child.text:
            return child.text
    return ""

def get_child_values(node, name):
    values = []
    for child in list(node):
      if local_name(child.tag) == name:
          value = child.get("term") or child.text
          if value:
              values.append(clean_text(value))
    return values

def get_atom_author(entry):
    author = entry.find('{http://www.w3.org/2005/Atom}author')
    if author is None:
        return ""
    return (
        get_text(author.find('{http://www.w3.org/2005/Atom}name'), "")
        or get_text(author.find('{http://www.w3.org/2005/Atom}email'), "")
        or clean_text(get_text(author, ""))
    )

def get_atom_categories(entry):
    return [
        node.get("term") or clean_text(get_text(node, ""))
        for node in entry.findall('{http://www.w3.org/2005/Atom}category')
        if node.get("term") or get_text(node, "")
    ]

def get_enclosure(item):
    enclosure = item.find('enclosure')
    if enclosure is None:
        return {}
    return {
        "url": enclosure.get("url", ""),
        "type": enclosure.get("type", ""),
        "length": enclosure.get("length", "")
    }

def korean_topic_label(text, categories):
    lowered = text.lower()
    category_set = set(categories or [])

    if re.search(r'agent|mcp|orchestration|workflow|tool', lowered):
        return "AI 에이전트와 도구 연동"
    if re.search(r'context|rag|retrieval|prompt', lowered):
        return "컨텍스트 엔지니어링과 RAG"
    if re.search(r'llm|model|open-weight|gpt|gemini|claude|bedrock|inference', lowered):
        return "모델 선택과 LLM 운영"
    if re.search(r'gpu|chip|compute|serving|kubernetes|data center|cloudflare|aws', lowered):
        return "AI 인프라와 서빙"
    if re.search(r'security|vulnerability|privacy|copyright|lawsuit|policy|regulation', lowered):
        return "보안, 정책, 데이터 경계"
    if re.search(r'test|qa|review|verification|playwright|coding|copilot', lowered):
        return "AI 개발 검증과 코드 리뷰"
    if "FE" in category_set:
        return "프론트엔드와 사용자 경험"
    if "BE" in category_set:
        return "백엔드와 API 운영"
    if "DevOps" in category_set:
        return "플랫폼 운영과 DevOps"
    return "AI/IT 산업 변화"

def build_korean_title(title, source, region_label, categories):
    topic = korean_topic_label(title, categories)
    return f"{topic}: {title}" if title else f"{region_label} {source} 주요 소식"

def build_korean_summary(title, source, region_label, full_summary, categories, feed_categories, author):
    topic = korean_topic_label(f"{title} {full_summary}", categories)
    category_text = ", ".join(categories or ["General"])
    feed_category_text = ", ".join(feed_categories[:6]) if feed_categories else "피드 카테고리 없음"
    author_text = f" 작성자/제공자는 {author}입니다." if author else ""
    body = full_summary or "RSS가 본문 요약을 제공하지 않아 원문 확인이 필요합니다."

    return (
        f"{region_label} {source}에서 수집한 {topic} 관련 피드입니다."
        f"{author_text} 직무 분류는 {category_text}, 원문 피드 태그는 {feed_category_text}입니다.\n\n"
        f"{body}"
    )

def add_parsed_item(items, feed, title, link, description, pub_date, content="", author="", guid="", feed_categories=None, comments="", enclosure=None):
    feed_categories = feed_categories or []
    enclosure = enclosure or {}
    clean_desc = clean_text(description)
    clean_content = clean_text(content)
    summary_parts = []

    for part in [clean_desc, clean_content]:
        if part and part not in summary_parts:
            summary_parts.append(part)

    full_summary = "\n\n".join(summary_parts)
    categories = classify_article(title, full_summary)
    region_label = REGION_LABELS.get(feed["region"], "기타")
    items.append({
        "source": feed["name"],
        "title": title,
        "koreanTitle": build_korean_title(title, feed["name"], region_label, categories),
        "link": link,
        "description": full_summary,
        "summary": full_summary,
        "fullSummary": full_summary,
        "koreanSummary": build_korean_summary(title, feed["name"], region_label, full_summary, categories, feed_categories, author),
        "pubDate": pub_date,
        "region": feed["region"],
        "regionLabel": region_label,
        "categories": categories,
        "feedCategories": feed_categories,
        "author": author,
        "guid": guid,
        "comments": comments,
        "enclosure": enclosure,
        "feedMeta": {
            "sourceUrl": feed["url"],
            "language": feed["lang"],
            "originalTitle": title,
            "author": author,
            "guid": guid,
            "comments": comments,
            "feedCategories": feed_categories,
            "enclosure": enclosure
        }
    })

def generate_region_summary(news_items, region_label):
    if not news_items:
        return {
            "daily": (
                f"### {region_label} 핵심 트렌드 요약\n\n"
                f"* 아직 수집된 {region_label} RSS 항목이 없습니다.\n"
                "* 크롤러 설정과 RSS 피드 상태를 확인해 주세요."
            ),
            "weekly": (
                f"### {region_label} 주간 기술 흐름 분석\n\n"
                f"* {region_label} 데이터가 수집되면 주요 직무/기술 태그 분포를 기반으로 요약이 표시됩니다."
            ),
            "monthly": (
                f"### {region_label} 월간 산업 방향성 전망\n\n"
                f"* {region_label} RSS 신호가 충분히 쌓이면 장기 흐름을 더 안정적으로 읽을 수 있습니다."
            )
        }

    category_counter = Counter()
    source_counter = Counter(item["source"] for item in news_items)
    for item in news_items:
        category_counter.update(item.get("categories", []))

    top_categories = [name for name, _ in category_counter.most_common(3) if name != "General"]
    top_sources = [name for name, _ in source_counter.most_common(3)]
    latest_titles = [item["title"] for item in news_items[:5]]

    category_text = ", ".join(top_categories) if top_categories else "General"
    source_text = ", ".join(top_sources) if top_sources else "RSS 피드"
    title_lines = "\n".join(f"* **{title}**" for title in latest_titles)

    return {
        "daily": (
            f"### {region_label} 핵심 트렌드 요약\n\n"
            f"* 총 **{len(news_items)}개**의 {region_label} RSS 항목을 수집했습니다.\n"
            f"* 현재 가장 자주 감지된 직무/기술 축은 **{category_text}** 입니다.\n"
            f"* 주요 수집 출처는 **{source_text}** 입니다.\n\n"
            f"{title_lines}"
        ),
        "weekly": (
            f"### {region_label} 주간 기술 흐름 분석\n\n"
            f"* 최근 {region_label} 피드에서는 **{category_text}** 관련 항목의 비중이 높습니다.\n"
            "* 개발자는 단일 도구 소식보다 실제 업무 흐름에 들어오는 자동화, 에이전트, 인프라 변화에 주목해야 합니다.\n"
            "* RSS 원문을 함께 확인하며 조직의 기술 스택과 직접 맞닿은 항목을 우선 검토하는 방식이 좋습니다."
        ),
        "monthly": (
            f"### {region_label} 월간 산업 방향성 전망\n\n"
            f"* {region_label}에서 수집된 흐름은 AI 도구가 개발 보조를 넘어 제품, 인프라, 보안, 운영 전반으로 확장되고 있음을 보여줍니다.\n"
            "* 각 직무는 코드 작성 속도보다 요구사항 해석, 시스템 설계, 검증 자동화, 데이터 거버넌스 역량을 더 강하게 요구받게 됩니다.\n"
            "* 이 대시보드는 외부 생성형 API 없이 RSS 기반 신호를 정리하는 가벼운 트렌드 관측 도구로 동작합니다."
        )
    }

def generate_local_summaries(news_items):
    print("로컬 규칙 기반 최신 AI/IT 트렌드 요약 생성 중...")

    return {
        "overseas": generate_region_summary(
            [item for item in news_items if item.get("region") == "overseas"],
            "해외"
        ),
        "domestic": generate_region_summary(
            [item for item in news_items if item.get("region") == "domestic"],
            "국내"
        )
    }

def main():
    print("=== AI 밥그릇 실시간 뉴스 크롤러 가동 ===")
    all_items = []
    for feed in FEEDS:
        items = fetch_rss_feed(feed)
        all_items.extend(items)
    
    if not all_items:
        print("수집된 뉴스가 없습니다. 크롤링을 종료합니다.")
        return
        
    print(f"총 {len(all_items)}개의 뉴스 항목이 수집되었습니다.")
    
    summaries = generate_local_summaries(all_items)
    
    # data.js에 로드할 수 있도록 javascript 변수 파일 생성
    output_path = Path(__file__).with_name("crawled_data.js")
    print(f"데이터 파일 작성 중: {output_path}")
    
    js_content = f"""// 자동 생성된 실시간 크롤링 기사 및 로컬 요약본
window.crawledNews = {json.dumps(all_items, ensure_ascii=False, indent=2)};

window.crawledSummaries = {json.dumps(summaries, ensure_ascii=False, indent=2)};
"""
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(js_content)
        
    print("=== 크롤링 및 요약 파일 작성 완료! ===")

if __name__ == "__main__":
    main()
