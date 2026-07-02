const { createApp } = Vue;

const STORAGE_KEYS = {
  theme: 'theme',
  bookmarks: 'ai_bookmarks'
};

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderSafeMarkdown(markdown = '') {
  const escaped = escapeHtml(markdown);
  const withBlocks = escaped
    .replace(/^####\s+(.*?)$/gm, '<h4>$1</h4>')
    .replace(/^###\s+(.*?)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^\s*[\*-]\s+(.*?)$/gm, '<li>$1</li>');

  const lines = withBlocks.split('\n');
  const html = [];
  let inList = false;
  let paragraph = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${paragraph.join('<br>')}</p>`);
      paragraph = [];
    }
  };

  const closeList = () => {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      closeList();
      return;
    }

    if (trimmed.startsWith('<li>')) {
      flushParagraph();
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(trimmed);
      return;
    }

    if (trimmed.startsWith('<h3>') || trimmed.startsWith('<h4>')) {
      flushParagraph();
      closeList();
      html.push(trimmed);
      return;
    }

    paragraph.push(trimmed);
  });

  flushParagraph();
  closeList();

  return html.join('\n');
}

function renderBlogSectionHtml(post) {
  if (!post) return '';

  const html = [
    `<p class="introduction">${escapeHtml(post.introduction)}</p>`
  ];

  post.sections.forEach((section) => {
    html.push(`<h3>${escapeHtml(section.title)}</h3>`);
    const content = String(section.content || '');
    const chunks = [];
    let cursor = 0;
    const codeBlockRegex = /```(?:javascript|python|html|css)?\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > cursor) {
        chunks.push({ type: 'markdown', value: content.slice(cursor, match.index) });
      }
      chunks.push({ type: 'code', value: match[1].trim() });
      cursor = match.index + match[0].length;
    }

    if (cursor < content.length) {
      chunks.push({ type: 'markdown', value: content.slice(cursor) });
    }

    chunks.forEach((chunk) => {
      if (chunk.type === 'code') {
        html.push(`<pre><code>${escapeHtml(chunk.value)}</code></pre>`);
      } else {
        html.push(renderSafeMarkdown(chunk.value));
      }
    });
  });

  return html.join('\n');
}

function normalizeTrendCard(card) {
  return {
    readTime: '6 min read',
    views: 'Daily',
    tags: [],
    trends: [],
    sourceLinks: [],
    whyMatters: [],
    developerActions: [],
    risks: [],
    ...card
  };
}

function readJsonStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    return fallback;
  }
}

createApp({
  data() {
    return {
      activeTab: 'trends',
      activeCategoryFilter: 'all',
      activeJobFilter: 'all',
      activeNewsRegion: 'overseas',
      activeSummaryPeriod: 'daily',
      activeJobGuide: 'FE',
      searchQuery: '',
      theme: localStorage.getItem(STORAGE_KEYS.theme) || 'dark',
      bookmarkedIds: readJsonStorage(STORAGE_KEYS.bookmarks, []),
      selectedPostId: null,
      selectedNewsKey: null,
      selectedTrendId: null,
      showBackToTop: false,
      trends: (window.dailyTrendCards || window.aiTrendsData || []).map(normalizeTrendCard),
      blogPosts: window.blogPostsData || [],
      jobRoles: window.jobRolesData || {},
      crawledNews: window.crawledNews || [],
      crawledSummaries: window.crawledSummaries || {},
      tabs: [
        { id: 'trends', label: '최신 AI 트렌드', icon: 'fa-solid fa-chart-line' },
        { id: 'blog', label: '개발자 생존 가이드', icon: 'fa-solid fa-book-open' }
      ],
      summaryPeriods: [
        { id: 'daily', label: '오늘의 동향' },
        { id: 'weekly', label: '주간 분석' },
        { id: 'monthly', label: '월간 전망' }
      ],
      newsRegions: [
        { id: 'overseas', label: '해외', icon: 'fa-solid fa-globe' },
        { id: 'domestic', label: '국내', icon: 'fa-solid fa-location-dot' }
      ],
      categoryFilters: [
        { id: 'all', label: '전체보기' },
        { id: 'LLM', label: '# LLM' },
        { id: 'Agent', label: '# Agent' },
        { id: 'Tool', label: '# Tool' },
        { id: 'OpenSource', label: '# OpenSource' },
        { id: 'realtime', label: '실시간 뉴스 피드', icon: 'fa-solid fa-rss', iconColor: '#10b981' },
        { id: 'bookmarks', label: '북마크', icon: 'fa-solid fa-bookmark', iconColor: '#fbbf24' }
      ],
      realtimeJobFilters: [
        { id: 'all', label: '전체' },
        { id: 'FE', label: 'Frontend' },
        { id: 'BE', label: 'Backend' },
        { id: 'DevOps', label: 'DevOps' },
        { id: 'AI', label: 'AI/Data' },
        { id: 'Mobile', label: 'Mobile' },
        { id: 'DBA', label: 'Database' },
        { id: 'QA', label: 'QA' },
        { id: 'Security', label: 'Security' }
      ],
      jobTabs: [
        { id: 'FE', label: 'FE', icon: 'fa-solid fa-code' },
        { id: 'BE', label: 'BE', icon: 'fa-solid fa-server' },
        { id: 'DevOps', label: 'DevOps', icon: 'fa-solid fa-cloud' },
        { id: 'AI', label: 'AI / Data', icon: 'fa-solid fa-brain' },
        { id: 'Mobile', label: 'Mobile', icon: 'fa-solid fa-mobile-screen-button' },
        { id: 'DBA', label: 'DBA', icon: 'fa-solid fa-database' },
        { id: 'QA', label: 'QA', icon: 'fa-solid fa-vial' },
        { id: 'Security', label: 'Security', icon: 'fa-solid fa-shield-halved' }
      ]
    };
  },

  computed: {
    hero() {
      if (this.activeTab === 'blog') {
        return {
          tag: 'DEVELOPER SURVIVAL GUIDE',
          title: '코딩 비서에서 에이전트까지,<br>살아남는 개발자의 가이드.',
          description: '단순 타이핑 중심의 코더에서 여러 AI 도구를 지휘하는 오케스트레이터로 도약하는 심층 가이드를 소개합니다.',
          image: 'assets/blog_survival.png',
          alt: 'Developer survival guide'
        };
      }

      return {
        tag: 'AI TREND AGGREGATOR',
        title: 'AI 격변의 시대,<br>우리의 밥그릇을 더 단단하게.',
        description: '최신 인공지능 기술 동향을 분석하고, 실무 워크플로우에 결합하여 개발 생산성을 혁신하는 방법을 제안합니다.',
        image: 'assets/hero_banner.png',
        alt: 'Futuristic AI workspace'
      };
    },

    currentSummaryHtml() {
      const regionSummary = this.crawledSummaries[this.activeNewsRegion];
      const summary = typeof regionSummary === 'object'
        ? regionSummary[this.activeSummaryPeriod]
        : this.crawledSummaries[this.activeSummaryPeriod];

      return renderSafeMarkdown(summary || '요약 데이터를 불러올 수 없습니다.');
    },

    regionalNews() {
      return this.crawledNews.filter((item) => this.normalizedRegion(item) === this.activeNewsRegion);
    },

    selectedNews() {
      if (!this.selectedNewsKey) return null;
      return this.crawledNews
        .map((item, index) => this.decorateNewsItem(item, index))
        .find((item) => item.key === this.selectedNewsKey) || null;
    },

    categoryChartRows() {
      return this.buildChartRows(this.regionalNews.flatMap((item) => item.categories || []), 8);
    },

    sourceChartRows() {
      return this.buildChartRows(this.regionalNews.map((item) => item.source), 8);
    },

    selectedRelatedNews() {
      if (!this.selectedNews) return [];
      const selectedCategories = new Set(this.selectedNews.categories || []);

      return this.crawledNews
        .map((item, index) => this.decorateNewsItem(item, index))
        .filter((item) => {
          if (item.key === this.selectedNews.key) return false;
          if (this.normalizedRegion(item) !== this.normalizedRegion(this.selectedNews)) return false;
          return (item.categories || []).some((category) => selectedCategories.has(category));
        })
        .slice(0, 4);
    },

    normalizedSearchQuery() {
      return this.searchQuery.toLowerCase();
    },

    displayedTrendItems() {
      if (this.activeCategoryFilter === 'realtime') {
        return this.crawledNews
          .filter((item) => {
            if (this.normalizedRegion(item) !== this.activeNewsRegion) {
              return false;
            }

            if (this.activeJobFilter !== 'all' && !(item.categories || []).includes(this.activeJobFilter)) {
              return false;
            }

            if (!this.normalizedSearchQuery) return true;

            return [
              item.title,
              item.description,
              item.source,
              item.regionLabel
            ].some((value) => String(value || '').toLowerCase().includes(this.normalizedSearchQuery));
          })
          .map((item, index) => this.decorateNewsItem(item, index));
      }

      return this.trends
        .filter((item) => {
          if (this.activeCategoryFilter === 'bookmarks') {
            if (!this.isBookmarked(item.id)) return false;
          } else if (this.activeCategoryFilter !== 'all' && item.category !== this.activeCategoryFilter) {
            return false;
          }

          if (!this.normalizedSearchQuery) return true;

          return [
            item.title,
            item.summary,
            item.content,
            ...(item.tags || [])
          ].some((value) => String(value || '').toLowerCase().includes(this.normalizedSearchQuery));
        })
        .map((item) => ({
          ...item,
          key: `trend-${item.id}`,
          kind: 'trend'
        }));
    },

    emptyTrendTitle() {
      if (this.activeCategoryFilter === 'realtime' && this.crawledNews.length === 0) {
        return '수집된 실시간 뉴스 데이터가 없습니다';
      }
      if (this.activeCategoryFilter === 'realtime') {
        return `${this.activeRegionLabel} 뉴스 검색 결과가 없습니다`;
      }
      return '일치하는 검색 결과가 없습니다';
    },

    emptyTrendDescription() {
      if (this.activeCategoryFilter === 'realtime' && this.crawledNews.length === 0) {
        return '터미널에서 bash run_crawler.sh 명령어를 실행해 RSS 데이터를 수집해 보세요.';
      }
      if (this.activeCategoryFilter === 'realtime') {
        return '다른 권역, 직무 필터, 검색어로 다시 확인해 보세요.';
      }
      return '다른 검색어를 입력하시거나 카테고리 필터를 변경해 보세요.';
    },

    activeRegionLabel() {
      return this.newsRegions.find((region) => region.id === this.activeNewsRegion)?.label || '선택한 권역';
    },

    currentJobGuide() {
      return this.jobRoles[this.activeJobGuide];
    },

    selectedPost() {
      return this.blogPosts.find((post) => post.id === this.selectedPostId) || null;
    },

    selectedPostHtml() {
      return renderBlogSectionHtml(this.selectedPost);
    },

    selectedTrend() {
      return this.trends.find((trend) => trend.id === this.selectedTrendId) || null;
    }
  },

  watch: {
    theme(nextTheme) {
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
    },

    bookmarkedIds: {
      deep: true,
      handler(nextBookmarks) {
        localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(nextBookmarks));
      }
    }
  },

  mounted() {
    document.documentElement.setAttribute('data-theme', this.theme);
    window.addEventListener('scroll', this.onScroll, { passive: true });
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  },

  methods: {
    goHome() {
      this.selectedPostId = null;
      this.selectedNewsKey = null;
      this.selectedTrendId = null;
      this.activeTab = 'trends';
      this.scrollTop();
    },

    switchTab(tabId) {
      this.selectedPostId = null;
      this.selectedNewsKey = null;
      this.selectedTrendId = null;
      this.activeTab = tabId;
      this.scrollTop();
    },

    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
    },

    setCategoryFilter(filterId) {
      this.activeCategoryFilter = filterId;
      if (filterId !== 'realtime') {
        this.activeJobFilter = 'all';
      }
    },

    isBookmarked(id) {
      return this.bookmarkedIds.includes(id);
    },

    toggleBookmark(id) {
      if (this.isBookmarked(id)) {
        this.bookmarkedIds = this.bookmarkedIds.filter((bookmarkedId) => bookmarkedId !== id);
      } else {
        this.bookmarkedIds = [...this.bookmarkedIds, id];
      }
    },

    openPost(postId) {
      this.selectedPostId = postId;
      this.selectedNewsKey = null;
      this.selectedTrendId = null;
      this.scrollTop();
    },

    closePost() {
      this.selectedPostId = null;
      this.activeTab = 'blog';
      this.scrollTop();
    },

    openTrendDetail(trendId) {
      this.selectedTrendId = trendId;
      this.selectedPostId = null;
      this.selectedNewsKey = null;
      this.activeTab = 'trends';
      this.scrollTop();
    },

    closeTrendDetail() {
      this.selectedTrendId = null;
      this.scrollTop();
    },

    openNewsDetail(item) {
      this.selectedNewsKey = item.key;
      this.selectedPostId = null;
      this.selectedTrendId = null;
      this.activeTab = 'trends';
      this.scrollTop();
    },

    closeNewsDetail() {
      this.selectedNewsKey = null;
      this.scrollTop();
    },

    normalizedRegion(item) {
      if (item.region === 'domestic' || item.region === 'overseas') {
        return item.region;
      }

      const source = String(item.source || '');
      const domesticSources = ['Toss', 'Kakao', 'NAVER', 'LINE', 'Woowahan', 'Daangn'];
      return domesticSources.some((domesticSource) => source.includes(domesticSource)) ? 'domestic' : 'overseas';
    },

    regionLabel(item) {
      return this.normalizedRegion(item) === 'domestic' ? '국내' : '해외';
    },

    decorateNewsItem(item, index) {
      return {
        ...item,
        key: `realtime-${index}-${item.link}`,
        kind: 'realtime'
      };
    },

    buildChartRows(values, limit = 8) {
      const counts = values
        .filter(Boolean)
        .reduce((acc, value) => {
          const key = String(value);
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
      const rows = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit);
      const max = rows[0]?.[1] || 1;

      return rows.map(([label, count]) => ({
        label,
        count,
        width: `${Math.max(8, Math.round((count / max) * 100))}%`
      }));
    },

    sourceCode(source = '') {
      if (source.includes('TechCrunch')) return 'TC';
      if (source.includes('Hacker News')) return 'HN';
      if (source.includes('Toss')) return 'Toss';
      if (source.includes('Kakao')) return 'Kakao';
      return 'default';
    },

    shortDate(pubDate) {
      if (!pubDate) return '최신';
      return pubDate.split(' ').slice(0, 4).join(' ');
    },

    safeUrl(url) {
      try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '#';
      } catch (error) {
        return '#';
      }
    },

    onScroll() {
      this.showBackToTop = window.scrollY > 300;
    },

    scrollTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}).mount('#app');
