#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import urllib.request
import xml.etree.ElementTree as ET
import json
import re
import os
from datetime import datetime

# API Key provided by the user
API_KEY = "AIzaSyCNrwiZW_x4OqCmCF8bWVw5rxyGj_FvW00"

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

def generate_gemini_summaries(news_items):
    print("Gemini API 호출 및 최신 AI/IT 트렌드 분석 요약 생성 중...")
    
    # 기사 리스트를 텍스트로 축약
    news_text = ""
    for idx, item in enumerate(news_items[:25], 1):  # 최신 기사 25개 위주로 요약
        news_text += f"{idx}. [{item['source']}] {item['title']}\n"
        if item['description']:
            news_text += f"   - 요약: {item['description']}\n"
    
    prompt = f"""
너는 IT 및 최신 인공지능(AI) 기술 동향 분석 전문가이다.
아래 제공된 최신 개발/AI 관련 기사 목록을 읽고, 개발자들의 기술 학습 방향과 실무 관점에서 유용한 요약 보고서를 작성해라.

[최신 IT 뉴스 목록]
{news_text}

[요구사항]
1. 아래 3가지 유형의 요약을 격식 있고 실무 지향적인 한글 마크다운 형식으로 작성해라:
   - **일별 요약 (Daily)**: 가장 최신 기사들 중 오늘 당장 주목해야 할 단 하나의 핵심 트렌드와 그 이유.
   - **주별 요약 (Weekly)**: 최근 일주일간 흐르는 주요 기술의 변화 흐름과 개발자들이 준비해야 할 역량.
   - **월별 요약 (Monthly)**: 수집된 전체 소식을 포괄하는 거시적인 산업 방향성, AI 에이전트 도입에 따른 생존 방향성 예측.
2. 각 요약은 최소 3~4문장 이상의 풍부한 설명과 핵심 키워드를 포함해야 한다.
3. 반드시 아래 JSON 스키마를 엄격히 만족하는 순수 JSON 형식으로만 반환해라. (마크다운 코드 블록(```json) 없이 JSON 문자열만 반환해야 파싱이 가능하다):
{{
  "daily": "일별 마크다운 요약 텍스트",
  "weekly": "주별 마크다운 요약 텍스트",
  "monthly": "월별 마크다운 요약 텍스트"
}}
"""
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }
    
    try:
        req = urllib.request.Request(
            url, 
            data=json.dumps(payload).encode('utf-8'), 
            headers=headers,
            method='POST'
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            text_response = res_data['candidates'][0]['content']['parts'][0]['text']
            
            # JSON 파싱 검증
            summaries = json.loads(text_response.strip())
            return summaries
    except Exception as e:
        print(f"Gemini API 요약 생성 실패: {e}")
        # Fallback 구조화된 데이터 제공
        return {
            "daily": "### 📢 오늘 핵심 트렌드 요약\n\n* **Gemini 실시간 요약 실패로 인한 대체 동향입니다.**\n* 최신 Geeknews 및 Hacker News의 실시간 기술 공유에 따르면 오픈소스 거대언어모델의 가볍고 강력한 에지 서빙 기법과 개발 도구(Cursor, Copilot Workspace)의 확산이 중심 트렌드입니다.\n* 개발자들은 이제 API 기반 구현 뿐만 아니라 로컬 서빙 가속화(ONNX, Apple Silicon 가속)에 관심을 높여야 합니다.",
            "weekly": "### 📅 주간 AI 기술 흐름 분석\n\n* **Gemini 실시간 요약 실패로 인한 대체 동향입니다.**\n* 한 주간의 흐름은 AI Agent의 상용화 흐름이 매우 짙게 나타납니다. 에이전트 아키텍처(LangGraph, CrewAI)에 대한 실제 제품 수준의 레퍼런스가 활발히 논의 중이며, 단일 대화 챗봇 형태에서 특정 트리거에 반응하는 자동화 에이전트로 이동하고 있습니다.",
            "monthly": "### 📊 월간 거시적 산업 동향\n\n* **Gemini 실시간 요약 실패로 인한 대체 동향입니다.**\n* 이번 달에는 빅테크의 최신 AI 추론 모델 출시와 오픈소스 진영(Llama 3, DeepSeek)의 대규모 가격 인하 경쟁이 맞물려 있습니다. 이는 개발 조직에게 인프라 선택권을 크게 넓혀주었으며, 사내 독자 온프레미스 AI 가동이 비용적으로 타당성을 가지게 된 분기점입니다."
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
    
    # Gemini 요약본 생성
    summaries = generate_gemini_summaries(all_items)
    
    # data.js에 로드할 수 있도록 javascript 변수 파일 생성
    output_path = "/Users/songinho/Desktop/AI밥그릇/crawled_data.js"
    print(f"데이터 파일 작성 중: {output_path}")
    
    js_content = f"""// 자동 생성된 실시간 크롤링 기사 및 Gemini 요약본
window.crawledNews = {json.dumps(all_items, ensure_ascii=False, indent=2)};

window.crawledSummaries = {json.dumps(summaries, ensure_ascii=False, indent=2)};
"""
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(js_content)
        
    print("=== 크롤링 및 요약 파일 작성 완료! ===")

if __name__ == "__main__":
    main()
