const { createApp } = Vue;

function authDefaults() {
  return {
    login: {
      email: '',
      password: ''
    },
    signup: {
      name: '',
      email: '',
      password: ''
    }
  };
}

createApp({
  data() {
    const defaults = authDefaults();

    return {
      loading: true,
      authBusy: false,
      guidesLoading: false,
      user: null,
      guides: [],
      activeStatus: 'pending',
      message: '',
      messageType: 'success',
      loginForm: defaults.login,
      signupForm: defaults.signup,
      statusFilters: [
        { id: 'pending', label: '검토 대기' },
        { id: 'published', label: '공개됨' },
        { id: 'rejected', label: '반려됨' },
        { id: 'all', label: '전체' }
      ]
    };
  },

  computed: {
    filteredGuides() {
      if (this.activeStatus === 'all') return this.guides;
      return this.guides.filter((guide) => guide.status === this.activeStatus);
    }
  },

  mounted() {
    this.loadSession();
  },

  methods: {
    goSite() {
      window.location.href = '/';
    },

    statusLabel(status) {
      return {
        pending: '검토 대기',
        published: '공개',
        rejected: '반려'
      }[status] || status;
    },

    statusCount(status) {
      if (status === 'all') return this.guides.length;
      return this.guides.filter((guide) => guide.status === status).length;
    },

    setStatusFilter(status) {
      this.activeStatus = status;
    },

    showMessage(message, type = 'success') {
      this.message = message;
      this.messageType = type;
      window.clearTimeout(this.messageTimer);
      this.messageTimer = window.setTimeout(() => {
        this.message = '';
      }, 5000);
    },

    async api(path, options = {}) {
      const response = await fetch(path, {
        credentials: 'include',
        headers: {
          accept: 'application/json',
          ...(options.body ? { 'content-type': 'application/json' } : {}),
          ...(options.headers || {})
        },
        ...options,
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || `요청 실패 (${response.status})`);
      }

      return payload;
    },

    async loadSession() {
      this.loading = true;
      try {
        const payload = await this.api('/api/admin/auth');
        this.user = payload.user || null;
        if (this.user) await this.loadGuides();
      } catch (error) {
        this.showMessage(error.message, 'error');
      } finally {
        this.loading = false;
      }
    },

    async signup() {
      this.authBusy = true;
      try {
        const payload = await this.api('/api/admin/auth', {
          method: 'POST',
          body: {
            action: 'signup',
            ...this.signupForm
          }
        });
        this.user = payload.user;
        this.showMessage(payload.message || '관리자 가입이 완료됐습니다.');
        await this.loadGuides();
      } catch (error) {
        this.showMessage(error.message, 'error');
      } finally {
        this.authBusy = false;
      }
    },

    async login() {
      this.authBusy = true;
      try {
        const payload = await this.api('/api/admin/auth', {
          method: 'POST',
          body: {
            action: 'login',
            ...this.loginForm
          }
        });
        this.user = payload.user;
        this.showMessage('로그인했습니다.');
        await this.loadGuides();
      } catch (error) {
        this.showMessage(error.message, 'error');
      } finally {
        this.authBusy = false;
      }
    },

    async logout() {
      try {
        await this.api('/api/admin/auth', {
          method: 'POST',
          body: { action: 'logout' }
        });
      } catch (error) {
        this.showMessage(error.message, 'error');
      } finally {
        this.user = null;
        this.guides = [];
      }
    },

    async loadGuides() {
      this.guidesLoading = true;
      try {
        const payload = await this.api('/api/admin/guides');
        this.guides = (payload.guides || []).map((guide) => ({
          ...guide,
          reviewDraft: guide.reviewNote || ''
        }));
      } catch (error) {
        this.showMessage(error.message, 'error');
      } finally {
        this.guidesLoading = false;
      }
    },

    async updateGuideStatus(guide, status) {
      try {
        const payload = await this.api('/api/admin/guides', {
          method: 'PATCH',
          body: {
            id: guide.id,
            status,
            reviewNote: guide.reviewDraft || ''
          }
        });
        const nextGuide = {
          ...payload.guide,
          reviewDraft: payload.guide.reviewNote || ''
        };
        this.guides = this.guides.map((item) => (item.id === nextGuide.id ? nextGuide : item));
        this.showMessage(`"${guide.title}" 상태를 ${this.statusLabel(status)}로 변경했습니다.`);
      } catch (error) {
        this.showMessage(error.message, 'error');
      }
    }
  }
}).mount('#admin-app');
