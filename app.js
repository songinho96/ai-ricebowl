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

function normalizeSurvivalGuide(post) {
  return {
    readTime: '8 min read',
    category: '개발자 생존 가이드',
    author: 'AI 밥그릇',
    image: 'assets/blog_survival.png',
    introduction: '',
    sections: [],
    sourceType: 'auto',
    ...post
  };
}

function createGuideFormDefaults() {
  return {
    title: '',
    subtitle: '',
    category: 'FE',
    author: '',
    contact: '',
    introduction: '',
    strategy: '',
    actions: '',
    tools: '',
    links: '',
    website: ''
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

function encodeRoutePart(value) {
  return encodeURIComponent(String(value || ''));
}

function decodeRoutePart(value) {
  try {
    return decodeURIComponent(String(value || ''));
  } catch (error) {
    return String(value || '');
  }
}

function stableHash(value) {
  const input = String(value || '');
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = Math.imul(31, hash) + input.charCodeAt(index);
    hash |= 0;
  }

  return (hash >>> 0).toString(36);
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
      activeTrendDate: 'all',
      activeGuideDate: 'all',
      searchQuery: '',
      theme: localStorage.getItem(STORAGE_KEYS.theme) || 'dark',
      bookmarkedIds: readJsonStorage(STORAGE_KEYS.bookmarks, []),
      selectedPostId: null,
      selectedNewsKey: null,
      selectedTrendId: null,
      showGuideComposer: false,
      routeInitialized: false,
      showBackToTop: false,
      dataSource: 'static',
      dataLoadedAt: null,
      guideSourceFilter: 'all',
      guideSubmitStatus: 'idle',
      guideSubmitMessage: '',
      guideForm: createGuideFormDefaults(),
      trends: (window.dailyTrendCards || window.aiTrendsData || []).map(normalizeTrendCard),
      blogPosts: (window.dailySurvivalGuides || window.blogPostsData || []).map(normalizeSurvivalGuide),
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
      ],
      guideSourceFilters: [
        { id: 'all', label: '전체' },
        { id: 'auto', label: 'AI 자동 분석' },
        { id: 'user', label: '사용자 작성' }
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
          const latest = this.latestDate(this.trends);
          if (this.activeTrendDate === 'latest' && item.date !== latest) return false;
          if (this.activeTrendDate !== 'all' && this.activeTrendDate !== 'latest' && item.date !== this.activeTrendDate) return false;

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

    displayedBlogPosts() {
      const latest = this.latestDate(this.blogPosts);

      return this.blogPosts.filter((post) => {
        if (this.guideSourceFilter !== 'all' && post.sourceType !== this.guideSourceFilter) {
          return false;
        }
        if (this.activeGuideDate === 'all') {
          return true;
        }
        if (this.activeGuideDate === 'latest') {
          return post.date === latest;
        }
        return post.date === this.activeGuideDate;
      });
    },

    selectedPostHtml() {
      return renderBlogSectionHtml(this.selectedPost);
    },

    selectedTrend() {
      return this.trends.find((trend) => trend.id === this.selectedTrendId) || null;
    },

    trendDateOptions() {
      return this.buildDateOptions(this.trends);
    },

    guideDateOptions() {
      return this.buildDateOptions(this.blogPosts);
    },

    dataSourceLabel() {
      return this.dataSource === 'database' ? 'D1 DB 연결됨' : '정적 데이터 fallback';
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
    window.addEventListener('popstate', this.applyCurrentRoute);
    this.applyCurrentRoute({ scroll: false, replaceMissing: false });
    this.loadRemoteContent().then(() => {
      this.applyCurrentRoute({ scroll: false, replaceMissing: true });
    });
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('popstate', this.applyCurrentRoute);
  },

  methods: {
    async loadRemoteContent() {
      try {
        const response = await fetch('/api/bootstrap', {
          headers: { accept: 'application/json' },
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error(`Remote content returned ${response.status}`);
        }

        const payload = await response.json();

        if (Array.isArray(payload.trends) && payload.trends.length > 0) {
          this.trends = payload.trends.map(normalizeTrendCard);
          this.activeTrendDate = this.resolveDateParam(this.trends, this.activeTrendDate);
        }

        if (Array.isArray(payload.guides) && payload.guides.length > 0) {
          this.blogPosts = payload.guides.map(normalizeSurvivalGuide);
          this.activeGuideDate = this.resolveDateParam(this.blogPosts, this.activeGuideDate);
        }

        if (Array.isArray(payload.news)) {
          this.crawledNews = payload.news;
        }

        if (payload.summaries && typeof payload.summaries === 'object') {
          this.crawledSummaries = payload.summaries;
        }

        this.dataSource = 'database';
        this.dataLoadedAt = payload.updatedAt || new Date().toISOString();
      } catch (error) {
        this.dataSource = 'static';
        this.dataLoadedAt = null;
        console.info('Using static fallback data:', error.message);
      }
    },

    goHome() {
      this.navigateTo('/');
    },

    switchTab(tabId) {
      this.navigateTo(tabId === 'blog' ? this.blogListRoute() : this.trendListRoute());
    },

    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
    },

    setCategoryFilter(filterId) {
      this.activeCategoryFilter = filterId;
      if (filterId !== 'realtime') {
        this.activeJobFilter = 'all';
      }
      this.replaceWithCurrentListRoute();
    },

    setNewsRegion(regionId) {
      this.activeNewsRegion = regionId;
      this.replaceWithCurrentListRoute();
    },

    setSummaryPeriod(periodId) {
      this.activeSummaryPeriod = periodId;
      this.replaceWithCurrentListRoute();
    },

    setJobFilter(jobId) {
      this.activeJobFilter = jobId;
      this.replaceWithCurrentListRoute();
    },

    setJobGuide(jobId) {
      this.activeJobGuide = jobId;
      this.replaceWithCurrentListRoute();
    },

    setTrendDate(date) {
      this.activeTrendDate = date;
      this.replaceWithCurrentListRoute();
    },

    setGuideDate(date) {
      this.activeGuideDate = date;
      this.replaceWithCurrentListRoute();
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
      this.navigateTo(`/guides/${encodeRoutePart(postId)}`);
    },

    closePost() {
      this.navigateTo(this.blogListRoute());
    },

    openTrendDetail(trendId) {
      this.navigateTo(`/trends/${encodeRoutePart(trendId)}`);
    },

    closeTrendDetail() {
      this.navigateTo(this.trendListRoute());
    },

    openNewsDetail(item) {
      this.navigateTo(this.newsDetailRoute(item.key));
    },

    closeNewsDetail() {
      this.navigateTo(this.trendListRoute());
    },

    parseCurrentRoute() {
      const hashRoute = window.location.hash.startsWith('#/')
        ? window.location.hash.slice(1)
        : null;
      const rawPath = hashRoute || window.location.pathname || '/';
      const [pathOnly, hashQuery = ''] = rawPath.split('?');
      const normalizedPath = `/${pathOnly.split('/').filter(Boolean).join('/')}`;
      const path = normalizedPath === '/' ? '/' : normalizedPath.replace(/\/$/, '');
      const queryString = hashRoute ? hashQuery : window.location.search.slice(1);
      const params = new URLSearchParams(queryString);
      const parts = path.split('/').filter(Boolean);

      return { path, parts, params };
    },

    applyCurrentRoute(options = {}) {
      const { scroll = true, replaceMissing = true } = options;
      const route = this.parseCurrentRoute();
      const [section, rawId] = route.parts;

      this.routeInitialized = true;
      this.selectedPostId = null;
      this.selectedNewsKey = null;
      this.selectedTrendId = null;
      this.showGuideComposer = false;

      if (!section || section === 'trends') {
        this.activeTab = 'trends';
        this.applyTrendRouteParams(route.params);
        if (rawId) {
          const trendId = decodeRoutePart(rawId);
          if (!replaceMissing || this.trends.some((trend) => trend.id === trendId)) {
            this.selectedTrendId = trendId;
          } else {
            this.navigateTo(this.trendListRoute(), { replace: true, scroll: false });
            return;
          }
        }
      } else if (section === 'news') {
        this.activeTab = 'trends';
        this.applyTrendRouteParams(route.params);
        if (rawId) {
          const newsKey = decodeRoutePart(rawId);
          if (!replaceMissing || this.crawledNews.some((item, index) => this.decorateNewsItem(item, index).key === newsKey)) {
            this.selectedNewsKey = newsKey;
          } else {
            this.navigateTo(this.trendListRoute(), { replace: true, scroll: false });
            return;
          }
        }
      } else if (section === 'guides' || section === 'blog') {
        this.activeTab = 'blog';
        this.applyBlogRouteParams(route.params);
        if (rawId) {
          if (rawId === 'new') {
            this.showGuideComposer = true;
            this.updateDocumentTitle();
            if (scroll) this.scrollTop();
            return;
          }
          const postId = decodeRoutePart(rawId);
          if (!replaceMissing || this.blogPosts.some((post) => post.id === postId)) {
            this.selectedPostId = postId;
          } else {
            this.navigateTo(this.blogListRoute(), { replace: true, scroll: false });
            return;
          }
        }
      } else {
        this.navigateTo('/', { replace: true, scroll: false });
        return;
      }

      this.updateDocumentTitle();
      if (scroll) this.scrollTop();
    },

    applyTrendRouteParams(params) {
      const filter = params.get('filter');
      const region = params.get('region');
      const period = params.get('period');
      const job = params.get('job');
      const date = params.get('date');
      const query = params.get('q');

      this.activeCategoryFilter = this.categoryFilters.some((item) => item.id === filter) ? filter : 'all';
      this.activeNewsRegion = this.newsRegions.some((item) => item.id === region) ? region : 'overseas';
      this.activeSummaryPeriod = this.summaryPeriods.some((item) => item.id === period) ? period : 'daily';
      this.activeJobFilter = this.realtimeJobFilters.some((item) => item.id === job) ? job : 'all';
      this.activeTrendDate = this.resolveDateParam(this.trends, date);
      this.searchQuery = query || '';

      if (this.activeCategoryFilter !== 'realtime') {
        this.activeJobFilter = 'all';
      }
    },

    applyBlogRouteParams(params) {
      const job = params.get('job');
      const date = params.get('date');
      const source = params.get('source');
      this.activeJobGuide = this.jobTabs.some((item) => item.id === job) ? job : 'FE';
      this.activeGuideDate = this.resolveDateParam(this.blogPosts, date);
      this.guideSourceFilter = this.guideSourceFilters.some((item) => item.id === source) ? source : 'all';
    },

    navigateTo(path, options = {}) {
      const { replace = false, scroll = true } = options;
      const nextPath = path || '/';
      const current = `${window.location.pathname}${window.location.search}`;

      if (current !== nextPath) {
        window.history[replace ? 'replaceState' : 'pushState']({}, '', nextPath);
      }

      this.applyCurrentRoute({ scroll, replaceMissing: true });
    },

    replaceWithCurrentListRoute() {
      if (!this.routeInitialized || this.selectedPost || this.selectedNews || this.selectedTrend || this.showGuideComposer) {
        return;
      }

      this.navigateTo(this.activeTab === 'blog' ? this.blogListRoute() : this.trendListRoute(), {
        replace: true,
        scroll: false
      });
    },

    trendListRoute() {
      const params = new URLSearchParams();

      if (this.activeCategoryFilter !== 'all') params.set('filter', this.activeCategoryFilter);
      if (this.activeNewsRegion !== 'overseas') params.set('region', this.activeNewsRegion);
      if (this.activeSummaryPeriod !== 'daily') params.set('period', this.activeSummaryPeriod);
      if (this.activeCategoryFilter === 'realtime' && this.activeJobFilter !== 'all') params.set('job', this.activeJobFilter);
      if (this.activeCategoryFilter !== 'realtime' && this.activeTrendDate !== 'all') params.set('date', this.activeTrendDate);
      if (this.searchQuery) params.set('q', this.searchQuery);

      const query = params.toString();
      return `/trends${query ? `?${query}` : ''}`;
    },

    newsDetailRoute(newsKey) {
      const params = new URLSearchParams();

      params.set('filter', 'realtime');
      if (this.activeNewsRegion !== 'overseas') params.set('region', this.activeNewsRegion);
      if (this.activeSummaryPeriod !== 'daily') params.set('period', this.activeSummaryPeriod);
      if (this.activeJobFilter !== 'all') params.set('job', this.activeJobFilter);
      if (this.searchQuery) params.set('q', this.searchQuery);

      return `/news/${encodeRoutePart(newsKey)}?${params.toString()}`;
    },

    blogListRoute() {
      const params = new URLSearchParams();
      if (this.activeJobGuide !== 'FE') params.set('job', this.activeJobGuide);
      if (this.activeGuideDate !== 'all') params.set('date', this.activeGuideDate);
      if (this.guideSourceFilter !== 'all') params.set('source', this.guideSourceFilter);
      const query = params.toString();
      return `/guides${query ? `?${query}` : ''}`;
    },

    openGuideComposer() {
      this.guideSubmitStatus = 'idle';
      this.guideSubmitMessage = '';
      this.navigateTo('/guides/new');
    },

    closeGuideComposer() {
      this.navigateTo(this.blogListRoute());
    },

    resetGuideForm() {
      this.guideForm = createGuideFormDefaults();
      this.guideSubmitStatus = 'idle';
      this.guideSubmitMessage = '';
    },

    setGuideSourceFilter(source) {
      this.guideSourceFilter = source;
      this.replaceWithCurrentListRoute();
    },

    async submitUserGuide() {
      if (this.guideSubmitStatus === 'submitting') return;

      this.guideSubmitStatus = 'submitting';
      this.guideSubmitMessage = '';

      try {
        const response = await fetch('/api/user-guides', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            accept: 'application/json'
          },
          body: JSON.stringify(this.guideForm)
        });
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.error || `제출 실패 (${response.status})`);
        }

        this.guideSubmitStatus = 'success';
        this.guideSubmitMessage = payload.message || '생존 가이드 초안이 접수되었습니다.';
        this.guideForm = createGuideFormDefaults();
      } catch (error) {
        this.guideSubmitStatus = 'error';
        this.guideSubmitMessage = error.message || '제출 중 오류가 발생했습니다.';
      }
    },

    buildDateOptions(items) {
      const dates = [...new Set(items.map((item) => item.date).filter(Boolean))]
        .sort((a, b) => b.localeCompare(a));

      return [
        { id: 'all', label: '전체' },
        { id: 'latest', label: '최신' },
        ...dates.map((date) => ({ id: date, label: date }))
      ];
    },

    latestDate(items) {
      return [...new Set(items.map((item) => item.date).filter(Boolean))]
        .sort((a, b) => b.localeCompare(a))[0] || '';
    },

    resolveDateParam(items, date) {
      if (!date || date === 'all') return 'all';
      if (date === 'latest') return 'latest';
      return items.some((item) => item.date === date) ? date : 'all';
    },

    updateDocumentTitle() {
      const suffix = 'AI 밥그릇';

      if (this.selectedTrend) {
        document.title = `${this.selectedTrend.title} | ${suffix}`;
        return;
      }

      if (this.selectedNews) {
        document.title = `${this.selectedNews.title} | ${suffix}`;
        return;
      }

      if (this.selectedPost) {
        document.title = `${this.selectedPost.title} | ${suffix}`;
        return;
      }

      if (this.showGuideComposer) {
        document.title = `생존 가이드 작성 | ${suffix}`;
        return;
      }

      document.title = this.activeTab === 'blog'
        ? `개발자 생존 가이드 | ${suffix}`
        : `최신 AI 트렌드 | ${suffix}`;
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
      const identity = [
        item.link,
        item.title,
        item.source,
        item.pubDate
      ].filter(Boolean).join('|') || `item-${index}`;

      return {
        ...item,
        key: `realtime-${stableHash(identity)}`,
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

    newsDisplayTitle(item) {
      return item?.koreanTitle || item?.title || '제목 없음';
    },

    newsFullSummary(item) {
      return item?.fullSummary || item?.summary || item?.description || 'RSS 피드에서 제공된 요약 정보가 없습니다. 원문 링크에서 전체 내용을 확인하세요.';
    },

    newsDisplaySummary(item) {
      return item?.displaySummary || this.newsFullSummary(item);
    },

    newsSummaryLines(item) {
      return String(item?.koreanSummary || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
    },

    newsSummaryBullets(item) {
      return this.newsSummaryLines(item)
        .filter((line) => line.startsWith('- '))
        .map((line) => line.replace(/^-\s+/, ''));
    },

    newsSummaryMeta(item) {
      return this.newsSummaryLines(item)
        .find((line) => line.startsWith('메타:')) || '';
    },

    newsLead(item) {
      return this.newsSummaryBullets(item)[0] || this.newsKoreanBrief(item);
    },

    newsKoreanBrief(item) {
      if (item.koreanSummary) {
        return this.newsSummaryBullets(item).join(' ') || this.newsSummaryLines(item).join(' ');
      }

      const text = `${item.title || ''} ${this.newsDisplaySummary(item)}`.toLowerCase();
      const categories = item.categories || [];
      const topic = this.newsTopicLabel(text, categories);
      const action = this.newsActionLabel(text, categories);

      return `${this.regionLabel(item)} ${item.source || 'RSS'}에서 수집한 ${topic} 관련 소식입니다. ${action}`;
    },

    newsDeveloperPoints(item) {
      const text = `${item.title || ''} ${this.newsDisplaySummary(item)}`.toLowerCase();
      const points = [];

      if (/agent|mcp|orchestration|workflow|tool/.test(text)) {
        points.push('Agent나 MCP 도입 후보라면 권한 범위, tool 실행 로그, 승인 단계를 먼저 확인하세요.');
      }
      if (/context|rag|retrieval|prompt/.test(text)) {
        points.push('RAG/컨텍스트 품질 신호입니다. 출처, 최신성, 압축 과정이 관리되는지 보세요.');
      }
      if (/llm|model|open-weight|kimi|qwen|gpt|gemini|grok|bedrock/.test(text)) {
        points.push('모델 선택 신호입니다. 성능표보다 비용, region, fallback, eval 통과 여부가 중요합니다.');
      }
      if (/gpu|chip|compute|serving|kubernetes|data center|inference/.test(text)) {
        points.push('AI 인프라 신호입니다. p95 latency, cache, queue, serving 비용으로 연결해 보세요.');
      }
      if (/security|vulnerability|waf|e2ee|privacy|copyright|lawsuit|scrap|bot/.test(text)) {
        points.push('보안/데이터 경계 신호입니다. 권리, 암호화, 차단 정책, 감사 로그를 확인하세요.');
      }
      if (/review|test|qa|playwright|verification|coding|copilot/.test(text) || (item.categories || []).includes('QA')) {
        points.push('AI 개발 검증 신호입니다. 테스트 하네스와 리뷰 acceptance 기준으로 바꿔볼 수 있습니다.');
      }

      if (!points.length) {
        points.push('단일 기사로 단정하지 말고 같은 출처/카테고리의 반복 신호와 함께 보세요.');
        points.push('원문에서 실제 제품 변화, API 변경, 가격·정책 조건이 있는지 확인하세요.');
      }

      return points.slice(0, 3);
    },

    newsTopicLabel(text, categories) {
      if (/agent|mcp|orchestration|workflow|tool/.test(text)) return 'AI 에이전트와 도구 연동';
      if (/context|rag|retrieval|prompt/.test(text)) return '컨텍스트 엔지니어링과 RAG';
      if (/llm|model|open-weight|kimi|qwen|gpt|gemini|grok|bedrock/.test(text)) return '모델 선택과 LLM 운영';
      if (/gpu|chip|compute|serving|kubernetes|data center|inference/.test(text)) return 'AI 인프라와 서빙 비용';
      if (/security|vulnerability|waf|e2ee|privacy|copyright|lawsuit|scrap|bot/.test(text)) return '보안, 데이터 경계, 콘텐츠 권리';
      if (/review|test|qa|playwright|verification|coding|copilot/.test(text)) return 'AI 개발 검증과 코드 리뷰';
      if (categories.includes('FE')) return '프론트엔드와 사용자 경험';
      if (categories.includes('DevOps')) return '플랫폼 운영과 DevOps';
      if (categories.includes('Security')) return '보안 운영';
      return 'AI/IT 산업 변화';
    },

    newsActionLabel(text, categories) {
      if (/launch|introduc|release|available|announc/.test(text)) {
        return '새 기능/제품 발표 성격이 강하므로 실제 API, 가격, 적용 범위를 확인하세요.';
      }
      if (/lawsuit|settlement|ban|policy|copyright|regulat/.test(text)) {
        return '법적·정책적 리스크 신호이므로 데이터 사용 조건과 제품 노출 범위를 점검하세요.';
      }
      if (/security|vulnerability|attack|breach|waf|e2ee/.test(text)) {
        return '보안 운영 신호이므로 권한, 로그, 패치, 암호화 경계를 우선 확인하세요.';
      }
      if (/cost|compute|serving|gpu|chip|inference/.test(text)) {
        return '비용과 성능 신호이므로 latency, cache, fallback, 사용량 지표로 연결해 보세요.';
      }
      if (/test|qa|review|verification|playwright/.test(text) || categories.includes('QA')) {
        return '검증 체계 신호이므로 테스트 하네스와 리뷰 기준으로 바꿔볼 수 있습니다.';
      }
      return '개발팀에는 도입 여부보다 권한, 비용, 검증, 운영 부담을 함께 보는 관점이 중요합니다.';
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
