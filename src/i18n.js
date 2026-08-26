import { CONTENT } from './content.js';

const STORAGE_KEY = 'yellow_archive_lang';

export class I18nEngine {
  constructor() {
    this.currentLang = localStorage.getItem(STORAGE_KEY) || 'en';
    this.listeners = [];
  }

  init() {
    this.applyLanguage(this.currentLang);
  }

  getLang() {
    return this.currentLang;
  }

  setLang(lang) {
    if (lang !== 'en' && lang !== 'ar') return;
    this.currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    this.applyLanguage(lang);
    this.notifyListeners();
  }

  toggleLang() {
    const nextLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.setLang(nextLang);
  }

  applyLanguage(lang) {
    const htmlEl = document.documentElement;
    htmlEl.setAttribute('lang', lang);
    htmlEl.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    if (lang === 'ar') {
      document.body.classList.add('font-arabic');
      document.body.classList.remove('font-english');
    } else {
      document.body.classList.add('font-english');
      document.body.classList.remove('font-arabic');
    }

    // Trigger UI updates across registered elements
    this.updateDomTranslations();
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    this.listeners.forEach(fn => fn(this.currentLang));
  }

  // Get string by dot path e.g. "hero.title" or direct object
  t(pathStr) {
    const keys = pathStr.split('.');
    let result = CONTENT;
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        return pathStr;
      }
    }
    if (result && typeof result === 'object' && result[this.currentLang] !== undefined) {
      return result[this.currentLang];
    }
    return typeof result === 'string' ? result : pathStr;
  }

  updateDomTranslations() {
    const translatableElements = document.querySelectorAll('[data-i18n]');
    translatableElements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = this.t(key);
      if (val && typeof val === 'string') {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Update active state on toggle buttons
    const langBtns = document.querySelectorAll('.lang-toggle-btn');
    langBtns.forEach(btn => {
      const targetLang = btn.getAttribute('data-lang');
      if (targetLang === this.currentLang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }
}

export const i18n = new I18nEngine();
