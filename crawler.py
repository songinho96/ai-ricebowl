#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import urllib.request
import xml.etree.ElementTree as ET
import json
import re
from collections import Counter
from pathlib import Path

FEEDS = [
    {"name": "TechCrunch AI", "url": "https://techcrunch.com/category/artificial-intelligence/feed/", "lang": "en"},
    {"name": "Hacker News", "url": "https://news.ycombinator.com/rss", "lang": "en"},
    {"name": "Toss Tech", "url": "https://toss.tech/rss.xml", "lang": "ko"},
    {"name": "Kakao Tech", "url": "https://tech.kakao.com/feed/", "lang": "ko"}
]

def fetch_rss_feed(feed_name, url):
    print(f"[{feed_name}] RSS 피드 수집 중...")
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            xml_data = response.read()
            return parse_rss(xml_data, feed_name)
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

def parse_rss(xml_data, source_name):
    items = []
    try:
        root = ET.fromstring(xml_data)
        for item in root.findall('.//item'):
            title = item.find('title')
            link = item.find('link')
            desc = item.find('description')
            pub_date = item.find('pubDate')
            
            title_text = title.text if title is not None else "제목 없음"
            link_text = link.text if link is not None else "#"
            desc_text = desc.text if desc is not None else ""
            pub_date_text = pub_date.text if pub_date is not None else ""
            
            # HTML 태그 제거 및 텍스트 정리
            clean_desc = re.sub('<[^<]+?>', '', desc_text).strip() if desc_text else ""
            if len(clean_desc) > 150:
                clean_desc = clean_desc[:150] + "..."

            items.append({
                "source": source_name,
                "title": title_text,
                "link": link_text,
                "description": clean_desc,
                "pubDate": pub_date_text,
                "categories": classify_article(title_text, clean_desc)
            })
    except Exception as e:
        print(f"[{source_name}] XML 파싱 오류: {e}")
    return items

def generate_local_summaries(news_items):
    print("로컬 규칙 기반 최신 AI/IT 트렌드 요약 생성 중...")

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
            "### 오늘 핵심 트렌드 요약\n\n"
            f"* 총 **{len(news_items)}개**의 최신 RSS 항목을 수집했습니다.\n"
            f"* 현재 가장 자주 감지된 직무/기술 축은 **{category_text}** 입니다.\n"
            f"* 주요 수집 출처는 **{source_text}** 입니다.\n\n"
            f"{title_lines}"
        ),
        "weekly": (
            "### 주간 기술 흐름 분석\n\n"
            f"* 최근 피드에서는 **{category_text}** 관련 항목의 비중이 높습니다.\n"
            "* 개발자는 단일 도구 소식보다 실제 업무 흐름에 들어오는 자동화, 에이전트, 인프라 변화에 주목해야 합니다.\n"
            "* RSS 원문을 함께 확인하며 조직의 기술 스택과 직접 맞닿은 항목을 우선 검토하는 방식이 좋습니다."
        ),
        "monthly": (
            "### 월간 산업 방향성 전망\n\n"
            "* 수집된 흐름은 AI 도구가 개발 보조를 넘어 제품, 인프라, 보안, 운영 전반으로 확장되고 있음을 보여줍니다.\n"
            "* 각 직무는 코드 작성 속도보다 요구사항 해석, 시스템 설계, 검증 자동화, 데이터 거버넌스 역량을 더 강하게 요구받게 됩니다.\n"
            "* 이 대시보드는 외부 생성형 API 없이 RSS 기반 신호를 정리하는 가벼운 트렌드 관측 도구로 동작합니다."
        )
    }

def main():
    print("=== AI 밥그릇 실시간 뉴스 크롤러 가동 ===")
    all_items = []
    for feed in FEEDS:
        items = fetch_rss_feed(feed["name"], feed["url"])
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
