import { CONTENT } from './content.js';
import { i18n } from './i18n.js';
import { VarLineGame } from './var-line-game.js';
import { EscapeRunnerGame } from './escape-runner-game.js';
import { ComebackPenaltyGame } from './comeback-penalty-game.js';
import { db, auth } from './firebase.js';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  onSnapshot,
  increment
} from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// ---------------------------------------------------------------------------
// SHARED IDENTITY
// No sign-up/login screen on this site, but "who am I" is now a REAL Firebase
// Anonymous Auth identity (auth.uid) instead of a value the browser just made
// up. It's used to (a) know which leaderboard row is "mine" and (b) let a
// tale's author edit/delete only their own tale — and because it's backed by
// Firebase Auth, the Firestore Security Rules can verify it server-side, so a
// visitor can no longer fake being someone else by editing a field.
// ---------------------------------------------------------------------------
let currentUid = null;
let authFailed = false;
let resolveAuthReady;
let rejectAuthReady;
const authReadyPromise = new Promise((resolve, reject) => { resolveAuthReady = resolve; rejectAuthReady = reject; });

function startAnonymousAuth(onReady) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUid = user.uid;
      authFailed = false;
      resolveAuthReady(user.uid);
      if (onReady) onReady();
    }
  }, (err) => {
    console.error('Auth state error:', err);
    authFailed = true;
    rejectAuthReady(err);
  });
  signInAnonymously(auth).catch((err) => {
    console.error('Anonymous sign-in failed:', err);
    authFailed = true;
    rejectAuthReady(err);
  });
}

function getOwnerId() {
  return currentUid;
}

// Guards against the identity promise hanging forever (e.g. Anonymous Auth not
// enabled in the Firebase console, or the request being blocked by the
// network) — without this, any code awaiting it would silently freeze with no
// error and no feedback, which is exactly what made the submit buttons look
// like they were doing nothing at all.
function ensureOwnerId() {
  if (currentUid) return Promise.resolve(currentUid);
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('AUTH_TIMEOUT')), 8000);
  });
  return Promise.race([authReadyPromise, timeout]);
}

// Shared "who am I" name — set by either the arcade leaderboard join box or the
// tales publish form, and read back by both, so the name typed once carries over.
const SHARED_NAME_KEY = 'yelo_shared_display_name';

function getSharedName() {
  return localStorage.getItem(SHARED_NAME_KEY) || '';
}

function setSharedName(name) {
  if (name) localStorage.setItem(SHARED_NAME_KEY, name);
}

// ---------------------------------------------------------------------------
// LEADERBOARD STORAGE — backed by Firestore, so the table is real and shared
// across every visitor's browser/device, updated live via onSnapshot.
// ---------------------------------------------------------------------------
const LEADERBOARD_COLLECTION = 'leaderboard_entries';
let leaderboardEntriesCache = [];

function startLeaderboardSync(onUpdate) {
  onSnapshot(
    collection(db, LEADERBOARD_COLLECTION),
    (snap) => {
      leaderboardEntriesCache = snap.docs.map((d) => d.data());
      onUpdate();
    },
    (err) => console.error('Leaderboard sync error:', err)
  );
}

function lbGetEntries() {
  return leaderboardEntriesCache.slice();
}

function lbGetMyScores() {
  return {
    g1: Number(localStorage.getItem('yelo_varline_best_score') || 0),
    g2: Number(localStorage.getItem('yelo_escape_best_score') || 0),
    g3: Number(localStorage.getItem('yelo_penalty_best_score') || 0)
  };
}

function lbComputeRating({ g1, g2, g3 }) {
  const g2Norm = Math.min(g2, 500) / 500 * 100;
  const g3Norm = g3 / 5 * 100;
  return Math.round((g1 * 0.4) + (g2Norm * 0.3) + (g3Norm * 0.3));
}

function lbGetMyEntry() {
  const myId = getOwnerId();
  return leaderboardEntriesCache.find((e) => e.id === myId) || null;
}

async function lbJoinOrUpdate(name) {
  const scores = lbGetMyScores();
  const rating = lbComputeRating(scores);
  const myId = await ensureOwnerId();
  const entry = { id: myId, name, ...scores, rating, updatedAt: Date.now() };
  await setDoc(doc(db, LEADERBOARD_COLLECTION, myId), entry);
  setSharedName(name);
  return entry;
}

async function lbLeave() {
  const myId = await ensureOwnerId();
  await deleteDoc(doc(db, LEADERBOARD_COLLECTION, myId));
}

// ---------------------------------------------------------------------------
// TALES STORAGE — backed by Firestore, real-time and shared across visitors.
// Edit/delete is only offered in the UI for tales this browser's ownerId
// authored; see the note above about this being best-effort, not real auth.
// ---------------------------------------------------------------------------
const TALES_COLLECTION = 'tales';
const TALES_VOTED_KEY = 'yelo_tales_voted';
let talesCache = [];

function startTalesSync(onUpdate) {
  onSnapshot(
    collection(db, TALES_COLLECTION),
    (snap) => {
      talesCache = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      onUpdate();
    },
    (err) => console.error('Tales sync error:', err)
  );
}

function talesGetEntries() {
  return talesCache.slice();
}

function talesGetVotes() {
  try {
    return JSON.parse(localStorage.getItem(TALES_VOTED_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

function talesIsMine(id) {
  const entry = talesCache.find((e) => e.id === id);
  return !!entry && entry.ownerId === getOwnerId();
}

async function talesAdd(name, text) {
  const ownerId = await ensureOwnerId();
  await addDoc(collection(db, TALES_COLLECTION), {
    name,
    text,
    likes: 0,
    dislikes: 0,
    ownerId,
    createdAt: Date.now()
  });
  setSharedName(name);
}

async function talesEdit(id, newText) {
  if (!talesIsMine(id)) return false; // only the author's own browser may edit
  await updateDoc(doc(db, TALES_COLLECTION, id), { text: newText, editedAt: Date.now() });
  return true;
}

async function talesDelete(id) {
  if (!talesIsMine(id)) return false; // only the author's own browser may delete
  await deleteDoc(doc(db, TALES_COLLECTION, id));
  return true;
}

async function talesVote(id, direction) {
  const votes = talesGetVotes();
  if (votes[id]) return false; // already voted from this browser
  const field = direction === 'like' ? 'likes' : 'dislikes';
  await updateDoc(doc(db, TALES_COLLECTION, id), { [field]: increment(1) });
  votes[id] = direction;
  localStorage.setItem(TALES_VOTED_KEY, JSON.stringify(votes));
  return true;
}

class App {
  constructor() {
    this.currentView = 'home';
    this.activeArchiveFilter = 'all';
    this.activeGame = null;
    this.revealObserver = null;
    this.leaderboardTab = 'top';
  }

  init() {
    // 1. Initialize i18n
    i18n.init();

    // 2. Setup Navigation & View Router
    this.setupRouter();

    // 3. Setup Header & Mobile Drawer
    this.setupHeader();

    // 4. Setup Video Player loading state
    this.setupVideoPlayer();

    // 5. Render Dynamic Content
    this.renderAllDynamicContent();

    // 5b. Sign in anonymously (real Firebase identity, no signup screen) then
    // start real-time Firestore sync for the shared leaderboard & tales board
    startAnonymousAuth(() => {
      // Once our identity resolves, re-render so "mine" edit/delete buttons
      // and the leaderboard's own-row highlight pick it up immediately.
      if (this.currentView === 'arcade') this.renderLeaderboard();
      if (this.currentView === 'tales') this.renderTales();
    });
    startLeaderboardSync(() => { if (this.currentView === 'arcade') this.renderLeaderboard(); });
    startTalesSync(() => { if (this.currentView === 'tales') this.renderTales(); });

    // 6. Setup Interactive Handlers (Filters, Modal, Verdict, Contact)
    this.setupInteractivity();

    // 6b. Setup Tales board submit handler
    this.setupTales();

    // 7. Setup scroll-reveal animation system
    this.setupScrollReveal();

    // 8. Render the breaking-news ticker
    this.renderTicker();

    // 9. Hero image cursor-following reveal (orange base / gold masked reveal)
    this.setupHeroReveal();

    // 10. Subscribe to language changes to re-render dynamic content
    i18n.subscribe(() => {
      this.renderAllDynamicContent();
      this.renderTicker();
    });
  }

  setupScrollReveal() {
    if (this.revealObserver) return;
    this.revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          this.revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    this.applyRevealToNewElements();
  }

  applyRevealToNewElements() {
    if (!this.revealObserver) return;
    const selector = '.stat-card, .timeline-item, .evidence-card, .claim-card, .arcade-card, .hero-content, .hero-frame-container';
    document.querySelectorAll(selector).forEach((el, idx) => {
      if (el.dataset.revealBound) return;
      el.dataset.revealBound = 'true';
      el.classList.add('reveal', 'reveal-stagger');
      el.style.setProperty('--reveal-index', idx % 6);
      this.revealObserver.observe(el);
    });
  }

  setupHeroReveal() {
    const secondary = document.querySelector('.hero-img-secondary');
    if (!secondary) return;
    const wrapper = secondary.closest('.archive-image-wrapper');
    if (!wrapper) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHoverPrecisely = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (reducedMotion || !canHoverPrecisely) {
      // Touch device, OR a desktop with "reduce motion" enabled: no meaningful/wanted
      // cursor-tracking motion — tap/click toggles a plain static crossfade instead.
      // (Previously this used a CSS-only :hover rule for reduced-motion, which never
      // fires on touch devices at all — that's why the effect silently did nothing on
      // mobile whenever the phone's "reduce motion" accessibility setting was on.)
      wrapper.classList.add('touch-fallback');
      wrapper.addEventListener('click', () => {
        wrapper.classList.toggle('is-revealed');
      });
      return;
    }

    // Desktop with a real pointer: soft circular mask that follows the cursor.
    let targetX = 50, targetY = 50, curX = 50, curY = 50;
    let hovering = false;
    let rafId = null;
    const radiusPx = () => Math.max(90, wrapper.getBoundingClientRect().width * 0.32);

    const loop = () => {
      curX += (targetX - curX) * 0.25;
      curY += (targetY - curY) * 0.25;
      secondary.style.setProperty('--reveal-x', `${curX}%`);
      secondary.style.setProperty('--reveal-y', `${curY}%`);
      if (hovering || Math.abs(targetX - curX) > 0.1 || Math.abs(targetY - curY) > 0.1) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
      }
    };

    wrapper.addEventListener('mouseenter', () => {
      hovering = true;
      secondary.style.setProperty('--reveal-r', `${radiusPx()}px`);
      if (!rafId) rafId = requestAnimationFrame(loop);
    });

    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      targetX = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
      targetY = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
      if (!rafId) rafId = requestAnimationFrame(loop);
    });

    wrapper.addEventListener('mouseleave', () => {
      hovering = false;
      secondary.style.setProperty('--reveal-r', '0px');
    });
  }

  renderTicker() {
    const track = document.getElementById('tickerTrack');
    if (!track) return;
    const lang = i18n.getLang();
    const itemsHtml = CONTENT.tickerSection.items.map(item => `
      <span class="ticker-item">${item[lang]}</span>
    `).join('');
    // Duplicate the sequence so the CSS marquee (-50% translate) loops seamlessly
    track.innerHTML = itemsHtml + itemsHtml;
  }

  setupRouter() {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      const validViews = ['home', 'archive', 'tales', 'courtroom', 'arcade', 'about', 'privacy', 'terms', 'ip'];
      if (validViews.includes(hash)) {
        this.switchView(hash);
      } else {
        this.switchView('home');
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash(); // initial trigger
  }

  switchView(viewId) {
    this.currentView = viewId;

    // Toggle views
    document.querySelectorAll('.page-view').forEach(view => {
      if (view.id === `view-${viewId}`) {
        view.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Stop any video/audio still playing on the page being left (e.g. the
        // home hero video, or evidence-modal audio) — a page-view is just
        // hidden with display:none, not unmounted, so without this the sound
        // keeps playing invisibly after you've navigated away.
        view.querySelectorAll('video, audio').forEach((media) => {
          if (!media.paused) media.pause();
        });
        view.style.display = 'none';
      }
    });

    // Update nav link active state
    document.querySelectorAll('.nav-link').forEach(link => {
      const target = link.getAttribute('data-view-target');
      if (target === viewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile drawer if open
    this.closeMobileDrawer();

    // Refresh dynamic sections that depend on cross-page shared state
    // (e.g. the display name typed on the Tales page or the Arcade leaderboard)
    // so switching pages always shows the latest data instead of a stale
    // snapshot from initial page load.
    if (viewId === 'arcade') this.renderLeaderboard();
    if (viewId === 'tales') this.renderTales();
  }

  setupHeader() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');

    if (mobileMenuBtn && mobileDrawer) {
      mobileMenuBtn.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.contains('open');
        if (isOpen) {
          this.closeMobileDrawer();
        } else {
          mobileDrawer.classList.add('open');
          mobileDrawer.setAttribute('aria-hidden', 'false');
          mobileMenuBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }

    // Language toggle buttons
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = e.currentTarget.getAttribute('data-lang');
        i18n.setLang(lang);
      });
    });

    // View Target click listeners on links
    document.querySelectorAll('[data-view-target]').forEach(el => {
      el.addEventListener('click', (e) => {
        const target = el.getAttribute('data-view-target');
        if (target) {
          window.location.hash = target;
        }
      });
    });
  }

  closeMobileDrawer() {
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
    }
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  }

  setupVideoPlayer() {
    const video = document.getElementById('archiveVideoPlayer');
    const loader = document.getElementById('videoLoader');

    if (video && loader) {
      const hideLoader = () => loader.classList.add('hidden');
      video.addEventListener('canplay', hideLoader);
      video.addEventListener('playing', hideLoader);

      // Fallback timeout to hide loader if video takes longer or autoplay blocked
      setTimeout(hideLoader, 3000);
    }
  }

  renderAllDynamicContent() {
    const lang = i18n.getLang();

    // 1. Render Stats Grid
    const statsContainer = document.getElementById('statsGridContainer');
    if (statsContainer) {
      statsContainer.innerHTML = CONTENT.statsSection.items.map(item => `
        <div class="glass-panel stat-card">
          <div>
            <div class="stat-number">${item.number}</div>
            <div class="stat-label">${item.label[lang]}</div>
          </div>
          <div class="stat-detail">${item.detail[lang]}</div>
          ${item.satireTag ? `<div class="satire-flag" style="margin-top: 0.5rem;">${item.satireTag[lang]}</div>` : ''}
        </div>
      `).join('');
    }

    // 2. Render Timeline
    const timelineContainer = document.getElementById('timelineContainer');
    if (timelineContainer) {
      timelineContainer.innerHTML = CONTENT.timelineSection.events.map(ev => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="glass-panel timeline-content">
            <div class="timeline-date">${ev.date} • ${ev.tag[lang]}</div>
            <h3 class="timeline-title">${ev.title[lang]}</h3>
            <p class="timeline-desc">${ev.desc[lang]}</p>
            ${ev.satireTag ? `<div class="satire-flag" style="margin-top: 0.5rem;">${ev.satireTag[lang]}</div>` : ''}
          </div>
        </div>
      `).join('');
    }

    // 3. Render Evidence Gallery Grid
    this.renderArchiveEvidence();

    // 4. Render Courtroom Cases (Claims) & Verdict Options
    CONTENT.courtroomPage.cases.forEach((courtCase, caseIdx) => {
      const titleEl = document.getElementById(`caseTitle${caseIdx}`);
      if (titleEl) titleEl.textContent = courtCase.caseTitle[lang];

      const claimsContainer = document.getElementById(`courtClaimsContainer${caseIdx}`);
      if (claimsContainer) {
        claimsContainer.innerHTML = courtCase.claims.map(claim => `
          <div class="glass-panel claim-card">
            <div class="claim-num">${claim.num}</div>
            <h3 style="font-size: 1.15rem; margin: 0.25rem 0 0.5rem;">${claim.title[lang]}</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted);">${claim.desc[lang]}</p>
            ${claim.satireTag ? `<div class="satire-flag" style="margin-top: 0.5rem;">${claim.satireTag[lang]}</div>` : ''}
          </div>
        `).join('');
      }

      // Per-case verdict poll
      const vs = courtCase.verdictSection;
      if (vs) {
        const vTitle = document.getElementById(`verdictTitle${caseIdx}`);
        const vPrompt = document.getElementById(`verdictPrompt${caseIdx}`);
        const vBtn = document.getElementById(`verdictButton${caseIdx}`);
        const vOptions = document.getElementById(`verdictOptionsContainer${caseIdx}`);
        const vAlert = document.getElementById(`verdictSuccessAlert${caseIdx}`);
        if (vTitle) vTitle.textContent = vs.title[lang];
        if (vPrompt) vPrompt.textContent = vs.prompt[lang];
        if (vBtn) vBtn.textContent = vs.voteButton[lang];
        if (vAlert) vAlert.textContent = vs.successMessage[lang];
        if (vOptions) {
          vOptions.innerHTML = vs.options.map((opt, idx) => `
            <label class="verdict-option-label">
              <input type="radio" name="verdictChoice${caseIdx}" value="${opt.id}" ${idx === 0 ? 'checked' : ''} />
              <span style="font-size: 0.95rem; font-weight: 500;">${opt[lang]}</span>
            </label>
          `).join('');
        }
      }
    });

    // 5. Render Arcade Cards
    const arcadeContainer = document.getElementById('arcadeGridContainer');
    if (arcadeContainer) {
      arcadeContainer.innerHTML = CONTENT.arcadePage.games.map(game => `
        <div class="glass-panel arcade-card ${game.playable ? 'is-playable' : ''} ${game.tallCard ? 'arcade-card--tall' : ''}">
          <div>
            <div class="arcade-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 11h4M8 9v4M15 10a1 1 0 100-2 1 1 0 000 2zm3 3a1 1 0 100-2 1 1 0 000 2zM2 12c0 5.5 4.5 10 10 10s10-4.5 10-10S17.5 2 12 2 2 6.5 2 12z"/></svg>
            </div>
            <span class="section-badge" style="font-size: 0.7rem; margin-bottom: 0.75rem;">${game.badge[lang]}</span>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem;">${game.title[lang]}</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">${game.desc[lang]}</p>
          </div>
          ${game.playable
            ? `<button class="btn btn-primary arcade-play-btn" data-game-id="${game.id}"><span>${CONTENT.arcadePage.gameUi.playButton[lang]}</span></button>`
            : `<button class="btn btn-secondary" disabled style="opacity: 0.6; cursor: not-allowed;"><span>${CONTENT.arcadePage.gameUi.comingSoon[lang]}</span></button>`
          }
        </div>
      `).join('');

      arcadeContainer.querySelectorAll('.arcade-play-btn').forEach(btn => {
        btn.addEventListener('click', () => this.openGameModal(btn.getAttribute('data-game-id')));
      });
    }

    // 6. Render Leaderboard / Relegated table
    this.renderLeaderboard();

    // 7. Render Tales board
    this.renderTales();

    // 8. Render legal pages (Privacy / Terms / IP)
    this.renderLegalPages();

    this.applyRevealToNewElements();
  }

  renderLegalPages() {
    const lang = i18n.getLang();
    ['privacy', 'terms', 'ip'].forEach((key) => {
      const page = CONTENT.legalPages[key];
      if (!page) return;
      const titleEl = document.getElementById(`legalTitle-${key}`);
      const updatedEl = document.getElementById(`legalUpdated-${key}`);
      const bodyEl = document.getElementById(`legalBody-${key}`);
      if (titleEl) titleEl.textContent = page.title[lang];
      if (updatedEl) updatedEl.textContent = page.updated[lang];
      if (bodyEl) {
        bodyEl.innerHTML = page.sections.map(section => `
          <h2 style="font-size: 1.1rem; margin: 1.75rem 0 0.5rem; color: var(--yellow-detail);">${section.heading[lang]}</h2>
          <p style="color: var(--text-ivory); font-size: 0.95rem; line-height: 1.7;">${section.body[lang]}</p>
        `).join('');
      }
    });
  }

  renderTales() {
    const lang = i18n.getLang();
    const tp = CONTENT.talesPage;
    const container = document.getElementById('talesListContainer');
    const nameInput = document.getElementById('taleNameInput');
    if (!container) return;

    if (nameInput && !nameInput.value) {
      nameInput.value = getSharedName();
    }

    const votes = talesGetVotes();
    const entries = talesGetEntries()
      .slice()
      .sort((a, b) => (b.likes * 2 - b.dislikes) - (a.likes * 2 - a.dislikes));

    if (entries.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted);">${tp.emptyState[lang]}</p>`;
      return;
    }

    container.innerHTML = entries.map(e => {
      const voted = votes[e.id];
      const mine = talesIsMine(e.id);
      return `
        <div class="glass-panel" style="padding: 1.25rem 1.5rem; margin-bottom: 1rem;" data-tale-card="${e.id}">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
            <span style="font-weight: 700;">${e.name}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${tp.byLabel[lang]} · ${new Date(e.createdAt).toLocaleDateString(lang === 'ar' ? 'ar' : 'en-US')}</span>
          </div>
          <p class="tale-text" style="font-size: 0.95rem; color: var(--text-ivory); line-height: 1.6; margin-bottom: 1rem;">${e.text}</p>
          <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary tale-vote-btn" data-tale-id="${e.id}" data-dir="like" ${voted ? 'disabled' : ''} style="padding: 0.4rem 0.85rem; font-size: 0.85rem;">👍 ${e.likes}</button>
            <button type="button" class="btn btn-secondary tale-vote-btn" data-tale-id="${e.id}" data-dir="dislike" ${voted ? 'disabled' : ''} style="padding: 0.4rem 0.85rem; font-size: 0.85rem;">👎</button>
            ${mine ? `
              <span style="margin-left: auto; display: flex; gap: 0.5rem;">
                <button type="button" class="btn btn-secondary tale-edit-btn" data-tale-id="${e.id}" style="padding: 0.4rem 0.85rem; font-size: 0.85rem;">${tp.editButton[lang]}</button>
                <button type="button" class="btn btn-secondary tale-delete-btn" data-tale-id="${e.id}" style="padding: 0.4rem 0.85rem; font-size: 0.85rem;">${tp.deleteButton[lang]}</button>
              </span>
            ` : ''}
          </div>
        </div>
      `;
    }).join('') + `
      <p style="text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-top: 1.5rem;">${tp.endOfListNote[lang]}</p>
    `;

    container.querySelectorAll('.tale-vote-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        try {
          await talesVote(btn.getAttribute('data-tale-id'), btn.getAttribute('data-dir'));
          this.renderTales();
        } catch (err) {
          console.error('Vote failed:', err);
          btn.disabled = false;
        }
      });
    });

    container.querySelectorAll('.tale-delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-tale-id');
        if (window.confirm(tp.deleteConfirm[lang])) {
          await talesDelete(id);
          this.renderTales();
        }
      });
    });

    container.querySelectorAll('.tale-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-tale-id');
        const card = container.querySelector(`[data-tale-card="${id}"]`);
        const entry = entries.find(x => x.id === id);
        if (!card || !entry) return;
        const textEl = card.querySelector('.tale-text');
        textEl.outerHTML = `
          <div class="tale-edit-area" style="margin-bottom: 1rem;">
            <textarea class="form-control tale-edit-textarea" rows="3" style="width: 100%; margin-bottom: 0.5rem;">${entry.text}</textarea>
            <div style="display: flex; gap: 0.5rem;">
              <button type="button" class="btn btn-primary tale-save-btn" data-tale-id="${id}" style="padding: 0.4rem 0.85rem; font-size: 0.85rem;">${tp.saveButton[lang]}</button>
              <button type="button" class="btn btn-secondary tale-cancel-btn" style="padding: 0.4rem 0.85rem; font-size: 0.85rem;">${tp.cancelButton[lang]}</button>
            </div>
          </div>
        `;
        card.querySelector('.tale-cancel-btn').addEventListener('click', () => this.renderTales());
        card.querySelector('.tale-save-btn').addEventListener('click', async () => {
          const newText = card.querySelector('.tale-edit-textarea').value.trim();
          if (!newText) return;
          await talesEdit(id, newText);
          this.renderTales();
        });
      });
    });
  }

  setupTales() {
    const form = document.getElementById('taleForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('taleNameInput');
      const textInput = document.getElementById('taleTextInput');
      const name = (nameInput.value || '').trim();
      const text = (textInput.value || '').trim();
      if (!name || !text) return;
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      try {
        await talesAdd(name, text);
        textInput.value = '';
        this.renderTales();
      } catch (err) {
        console.error('Publishing tale failed:', err);
        alert(i18n.getLang() === 'ar'
          ? 'تعذر نشر السالفة، تأكد من اتصالك بالإنترنت وحاول مرة ثانية.'
          : 'Could not publish your tale — check your connection and try again.');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  renderLeaderboard() {
    const lang = i18n.getLang();
    const lb = CONTENT.arcadePage.leaderboard;
    const tableBody = document.getElementById('leaderboardTableBody');
    const myScoresRow = document.getElementById('myScoresRow');
    const joinArea = document.getElementById('leaderboardJoinArea');
    if (!tableBody || !myScoresRow || !joinArea) return;

    // Tabs
    document.querySelectorAll('#leaderboardTabs .filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === this.leaderboardTab);
    });

    // Table rows
    let entries = lbGetEntries().slice();
    entries.sort((a, b) => this.leaderboardTab === 'top' ? b.rating - a.rating : a.rating - b.rating);
    entries = entries.slice(0, 10);

    // Once you've already joined, "share your name and score" no longer makes
    // sense as the closing line — swap it for a playful nudge instead.
    const alreadyJoined = !!lbGetMyEntry();
    const closingNote = alreadyJoined ? lb.endOfListNoteJoined[lang] : lb.endOfListNote[lang];

    if (entries.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="padding: 1rem 0.5rem; color: var(--text-muted);">${lb.emptyState[lang]}</td></tr>`;
    } else {
      tableBody.innerHTML = entries.map((e, idx) => `
        <tr style="border-top: 1px solid var(--border-muted);">
          <td style="padding: 0.6rem 0.5rem; color: var(--text-muted);">${idx + 1}</td>
          <td style="padding: 0.6rem 0.5rem; font-weight: 600;">${e.name}</td>
          <td style="padding: 0.6rem 0.5rem;">${e.g1}%</td>
          <td style="padding: 0.6rem 0.5rem;">${e.g2}</td>
          <td style="padding: 0.6rem 0.5rem;">${e.g3}/5</td>
          <td style="padding: 0.6rem 0.5rem; color: var(--accent-acid); font-weight: 700;">${e.rating}</td>
        </tr>
      `).join('') + `
        <tr>
          <td colspan="6" style="padding: 0.85rem 0.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">${closingNote}</td>
        </tr>
      `;
    }

    // My scores row
    const my = lbGetMyScores();
    myScoresRow.innerHTML = `
      <span>${CONTENT.arcadePage.leaderboard.colVar[lang]}: <b>${my.g1}%</b></span>
      <span>${CONTENT.arcadePage.leaderboard.colEscape[lang]}: <b>${my.g2}</b></span>
      <span>${CONTENT.arcadePage.leaderboard.colPenalty[lang]}: <b>${my.g3}/5</b></span>
    `;

    // Join / update area
    const myEntry = lbGetMyEntry();
    joinArea.innerHTML = `
      <input type="text" id="leaderboardNameInput" class="form-control" style="flex: 1; min-width: 180px;"
        placeholder="${lb.joinPlaceholder[lang]}" value="${myEntry ? myEntry.name : getSharedName()}" />
      <button class="btn btn-primary" id="leaderboardJoinBtn">
        <span>${myEntry ? lb.updateButton[lang] : lb.joinButton[lang]}</span>
      </button>
      ${myEntry ? `
        <button type="button" class="btn btn-secondary" id="leaderboardLeaveBtn">
          <span>${lb.leaveButton[lang]}</span>
        </button>
      ` : ''}
    `;
    document.getElementById('leaderboardJoinBtn').addEventListener('click', async (e) => {
      const input = document.getElementById('leaderboardNameInput');
      const name = (input.value || '').trim();
      if (!name) {
        input.focus();
        return;
      }
      const btn = e.currentTarget;
      btn.disabled = true;
      try {
        await lbJoinOrUpdate(name);
        this.renderLeaderboard();
      } catch (err) {
        console.error('Joining leaderboard failed:', err);
        btn.disabled = false;
        alert(i18n.getLang() === 'ar'
          ? 'تعذر تسجيل اسمك بالتصنيف، تأكد من اتصالك بالإنترنت وحاول مرة ثانية.'
          : 'Could not save your leaderboard entry — check your connection and try again.');
      }
    });

    const leaveBtn = document.getElementById('leaderboardLeaveBtn');
    if (leaveBtn) {
      leaveBtn.addEventListener('click', async (e) => {
        if (!window.confirm(lb.leaveConfirm[lang])) return;
        const btn = e.currentTarget;
        btn.disabled = true;
        try {
          await lbLeave();
          this.renderLeaderboard();
        } catch (err) {
          console.error('Removing leaderboard entry failed:', err);
          btn.disabled = false;
          alert(lang === 'ar'
            ? 'تعذر حذف اسمك، تأكد من اتصالك بالإنترنت وحاول مرة ثانية.'
            : 'Could not remove your entry — check your connection and try again.');
        }
      });
    }
  }

  renderArchiveEvidence() {
    const lang = i18n.getLang();
    const grid = document.getElementById('evidenceGrid');
    if (!grid) return;

    const items = CONTENT.archivePage.items.filter(item => {
      if (this.activeArchiveFilter === 'all') return true;
      return item.category === this.activeArchiveFilter;
    });

    grid.innerHTML = items.map(item => `
      <div class="glass-panel evidence-card" data-evidence-id="${item.id}">
        <div class="evidence-thumb">
          <img src="${item.image}" alt="${item.title[lang]}" />
          <div class="archive-stamp" style="top: 10px; bottom: auto;">${item.date}</div>
        </div>
        <div class="evidence-body">
          <div class="evidence-cat">${lang === 'ar' ? item.categoryAr : item.category}</div>
          <h3 class="evidence-title">${item.title[lang]}</h3>
          <p class="evidence-desc">${item.desc[lang]}</p>
          ${item.satireTag ? `<div class="satire-flag" style="margin-top: 0.6rem;">${item.satireTag[lang]}</div>` : ''}
        </div>
      </div>
    `).join('');

    // Attach inspect modal triggers
    grid.querySelectorAll('.evidence-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-evidence-id');
        this.openEvidenceModal(id);
      });
    });

    this.applyRevealToNewElements();
  }

  setupInteractivity() {
    // Archive Filter Bar Buttons
    const filterBtns = document.querySelectorAll('#archiveFilterBar .filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeArchiveFilter = btn.getAttribute('data-filter');
        this.renderArchiveEvidence();
      });
    });

    // Modal Close
    const modal = document.getElementById('evidenceModal');
    const closeBtn = document.getElementById('modalCloseBtn');
    if (modal && closeBtn) {
      closeBtn.addEventListener('click', () => this.closeEvidenceModal());
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeEvidenceModal();
      });
    }

    // Game Modal Close
    const gameModal = document.getElementById('gameModal');
    const gameCloseBtn = document.getElementById('gameModalCloseBtn');
    if (gameModal && gameCloseBtn) {
      gameCloseBtn.addEventListener('click', () => this.closeGameModal());
      gameModal.addEventListener('click', (e) => {
        if (e.target === gameModal) this.closeGameModal();
      });
    }

    // Verdict Form Submission (one poll per courtroom case)
    [0, 1].forEach((caseIdx) => {
      const verdictForm = document.getElementById(`verdictForm${caseIdx}`);
      const verdictAlert = document.getElementById(`verdictSuccessAlert${caseIdx}`);
      if (verdictForm && verdictAlert) {
        verdictForm.addEventListener('submit', (e) => {
          e.preventDefault();
          verdictAlert.style.display = 'block';
          setTimeout(() => {
            verdictAlert.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        });
      }
    });

    // Submission Form — real submission via FormSubmit.co (no backend needed)
    const subForm = document.getElementById('submissionForm');
    const subAlert = document.getElementById('contactSuccessAlert');
    const subBtn = document.getElementById('submissionSubmitBtn');
    const subNameInput = document.getElementById('submissionNameInput');
    const subEmailInput = document.getElementById('submissionEmailInput');
    const subMessageInput = document.getElementById('submissionMessageInput');
    if (subForm && subAlert && subBtn) {
      const originalBtnHtml = subBtn.innerHTML;
      subForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const targetEmail = CONTENT.aboutPage.form.targetEmail;
        subBtn.disabled = true;
        subBtn.innerHTML = `<span>${i18n.t('aboutPage.form.sendingMsg')}</span>`;
        subAlert.style.display = 'none';
        try {
          const res = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              name: subNameInput ? subNameInput.value : '',
              email: subEmailInput ? subEmailInput.value : '',
              message: subMessageInput ? subMessageInput.value : '',
              _subject: 'New Yellow Archive submission',
            }),
          });
          if (!res.ok) throw new Error('Bad response');
          subAlert.textContent = i18n.t('aboutPage.form.successMsg');
          subAlert.style.display = 'block';
          subForm.reset();
        } catch (err) {
          subAlert.textContent = i18n.t('aboutPage.form.errorMsg');
          subAlert.style.display = 'block';
        } finally {
          subBtn.disabled = false;
          subBtn.innerHTML = originalBtnHtml;
        }
      });
    }

    // Leaderboard Tabs
    document.querySelectorAll('#leaderboardTabs .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.leaderboardTab = btn.getAttribute('data-tab');
        this.renderLeaderboard();
      });
    });

    // Share Button
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: i18n.t('siteName'),
              text: i18n.t('tagline'),
              url: window.location.href
            });
          } catch (err) {
            console.log('Share dismissed');
          }
        } else {
          navigator.clipboard.writeText(window.location.href);
          alert(i18n.getLang() === 'ar' ? 'تم نسخ الرابط للشير على تيك توك!' : 'Link copied to clipboard for sharing!');
        }
      });
    }
  }

  openEvidenceModal(id) {
    const lang = i18n.getLang();
    const item = CONTENT.archivePage.items.find(i => i.id === id);
    if (!item) return;

    const modalBody = document.getElementById('modalBody');
    const modal = document.getElementById('evidenceModal');

    // Stop whatever audio was playing for the previous exhibit before we
    // swap the modal content out for a new one.
    modalBody.querySelectorAll('audio, video').forEach((media) => {
      if (!media.paused) media.pause();
    });

    const evidenceUi = CONTENT.archivePage.evidenceUi;

    const audioBlock = item.audio ? `
      <div class="glass-panel" style="margin-bottom: 1.5rem; padding: 1rem 1.25rem;">
        <div style="font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.6rem;">${evidenceUi.audioLabel[lang]}</div>
        <audio controls style="width: 100%;" src="${item.audio}"></audio>
        ${item.audioCaption ? `<p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.6rem;">${item.audioCaption[lang]}</p>` : ''}
      </div>
    ` : '';

    const secretTacticBlock = item.secretTactic ? `
      <div style="margin-bottom: 1.5rem;">
        <button type="button" id="secretTacticToggle" class="btn btn-secondary" style="width: 100%;">${evidenceUi.revealButton[lang]}</button>
        <div id="secretTacticText" class="glass-panel" style="display: none; margin-top: 1rem; padding: 1rem 1.25rem; font-size: 0.95rem; line-height: 1.7; color: var(--text-ivory);">
          ${item.secretTactic[lang]}
        </div>
      </div>
    ` : '';

    // ev-1's classified note uses a distinct visual treatment (accent-bordered inline card,
    // no toggle button chrome) so it doesn't look like a copy of the tactic-reveal component.
    const secretNoteBlock = item.secretNote ? `
      <div id="secretNoteWrapper" style="margin-bottom: 1.5rem;">
        <button type="button" id="secretNoteToggle" class="btn btn-secondary" style="width: 100%; border-color: var(--accent-acid); color: var(--accent-acid);">${evidenceUi.revealSecretButton[lang]}</button>
        <div id="secretNoteText" style="display: none; margin-top: 1rem; padding: 1rem 1.25rem; font-size: 0.95rem; line-height: 1.7; color: var(--text-ivory); background: rgba(184, 242, 61, 0.06); border-left: 3px solid var(--accent-acid); border-radius: var(--radius-sm);">
          ${item.secretNote[lang]}
        </div>
      </div>
    ` : '';

    modalBody.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <span class="section-badge">${lang === 'ar' ? item.categoryAr : item.category}</span>
        <h2 style="font-size: 1.5rem; margin-top: 0.5rem;" id="modalTitle">${item.title[lang]}</h2>
      </div>
      <div class="archive-frame" style="margin-bottom: 1.5rem;">
        <div class="archive-image-wrapper" style="aspect-ratio: 16 / 9;">
          <img src="${item.image}" alt="${item.title[lang]}" />
        </div>
      </div>
      <p style="font-size: 1rem; color: var(--text-ivory); line-height: 1.7;">${item.desc[lang]}</p>
      ${audioBlock}
      ${secretTacticBlock}
      ${secretNoteBlock}
      <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-muted); font-size: 0.8rem; color: var(--text-muted); display: flex; justify-content: space-between;">
        <span>${evidenceUi.dateArchivedLabel[lang]}: ${item.date}</span>
        <span>${evidenceUi.statusLabel[lang]}</span>
      </div>
    `;

    if (item.secretTactic) {
      const toggleBtn = document.getElementById('secretTacticToggle');
      const textBlock = document.getElementById('secretTacticText');
      toggleBtn.addEventListener('click', () => {
        const isHidden = textBlock.style.display === 'none';
        textBlock.style.display = isHidden ? 'block' : 'none';
        toggleBtn.textContent = isHidden ? evidenceUi.hideButton[lang] : evidenceUi.revealButton[lang];
      });
    }

    if (item.secretNote) {
      const toggleBtn = document.getElementById('secretNoteToggle');
      const textBlock = document.getElementById('secretNoteText');
      toggleBtn.addEventListener('click', () => {
        const isHidden = textBlock.style.display === 'none';
        textBlock.style.display = isHidden ? 'block' : 'none';
        toggleBtn.textContent = isHidden ? evidenceUi.hideSecretButton[lang] : evidenceUi.revealSecretButton[lang];
      });
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  closeEvidenceModal() {
    const modal = document.getElementById('evidenceModal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      // Otherwise the whistle/audio evidence tape keeps playing in the
      // background even after the modal is closed.
      modal.querySelectorAll('audio, video').forEach((media) => {
        if (!media.paused) media.pause();
      });
    }
  }

  openGameModal(gameId) {
    const gameData = CONTENT.arcadePage.games.find(g => g.id === gameId);
    if (!gameData || !gameData.playable) return;

    const modal = document.getElementById('gameModal');
    const mountEl = document.getElementById('gameModalBody');
    const titleEl = document.getElementById('gameModalTitle');
    if (!modal || !mountEl) return;

    if (this.activeGame) {
      this.activeGame.destroy();
      this.activeGame = null;
    }

    if (titleEl) {
      titleEl.removeAttribute('data-i18n');
      titleEl.textContent = gameData.title[i18n.getLang()];
    }

    const gameApi = {
      t: (key) => i18n.t(key),
      getLang: () => i18n.getLang()
    };

    if (gameId === 'g1') {
      this.activeGame = new VarLineGame(mountEl, gameApi);
    } else if (gameId === 'g2') {
      this.activeGame = new EscapeRunnerGame(mountEl, gameApi);
    } else if (gameId === 'g3') {
      this.activeGame = new ComebackPenaltyGame(mountEl, gameApi);
    } else {
      return;
    }
    this.activeGame.renderIntro();

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  closeGameModal() {
    const modal = document.getElementById('gameModal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
    if (this.activeGame) {
      this.activeGame.destroy();
      this.activeGame = null;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
