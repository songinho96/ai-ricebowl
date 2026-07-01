document.addEventListener('DOMContentLoaded', () => {
  // --- UI Elements ---
  const tabBtns = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const trendsSearch = document.getElementById('trends-search');
  const tagFilterBtns = document.querySelectorAll('.tag-filter-btn');
  const trendsGrid = document.getElementById('trends-grid');
  const blogGrid = document.getElementById('blog-grid');
  
  // Summary Panel Elements
  const summaryPanel = document.getElementById('summary-panel');
  const summaryBodyContent = document.getElementById('gemini-summary-content');
  const summaryTabBtns = document.querySelectorAll('.summary-tab-btn');

  // Job Guidebook Elements
  const jobSelectorTabs = document.getElementById('job-selector-tabs');
  const jobGuideDisplayCard = document.getElementById('job-guide-display-card');
  const realtimeJobFilter = document.getElementById('realtime-job-filter');
  
  // Blog Reader Elements
  const blogReaderView = document.getElementById('blog-reader-view');
  const readerBackBtn = document.getElementById('reader-back-btn');
  const readerCategory = document.getElementById('reader-category');
  const readerTitle = document.getElementById('reader-title');
  const readerSubtitle = document.getElementById('reader-subtitle');
  const readerAuthor = document.getElementById('reader-author');
  const readerDate = document.getElementById('reader-date');
  const readerReadtime = document.getElementById('reader-readtime');
  const readerImage = document.getElementById('reader-image');
  const readerBodyContent = document.getElementById('reader-body-content');
  
  // Hero Banner elements to modify
  const heroSection = document.getElementById('hero-section');
  const heroTitle = document.getElementById('hero-title');
  const heroDesc = document.getElementById('hero-desc');
  const heroTagText = document.getElementById('hero-tag-text');
  const heroImage = document.getElementById('hero-image');
  
  // Navigation elements
  const navLogo = document.getElementById('nav-logo');
  const backToTopBtn = document.getElementById('back-to-top');

  // --- State Variables ---
  let activeTab = 'trends';
  let activeCategoryFilter = 'all';
  let activeJobFilter = 'all';
  let searchQuery = '';
  let bookmarkedIds = JSON.parse(localStorage.getItem('ai_bookmarks')) || [];
  
  // --- Theme Initializer ---
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  // --- Initialize UI ---
  renderTrends();
  renderBlogPosts();
  renderGeminiSummary('daily');
  renderJobGuide('FE');

  // --- Navigation Logo Click Handler ---
  navLogo.addEventListener('click', () => {
    switchTab('trends');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Tab Navigation Handlers ---
  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  function switchTab(tabId) {
    activeTab = tabId;
    
    // Reset reader view when switching tabs
    blogReaderView.style.display = 'none';
    
    // Update button states
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update visibility of content sections
    tabContents.forEach(content => {
      if (content.id === `tab-${tabId}`) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });

    // Update Hero Banner context depending on the selected tab
    heroSection.style.display = 'flex';
    if (tabId === 'trends') {
      heroTagText.innerText = "AI TREND AGGREGATOR";
      heroTitle.innerHTML = "AI 격변의 시대,<br>우리의 밥그릇을 더 단단하게.";
      heroDesc.innerText = "최신 인공지능 기술 동향을 분석하고, 실무 워크플로우에 결합하여 개발 생산성을 혁신하는 방법을 제안합니다.";
      heroImage.src = "assets/hero_banner.png";
    } else if (tabId === 'blog') {
      heroTagText.innerText = "DEVELOPER SURVIVAL GUIDE";
      heroTitle.innerHTML = "코딩 비서에서 에이전트까지,<br>살아남는 개발자의 가이드.";
      heroDesc.innerText = "단순 타이핑 중심의 코더에서 여러 AI 도구를 지휘하는 오케스트레이터로 도약하는 심층 가이드를 소개합니다.";
      heroImage.src = "assets/blog_survival.png";
    }
  }

  // --- Gemini Summary Tab Navigation ---
  summaryTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      summaryTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const period = btn.getAttribute('data-period');
      renderGeminiSummary(period);
    });
  });

  function renderGeminiSummary(period) {
    if (!window.crawledSummaries || !window.crawledSummaries[period]) {
      summaryBodyContent.innerHTML = "<p>요약 데이터를 불러올 수 없습니다.</p>";
      return;
    }

    const rawMd = window.crawledSummaries[period];
    let html = parseSimpleMarkdown(rawMd);
    summaryBodyContent.innerHTML = html;
  }

  // Simple Markdown Parser helper for summaries
  function parseSimpleMarkdown(md) {
    let html = md;
    // Replace headers (###)
    html = html.replace(/^\s*###\s+(.*?)$/gm, '<h3>$1</h3>');
    // Replace bold text (**text**)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Replace bullet points (* item or - item)
    html = html.replace(/^\s*[\*\-]\s+(.*?)$/gm, '<li>$1</li>');
    
    // Wrap consecutive list items in <ul>
    const lines = html.split('\n');
    let parsedLines = [];
    let inList = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('<li>')) {
        if (!inList) {
          parsedLines.push('<ul>');
          inList = true;
        }
        parsedLines.push(trimmed);
      } else {
        if (inList) {
          parsedLines.push('</ul>');
          inList = false;
        }
        if (trimmed && !trimmed.startsWith('<h3>') && !trimmed.startsWith('<ul>') && !trimmed.startsWith('</ul>')) {
          parsedLines.push(`<p>${trimmed}</p>`);
        } else {
          parsedLines.push(trimmed);
        }
      }
    });
    if (inList) parsedLines.push('</ul>');
    
    return parsedLines.join('\n');
  }

  // --- Theme Toggle ---
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-sun';
    } else {
      themeIcon.className = 'fa-solid fa-moon';
    }
  }

  // --- Scroll to Top Button ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Search & Filter Logic ---
  trendsSearch.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderTrends();
  });

  tagFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tagFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategoryFilter = btn.getAttribute('data-category');
      
      // Toggle visibility of job sub-filter bar
      if (activeCategoryFilter === 'realtime') {
        realtimeJobFilter.style.display = 'flex';
      } else {
        realtimeJobFilter.style.display = 'none';
        activeJobFilter = 'all';
        document.querySelectorAll('.job-sub-btn').forEach(b => {
          if (b.getAttribute('data-job') === 'all') b.classList.add('active');
          else b.classList.remove('active');
        });
      }
      renderTrends();
    });
  });

  // Setup click listeners for real-time news job sub-filters
  document.querySelectorAll('.job-sub-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.job-sub-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeJobFilter = btn.getAttribute('data-job');
      renderTrends();
    });
  });

  // Setup click listeners for Job Guidebook tabs
  document.querySelectorAll('.job-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.job-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const jobCode = btn.getAttribute('data-job');
      renderJobGuide(jobCode);
    });
  });

  // Helper to map feed names to style codes
  function getSourceCode(source) {
    if (source.includes("TechCrunch")) return "TC";
    if (source.includes("Hacker News")) return "HN";
    if (source.includes("Toss")) return "Toss";
    if (source.includes("Kakao")) return "Kakao";
    return "default";
  }

  // --- Render AI Trends ---
  function renderTrends() {
    trendsGrid.innerHTML = '';

    // Handle Real-time News Feed rendering
    if (activeCategoryFilter === 'realtime') {
      if (!window.crawledNews || window.crawledNews.length === 0) {
        trendsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; background: var(--bg-panel); border-radius: 16px; border: 1px dashed var(--border);">
            <i class="fa-solid fa-rss" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
            <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">수집된 실시간 뉴스 데이터가 없습니다</h4>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">
              터미널에서 \`/usr/bin/python3 crawler.py\` 명령어를 실행해 실시간 IT 뉴스 크롤링 데이터를 가져오십시오.
            </p>
          </div>
        `;
        return;
      }

      // Filter crawled news based on search query and job category
      const filteredNews = window.crawledNews.filter(item => {
        // 1. Job Role Filter
        if (activeJobFilter !== 'all') {
          if (!item.categories || !item.categories.includes(activeJobFilter)) return false;
        }
        
        // 2. Search Query Filter
        if (searchQuery) {
          const matchesTitle = item.title.toLowerCase().includes(searchQuery);
          const matchesDesc = (item.description || '').toLowerCase().includes(searchQuery);
          const matchesSource = item.source.toLowerCase().includes(searchQuery);
          return matchesTitle || matchesDesc || matchesSource;
        }
        return true;
      });

      if (filteredNews.length === 0) {
        trendsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; background: var(--bg-panel); border-radius: 16px; border: 1px dashed var(--border);">
            <i class="fa-solid fa-folder-open" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
            <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">일치하는 검색 결과가 없습니다</h4>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">다른 검색어로 검색해 보십시오.</p>
          </div>
        `;
        return;
      }

      filteredNews.forEach(item => {
        const card = document.createElement('div');
        card.className = 'trend-card';
        const sourceCode = getSourceCode(item.source);

        card.innerHTML = `
          <div>
            <div class="card-header">
              <span class="card-category realtime-tag-${sourceCode}">${item.source}</span>
            </div>
            <h3 style="font-size: 1.15rem; margin-bottom: 0.75rem;">${item.title}</h3>
            <p class="summary" style="font-size: 0.9rem; margin-bottom: 1.25rem; -webkit-line-clamp: 4;">
              ${item.description || "상세 내용 요약이 없습니다. 원문 보기 링크를 통해 전체 기사를 확인하세요."}
            </p>
          </div>
          <div class="card-footer" style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 1rem;">
            <span style="font-size: 0.78rem; color: var(--text-muted);"><i class="fa-regular fa-clock"></i> ${item.pubDate ? item.pubDate.split(' ').slice(0, 4).join(' ') : "최신"}</span>
            <a href="${item.link}" target="_blank" class="news-link-btn">
              원문 보기 <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
        `;
        trendsGrid.appendChild(card);
      });
      return;
    }
    
    // Regular Curated Cards Filter
    const filtered = window.aiTrendsData.filter(item => {
      // 1. Filter by category
      if (activeCategoryFilter === 'bookmarks') {
        if (!bookmarkedIds.includes(item.id)) return false;
      } else if (activeCategoryFilter !== 'all' && item.category !== activeCategoryFilter) {
        return false;
      }
      
      // 2. Filter by search query
      if (searchQuery) {
        const matchesTitle = item.title.toLowerCase().includes(searchQuery);
        const matchesSummary = item.summary.toLowerCase().includes(searchQuery);
        const matchesContent = item.content.toLowerCase().includes(searchQuery);
        const matchesTags = item.tags.some(tag => tag.toLowerCase().includes(searchQuery));
        return matchesTitle || matchesSummary || matchesContent || matchesTags;
      }
      
      return true;
    });

    // Handle empty state
    if (filtered.length === 0) {
      trendsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; background: var(--bg-panel); border-radius: 16px; border: 1px dashed var(--border);">
          <i class="fa-solid fa-folder-open" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
          <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">일치하는 검색 결과가 없습니다</h4>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">다른 검색어를 입력하시거나 카테고리 필터를 변경해 보세요.</p>
        </div>
      `;
      return;
    }

    // Build card elements
    filtered.forEach(item => {
      const isBookmarked = bookmarkedIds.includes(item.id);
      const card = document.createElement('div');
      card.className = 'trend-card';
      
      // Render bullet list HTML
      const bulletListHtml = item.trends.map(bullet => `<li>${bullet}</li>`).join('');
      
      // Render tag list HTML
      const tagListHtml = item.tags.map(tag => `<span class="card-tag">#${tag}</span>`).join('');
      
      card.innerHTML = `
        <div>
          <div class="card-header">
            <span class="card-category">${item.category}</span>
            <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" data-id="${item.id}" aria-label="북마크 토글">
              <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
            </button>
          </div>
          <h3>${item.title}</h3>
          <p class="summary">${item.summary}</p>
          <ul class="trend-bullets">
            ${bulletListHtml}
          </ul>
        </div>
        <div class="card-footer">
          <div class="card-tags">
            ${tagListHtml}
          </div>
          <div>
            <i class="fa-regular fa-eye"></i> ${item.views}
          </div>
        </div>
      `;

      // Setup Bookmark Interaction
      const bookmarkBtn = card.querySelector('.bookmark-btn');
      bookmarkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBookmark(item.id);
      });

      trendsGrid.appendChild(card);
    });
  }

  // --- Bookmark Toggle Handler ---
  function toggleBookmark(id) {
    const idx = bookmarkedIds.indexOf(id);
    if (idx > -1) {
      bookmarkedIds.splice(idx, 1);
    } else {
      bookmarkedIds.push(id);
    }
    localStorage.setItem('ai_bookmarks', JSON.stringify(bookmarkedIds));
    renderTrends();
  }

  // --- Render Blog Cards ---
  function renderBlogPosts() {
    blogGrid.innerHTML = '';
    
    window.blogPostsData.forEach(post => {
      const card = document.createElement('div');
      card.className = 'blog-card';
      
      card.innerHTML = `
        <div class="blog-card-img-wrapper">
          <img src="${post.image}" alt="${post.title}" class="blog-card-img">
        </div>
        <div class="blog-card-content">
          <div class="blog-meta">
            <span>${post.category}</span>
            <span>&bull;</span>
            <span>${post.readTime}</span>
          </div>
          <h2>${post.title}</h2>
          <p class="subtitle">${post.subtitle}</p>
          <button class="read-more-btn" data-post-id="${post.id}">
            자세히 보기 <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      `;

      const readMoreBtn = card.querySelector('.read-more-btn');
      readMoreBtn.addEventListener('click', () => {
        openBlogPost(post.id);
      });

      blogGrid.appendChild(card);
    });
  }

  // --- Open Full Blog Post (Reader Mode) ---
  function openBlogPost(postId) {
    const post = window.blogPostsData.find(p => p.id === postId);
    if (!post) return;

    // Set header contents
    readerCategory.innerText = post.category;
    readerTitle.innerText = post.title;
    readerSubtitle.innerText = post.subtitle;
    readerAuthor.innerText = post.author;
    readerDate.innerText = post.date;
    readerReadtime.innerText = post.readTime;
    readerImage.src = post.image;
    
    // Parse body content (simple Markdown to HTML transformation)
    let bodyHtml = `<p class="introduction" style="font-size: 1.2rem; font-weight: 500; color: var(--text-primary); line-height: 1.8; margin-bottom: 2rem; border-bottom: 1px dashed var(--border); padding-bottom: 2rem;">${post.introduction}</p>`;
    
    post.sections.forEach(sec => {
      // 1. Process block Title
      bodyHtml += `<h3>${sec.title}</h3>`;
      
      // 2. Process paragraphs and code segments
      let contentHtml = sec.content;
      
      // Basic markdown replacement rules:
      // Code blocks (```javascript ... ```)
      contentHtml = contentHtml.replace(/```(javascript|python|html|css)?\n([\s\S]*?)```/g, (match, p1, p2) => {
        return `<pre><code>${escapeHtml(p2.trim())}</code></pre>`;
      });
      
      // Bold items (e.g. **bold**)
      contentHtml = contentHtml.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Bullet points (e.g. - list item)
      contentHtml = contentHtml.replace(/^\s*-\s+(.*?)$/gm, '<li>$1</li>');
      
      // Headers inside section (e.g. #### Title)
      contentHtml = contentHtml.replace(/^\s*####\s+(.*?)$/gm, '<h4>$1</h4>');
      
      // Custom callout box (e.g. 💡 description)
      contentHtml = contentHtml.replace(/^\s*💡\s+(.*?)$/gm, '<blockquote>💡 $1</blockquote>');
      contentHtml = contentHtml.replace(/^\s*🛠️\s+(.*?)$/gm, '<blockquote>🛠️ $1</blockquote>');
      
      // Split by double line breaks and wrap in paragraphs if not pre, blockquote, or header
      const lines = contentHtml.split('\n\n');
      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        
        if (trimmed.startsWith('<li>')) {
          bodyHtml += `<ul style="margin-bottom: 1.5rem; padding-left: 1.5rem;">${trimmed}</ul>`;
        } else if (trimmed.startsWith('<pre>') || trimmed.startsWith('<blockquote>') || trimmed.startsWith('<h3>') || trimmed.startsWith('<h4>')) {
          bodyHtml += trimmed;
        } else {
          bodyHtml += `<p>${trimmed}</p>`;
        }
      });
    });

    readerBodyContent.innerHTML = bodyHtml;

    // Show Reader view and hide tab content list + main hero section
    heroSection.style.display = 'none';
    tabContents.forEach(content => content.classList.remove('active'));
    blogReaderView.style.display = 'block';

    // Scroll reader container to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // --- Back from Reader View Handler ---
  readerBackBtn.addEventListener('click', () => {
    // Return to the Blog list view
    switchTab('blog');
  });

  // Render Job Guide Card in Blog tab
  function renderJobGuide(jobCode) {
    if (!window.jobRolesData || !window.jobRolesData[jobCode]) {
      jobGuideDisplayCard.innerHTML = "<p>직무 가이드 데이터를 로드할 수 없습니다.</p>";
      return;
    }

    const job = window.jobRolesData[jobCode];
    
    // Tools list HTML
    const toolsHtml = job.tools.map(tool => `<span class="job-guide-tool-badge">${tool}</span>`).join('');
    
    // Roadmap list HTML
    const roadmapHtml = job.roadmap.map(step => `<li>${step}</li>`).join('');

    jobGuideDisplayCard.innerHTML = `
      <div class="job-guide-header">
        <i class="fa-solid ${job.icon}" style="color: ${job.color};"></i>
        <h3>${job.name} AI 생존 가이드</h3>
      </div>
      <div class="job-guide-grid">
        <div>
          <div class="job-guide-section-block">
            <h4><i class="fa-solid fa-chart-line"></i> 직무별 AI 기술 트렌드</h4>
            <p>${job.trend}</p>
          </div>
          <div class="job-guide-section-block">
            <h4><i class="fa-solid fa-toolbox"></i> 추천 생산성 AI 도구</h4>
            <div class="job-guide-tools">
              ${toolsHtml}
            </div>
          </div>
        </div>
        <div>
          <div class="job-guide-section-block">
            <h4><i class="fa-solid fa-circle-info"></i> 주요 실무 가이드라인</h4>
            <p>${job.guideline}</p>
          </div>
          <div class="job-guide-section-block">
            <h4><i class="fa-solid fa-graduation-cap"></i> 추천 학습 로드맵</h4>
            <ul class="job-guide-roadmap">
              ${roadmapHtml}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  // Helper function to escape HTML inside pre tags
  function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
  }
});
