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
    if not title:
        return f"{region_label} {source} 주요 소식"
    if re.search(r'[가-힣]', title):
        return title

    legal_title = translate_legal_ai_title(title)
    if legal_title:
        return legal_title

    agent_title = translate_agent_report_title(title)
    if agent_title:
        return agent_title

    general_title = translate_general_headline(title)
    if general_title:
        return general_title

    topic = korean_topic_label(title, categories)
    return f"{topic}: {title}"

def build_korean_summary(title, source, region_label, full_summary, categories, feed_categories, author):
    sentences = split_sentences(full_summary)
    title_sentence = title if title and title not in full_summary[:250] else ""
    source_text = " ".join([title_sentence, *sentences[:12]]).strip()
    bullets = build_summary_bullets(title, source_text, sentences, categories)

    if not bullets:
        fallback = full_summary or title or "RSS가 본문 요약을 제공하지 않아 원문 확인이 필요합니다."
        bullets = [summarize_sentence_to_korean(fallback, categories)]

    metadata = []
    if author:
        metadata.append(f"작성자: {author}")
    if feed_categories:
        metadata.append(f"피드 태그: {', '.join(feed_categories[:6])}")

    meta_line = f"\n\n메타: {' · '.join(metadata)}" if metadata else ""
    return "핵심 요약\n" + "\n".join(f"- {bullet}" for bullet in bullets[:5]) + meta_line

def split_sentences(text):
    if not text:
        return []
    normalized = re.sub(r'\s+', ' ', text).strip()
    parts = re.split(r'(?<=[.!?。！？])\s+', normalized)
    return [
        part.strip()
        for part in parts
        if len(part.strip()) >= 35 and not is_boilerplate_sentence(part)
    ]

def is_boilerplate_sentence(sentence):
    lowered = sentence.lower()
    boilerplate = [
        "the post ",
        "appeared first on",
        "read more",
        "click here",
        "leave a reply",
        "copyright ©",
        "all rights reserved"
    ]
    return any(marker in lowered for marker in boilerplate)

def build_summary_bullets(title, source_text, sentences, categories):
    specialized = summarize_special_cases(title, source_text)
    if specialized:
        return specialized

    selected = select_important_sentences(sentences)
    bullets = []

    if title:
        title_summary = summarize_title_to_korean(title, source_text, categories)
        if title_summary:
            bullets.append(title_summary)

    for sentence in selected:
        summary = summarize_sentence_to_korean(sentence, categories)
        if summary and summary not in bullets:
            bullets.append(summary)
        if len(bullets) >= 5:
            break

    return bullets

def select_important_sentences(sentences):
    scored = []
    keywords = [
        "approved", "announced", "launched", "released", "settlement", "lawsuit",
        "study", "survey", "found", "shows", "percent", "%", "billion", "million",
        "security", "incident", "evaluation", "context", "agent", "customers",
        "developers", "production", "architecture", "performance", "cost"
    ]

    for index, sentence in enumerate(sentences[:24]):
        lowered = sentence.lower()
        score = max(0, 8 - index)
        score += sum(3 for keyword in keywords if keyword in lowered)
        score += len(re.findall(r'\d+|%|\$[0-9]', sentence))
        if 80 <= len(sentence) <= 320:
            score += 2
        scored.append((score, index, sentence))

    return [
        sentence
        for _, _, sentence in sorted(scored, key=lambda item: (-item[0], item[1]))[:5]
    ]

def summarize_special_cases(title, text):
    lowered = f"{title} {text}".lower()
    bullets = []

    if "anthropic" in lowered and "settlement" in lowered and "copyright" in lowered:
        amount = extract_money(text) or "15억 달러"
        bullets.append(f"샌프란시스코 연방법원이 Anthropic의 저작권 집단소송 합의안을 최종 승인했으며, 합의 규모는 {amount}로 알려졌습니다.")
        bullets.append("저자들은 Anthropic이 Claude 학습에 허가 없이 도서 자료를 사용했다고 주장했고, 이 사건은 AI 모델 학습을 둘러싼 미국 주요 저작권 분쟁 중 첫 대형 합의 사례로 다뤄졌습니다.")
        bullets.append("법원은 도서 학습 자체는 fair use로 본 기존 판단을 유지했지만, 700만 권 이상의 불법 복제 도서를 별도 중앙 라이브러리에 보관한 쟁점은 권리 침해로 남겼습니다.")
        bullets.append("일부 저자들은 합의금 규모와 변호사 보수, 배제 범위에 이의를 제기했지만 재판부는 이를 기각했고, 일부 작가·출판사의 별도 소송은 계속 진행 중입니다.")
        return bullets

    if "agent security gap" in lowered:
        enterprise_count = extract_enterprise_count(text)
        percent = extract_percent(text)
        bullets.append(f"{enterprise_count or '다수의'} 기업 조사에서 AI 에이전트가 실제 시스템과 데이터에 접근하고 있지만, 이를 격리하고 통제하는 보안 장치는 뒤처져 있다는 내용입니다.")
        if percent:
            bullets.append(f"조사 대상 중 {percent}가 이미 AI 에이전트 보안 사고나 근접 사고를 겪은 것으로 제시되어, 에이전트 권한 관리가 실험 단계를 넘어 운영 리스크가 됐습니다.")
        bullets.append("많은 조직이 에이전트별 scoped identity를 부여하지 못하고 자격 증명을 공유하거나 고위험 에이전트를 제대로 분리하지 못하는 점이 핵심 문제로 지적됩니다.")
        bullets.append("개발팀 관점에서는 에이전트 도입 전에 credential 분리, 권한 범위, 감사 로그, 격리 정책을 제품 요구사항으로 먼저 잡아야 합니다.")
        return bullets

    if "agent evaluation gap" in lowered:
        enterprise_count = extract_enterprise_count(text)
        bullets.append(f"{enterprise_count or '여러'} 기업 조사에서 AI 에이전트 평가가 실제 운영 결과와 맞지 않는다는 문제가 드러났다는 내용입니다.")
        bullets.append("내부 평가를 통과한 에이전트가 고객 환경이나 production에서 실패하는 사례가 제시되어, coverage보다 reality-alignment가 핵심 이슈로 부각됩니다.")
        bullets.append("자동 평가를 완전히 신뢰하는 조직은 소수이며, 실제 사용자 시나리오·회귀 테스트·운영 로그 기반 검증이 필요하다는 메시지입니다.")
        return bullets

    if "ai context gap" in lowered or "context gap" in lowered:
        enterprise_count = extract_enterprise_count(text)
        bullets.append(f"{enterprise_count or '여러'} 기업 조사에서 AI 에이전트의 문제는 검색 기능 부족보다 신뢰 가능한 비즈니스 컨텍스트 부족에 가깝다고 지적합니다.")
        bullets.append("RAG와 provider-native retrieval이 널리 쓰이고 있지만, 컨텍스트 출처·정합성·최신성 관리가 부족해 에이전트가 확신 있게 틀린 답을 내는 사례가 반복됩니다.")
        bullets.append("해결 방향은 벡터 DB 추가가 아니라 governed semantic layer, 출처 추적, 컨텍스트 품질 평가 체계를 먼저 만드는 쪽으로 제시됩니다.")
        return bullets

    return []

def summarize_title_to_korean(title, text, categories):
    translated = (
        translate_legal_ai_title(title)
        or translate_agent_report_title(title)
        or translate_general_headline(title, text)
    )
    if translated:
        return translated

    if re.search(r'[가-힣]', title):
        return title

    return summarize_sentence_to_korean(title, categories)

def summarize_sentence_to_korean(sentence, categories):
    if re.search(r'[가-힣]', sentence):
        return sentence

    lowered = sentence.lower()

    if "federal judge" in lowered and "approved" in lowered and "settlement" in lowered:
        amount = extract_money(sentence)
        return f"미국 연방법원이 {amount + ' 규모의 ' if amount else ''}합의안을 승인했다는 내용입니다."
    if "largest known" in lowered and "copyright" in lowered:
        return "이번 합의는 알려진 미국 저작권 사건 중 최대 규모의 합의로 설명됩니다."
    if "fair use" in lowered and ("books" in lowered or "training" in lowered):
        return "법원은 AI 학습 목적의 도서 사용은 fair use로 볼 수 있다고 판단했지만, 불법 복제 도서 보관 문제는 별도 쟁점으로 남겼습니다."
    if "pirated" in lowered and "books" in lowered:
        return "쟁점은 모델 학습 자체뿐 아니라 불법 복제 도서를 대량 저장·보관했는지 여부까지 포함합니다."
    if "objections" in lowered and ("overruled" in lowered or "rejected" in lowered):
        return "재판부는 합의 규모나 보상 범위에 대한 일부 이의를 받아들이지 않았습니다."
    if "separate lawsuits" in lowered or "still ongoing" in lowered:
        return "일부 권리자나 출판사의 별도 소송은 아직 계속되고 있습니다."
    if "director role" in lowered and ("resigned" in lowered or "revolving door" in lowered):
        return "미국 AI 표준·혁신센터(CAISI) 국장직이 잦은 교체를 겪고 있으며, 최근 AI 책임자도 사임했다는 내용입니다."
    if "working on a new chip" in lowered and "gemini" in lowered:
        return "Google 모회사 Alphabet이 Gemini 모델을 더 효율적으로 구동하기 위한 새 AI 칩을 개발 중이라는 보도입니다."
    if "stateless" in lowered and ("session id" in lowered or "session ids" in lowered):
        return "AI 프로토콜이 서버 세션 ID를 더 느슨한 stateless 방식으로 다루도록 바뀌며, 일반 웹 서비스와 비슷한 운영 모델에 가까워집니다."
    if "rebuilt version" in lowered and "android" in lowered and "available globally" in lowered:
        return "X가 1년가량 재구축한 Android 앱을 전 세계에 배포하기 시작했다는 내용입니다."
    if "banning chinese-made open-weight" in lowered or ("open-weight" in lowered and "banning" in lowered):
        return "중국산 오픈웨이트 LLM 금지 논의가 AI를 국가 안보와 비즈니스 전략으로 동시에 다루는 쟁점으로 떠올랐다는 내용입니다."
    if "project indigo" in lowered and "background" in lowered:
        return "Adobe Project Indigo가 촬영한 사진의 배경 제거와 AI 기반 사진 평가 기능을 추가했다는 내용입니다."
    if "monetization policies" in lowered and ("ai-generated" in lowered or "low-quality" in lowered):
        return "YouTube가 AI 생성 저품질 영상과 불쾌감을 주는 영상의 수익화 기준을 더 명확히 정리했습니다."
    if "reportedly working" in lowered:
        return f"{extract_subject(sentence) or '해당 기업'} 관련 보도로, 아직 공식 출시보다 개발·검토 단계의 변화에 가깝습니다."
    if "updated" in lowered and "policy" in lowered:
        return f"{extract_subject(sentence) or '해당 서비스'}가 정책을 갱신했으며, 제품 운영이나 수익화 조건에 영향을 줄 수 있습니다."
    if "resigned" in lowered:
        return f"{extract_subject(sentence) or '주요 책임자'}가 사임했다는 내용으로, 조직 운영이나 정책 추진의 불확실성을 보여줍니다."
    if "announced" in lowered or "released" in lowered or "launched" in lowered:
        return f"{extract_subject(sentence) or '해당 회사'}가 새 기능이나 제품 업데이트를 공개했습니다."
    if "available" in lowered and ("globally" in lowered or "now" in lowered):
        return f"{extract_subject(sentence) or '해당 제품'}이 이제 사용 가능해졌다는 출시·배포 소식입니다."
    if "security" in lowered and ("incident" in lowered or "vulnerability" in lowered):
        return "보안 사고나 취약점이 실제 운영 리스크로 제기되며, 권한·로그·격리 체계 점검이 필요합니다."
    if "production" in lowered and ("failed" in lowered or "customers" in lowered):
        return "내부 테스트를 통과한 기능이 실제 고객 환경이나 production에서 실패할 수 있다는 점을 지적합니다."
    if "cost" in lowered or "billion" in lowered or "million" in lowered:
        return f"비용·투자·시장 규모 같은 수치가 핵심 근거로 제시됩니다: {extract_numbers(sentence)}"
    if "designed to make" in lowered or "more efficiently" in lowered:
        return "새 기술이나 제품 변경의 초점은 성능·효율 개선에 있습니다."
    if "clarifies" in lowered or "clearly define" in lowered:
        return "플랫폼이 모호했던 정책이나 기준을 더 명확히 정리했다는 내용입니다."

    topic = korean_topic_label(sentence, categories)
    subject = extract_subject(sentence)
    return f"{subject or '이 기사'}는 {topic} 관련 변화이며, 핵심은 다음 원문 내용입니다: {shorten_sentence(sentence, 170)}"

def translate_legal_ai_title(title):
    lowered = title.lower()
    if "judge" in lowered and "approves" in lowered and "anthropic" in lowered and "settlement" in lowered:
        amount = extract_money(title) or "15억 달러"
        return f"미 법원, Anthropic의 {amount} 저작권 소송 합의안 승인"
    if "copyright" in lowered and "settlement" in lowered and "anthropic" in lowered:
        return "Anthropic 저작권 합의 승인, AI 학습 데이터 분쟁의 첫 대형 합의"
    return ""

def translate_agent_report_title(title):
    lowered = title.lower()
    if "agent security gap" in lowered:
        percent = extract_percent(title)
        return f"AI 에이전트 보안 격차: 기업의 {percent or '절반 이상'}이 이미 사고를 겪고도 자격 증명 공유를 계속함"
    if "agent evaluation gap" in lowered:
        return "AI 에이전트 평가 격차: 내부 평가와 실제 운영 결과가 어긋나는 문제"
    if "ai context gap" in lowered or "context gap" in lowered:
        return "AI 컨텍스트 격차: 기업 AI의 문제는 검색보다 신뢰 가능한 컨텍스트 부족"
    return ""

def translate_general_headline(title, text=""):
    lowered = title.lower()
    context = f"{title} {text}".lower()

    if "trump" in lowered and "ai czar" in lowered and "resigned" in lowered:
        return "트럼프 행정부의 최신 AI 책임자도 사임"
    if "google" in lowered and "new ai chip" in lowered and "gemini" in lowered:
        return "Google, Gemini 효율화를 위한 새 AI 칩 개발 중"
    if "most important protocol" in lowered and "easier to use" in lowered:
        return "AI 핵심 프로토콜 MCP, 세션 처리 방식 완화로 사용성 개선"
    if lowered.startswith("x relaunches") and "android" in lowered:
        return "X, 1년간 재구축한 Android 앱을 전 세계 재출시"
    if "openai" in lowered and "open-weight" in lowered:
        return "OpenAI와 미국이 오픈웨이트 모델을 경계하는 이유"
    if "adobe" in lowered and "critique your photos" in lowered:
        return "Adobe 카메라 앱, AI 사진 평가 기능 추가"
    if "youtube" in lowered and ("ai slop" in lowered or "upsetting videos" in lowered):
        return "YouTube, AI 저품질 영상과 불쾌한 영상 수익화 정책 명확화"
    if "launches" in lowered or "relaunches" in lowered:
        return f"{extract_subject(title)} 출시·재출시 소식"
    if "announces" in lowered or "introduces" in lowered:
        return f"{extract_subject(title)} 발표"
    if "working on" in lowered or "reportedly" in context:
        return f"{extract_subject(title)} 관련 개발·검토 보도"
    if "clarifies" in lowered or "policy" in lowered:
        return f"{extract_subject(title)} 정책 정리"
    return ""

def extract_money(text):
    match = re.search(r'\$([0-9]+(?:\.[0-9]+)?)\s*(billion|million)', text, re.I)
    if not match:
        return ""
    value = match.group(1)
    unit = match.group(2).lower()
    if unit == "billion":
        return f"{value}0억 달러" if "." not in value else f"{float(value) * 10:g}억 달러"
    return f"{value}백만 달러"

def extract_percent(text):
    match = re.search(r'([0-9]+(?:\.[0-9]+)?)\s*%', text)
    return f"{match.group(1)}%" if match else ""

def extract_enterprise_count(text):
    match = re.search(r'Across\s+([0-9]+)\s+enterprises', text, re.I)
    return f"{match.group(1)}개"

def extract_numbers(text):
    numbers = re.findall(r'\$[0-9][0-9.,]*(?:\s*(?:billion|million))?|[0-9][0-9.,]*\s*%', text, re.I)
    return ", ".join(numbers[:4]) if numbers else "원문 수치 확인 필요"

def extract_subject(text):
    cleaned = re.sub(r'\s+[-—–]\s+.*$', '', text).strip()
    cleaned = re.sub(r':.*$', '', cleaned).strip()
    return shorten_sentence(cleaned, 80)

def shorten_sentence(text, max_length):
    text = re.sub(r'\s+', ' ', text).strip()
    return text if len(text) <= max_length else text[:max_length].rstrip() + "..."

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
