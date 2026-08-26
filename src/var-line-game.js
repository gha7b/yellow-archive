/**
 * ============================================================================
 * VAR LINE CALIBRATOR — playable mini-game for the Yelo Arcade page
 * ============================================================================
 * A short reflex/precision game: a jittery "last defender" marker bobs across
 * a satirical pitch. The player has 3 seconds per round to click/tap exactly
 * where they believe the defender's line sits. Distance-from-truth becomes a
 * satirical VAR "accuracy" score across 5 rounds.
 *
 * No external assets or libraries — pure canvas 2D, matches the site's
 * emerald/acid-green/gold palette, and reads all copy through the i18n
 * strings under CONTENT.arcadePage.gameUi so it stays bilingual (EN/AR).
 * ============================================================================
 */

import { spawnConfettiFromElement } from './confetti.js';

const ROUND_COUNT = 5;
const ROUND_TIME_MS = 3000;
const GOOD_CALL_THRESHOLD_PX_RATIO = 0.035; // fraction of canvas width considered "onside" (good)

export class VarLineGame {
  constructor(mountEl, { t, getLang }) {
    this.mountEl = mountEl;
    this.t = t;
    this.getLang = getLang;
    this.round = 0;
    this.scores = [];
    this.rafId = null;
    this.timerStart = 0;
    this.roundActive = false;
    this.defenderBaseX = 0.5;
    this.jitterSeed = Math.random() * 1000;

    this._onResize = this._onResize.bind(this);
    this._onCanvasClick = this._onCanvasClick.bind(this);
    this._tick = this._tick.bind(this);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this._onResize);
    if (this.canvas) {
      this.canvas.removeEventListener('click', this._onCanvasClick);
      this.canvas.removeEventListener('touchstart', this._onCanvasClick);
    }
  }

  renderIntro() {
    const t = this.t;
    this.mountEl.innerHTML = `
      <div class="game-shell">
        <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">${t('arcadePage.gameUi.instructions')}</p>
        <button class="btn btn-primary" id="gameStartBtn" style="align-self: center;">
          <span>${t('arcadePage.gameUi.startButton')}</span>
        </button>
      </div>
    `;
    const startBtn = this.mountEl.querySelector('#gameStartBtn');
    startBtn.addEventListener('click', () => this._startGame());
  }

  _startGame() {
    this.round = 0;
    this.scores = [];
    this._renderShell();
    this._nextRound();
  }

  _renderShell() {
    const t = this.t;
    this.mountEl.innerHTML = `
      <div class="game-shell">
        <div class="game-hud">
          <span>${t('arcadePage.gameUi.round')}<b id="gameRoundLabel">1 / ${ROUND_COUNT}</b></span>
          <span>${t('arcadePage.gameUi.score')}<b id="gameScoreLabel">—</b></span>
        </div>
        <div class="game-canvas-wrapper" id="gameCanvasWrapper">
          <div class="game-timer-bar" id="gameTimerBar" style="width: 100%;"></div>
          <canvas id="gameCanvas"></canvas>
        </div>
        <div id="gameResultArea"></div>
      </div>
    `;
    this.canvas = this.mountEl.querySelector('#gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.timerBar = this.mountEl.querySelector('#gameTimerBar');
    this.roundLabel = this.mountEl.querySelector('#gameRoundLabel');
    this.scoreLabel = this.mountEl.querySelector('#gameScoreLabel');
    this.resultArea = this.mountEl.querySelector('#gameResultArea');

    this._onResize();
    window.addEventListener('resize', this._onResize);
    this.canvas.addEventListener('click', this._onCanvasClick);
    this.canvas.addEventListener('touchstart', this._onCanvasClick, { passive: true });
  }

  _onResize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.cssWidth = rect.width;
    this.cssHeight = rect.height;
  }

  _nextRound() {
    if (this.round >= ROUND_COUNT) {
      this._showFinalResult();
      return;
    }
    this.round += 1;
    this.roundLabel.textContent = `${this.round} / ${ROUND_COUNT}`;
    this.resultArea.innerHTML = '';
    this.defenderBaseX = 0.28 + Math.random() * 0.44; // keep marker within a comfortable central band
    this.jitterSeed = Math.random() * 1000;
    this.roundActive = true;
    this.timerStart = performance.now();
    this.clickedThisRound = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(this._tick);
  }

  _currentDefenderX(nowMs) {
    // Gentle sine-wave jitter to simulate a "shaky joystick" line, kept inside safe bounds
    const t = (nowMs - this.timerStart) / 1000;
    const jitter = Math.sin(t * 6 + this.jitterSeed) * 0.03;
    return Math.min(0.92, Math.max(0.08, this.defenderBaseX + jitter));
  }

  _tick(now) {
    if (!this.roundActive) return;
    const elapsed = now - this.timerStart;
    const remainingRatio = Math.max(0, 1 - elapsed / ROUND_TIME_MS);
    this.timerBar.style.width = `${remainingRatio * 100}%`;

    this._draw(now);

    if (elapsed >= ROUND_TIME_MS) {
      this._resolveRound(null, now);
      return;
    }
    this.rafId = requestAnimationFrame(this._tick);
  }

  _draw(now) {
    const ctx = this.ctx;
    const w = this.cssWidth;
    const h = this.cssHeight;
    ctx.clearRect(0, 0, w, h);

    // Pitch background
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#123a26');
    grad.addColorStop(1, '#0a2318');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Pitch stripes
    ctx.fillStyle = 'rgba(255,255,255,0.025)';
    const stripeCount = 8;
    for (let i = 0; i < stripeCount; i++) {
      if (i % 2 === 0) ctx.fillRect((w / stripeCount) * i, 0, w / stripeCount, h);
    }

    // Halfway-style circle for atmosphere
    ctx.strokeStyle = 'rgba(241,238,228,0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.5, h * 0.22, 0, Math.PI * 2);
    ctx.stroke();

    // Defender marker (jittering)
    const defX = this._currentDefenderX(now) * w;
    const rowY = h * 0.62;
    ctx.strokeStyle = 'rgba(184, 242, 61, 0.35)';
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(defX, h * 0.15);
    ctx.lineTo(defX, h * 0.9);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#B8F23D';
    ctx.beginPath();
    ctx.arc(defX, rowY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Attacker marker (slightly ahead, fixed offset for flavor)
    const attX = Math.min(0.95, this.defenderBaseX + 0.14) * w;
    ctx.fillStyle = '#E4C34A';
    ctx.beginPath();
    ctx.arc(attX, h * 0.38, 9, 0, Math.PI * 2);
    ctx.fill();

    // Labels
    ctx.font = '600 11px "Space Grotesk", sans-serif';
    ctx.fillStyle = 'rgba(241,238,228,0.55)';
    ctx.textAlign = 'center';
    ctx.fillText(this.getLang() === 'ar' ? 'مهاجم' : 'ATTACKER', attX, h * 0.38 - 18);
    ctx.fillText(this.getLang() === 'ar' ? 'مدافع' : 'DEFENDER', defX, rowY + 26);
  }

  _onCanvasClick(e) {
    if (!this.roundActive || this.clickedThisRound) return;
    this.clickedThisRound = true;
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const xRatio = (clientX - rect.left) / rect.width;
    this._resolveRound(xRatio, performance.now());
  }

  _resolveRound(clickRatio, now) {
    this.roundActive = false;
    cancelAnimationFrame(this.rafId);

    const actualX = this._currentDefenderX(now);
    const usedRatio = clickRatio === null ? actualX + 0.12 : clickRatio; // timeout = a poor, off-target guess
    const errorRatio = Math.abs(usedRatio - actualX);
    const accuracy = Math.max(0, Math.round(100 - errorRatio * 100 * 3.2));
    const cmOff = Math.round(errorRatio * 4000); // arbitrary pitch-width-to-cm satirical scale
    this.scores.push(accuracy);

    const t = this.t;
    const lang = this.getLang();
    const isGoodCall = errorRatio <= GOOD_CALL_THRESHOLD_PX_RATIO;
    const verdictKey = clickRatio === null
      ? 'arcadePage.gameUi.timeout'
      : (isGoodCall ? 'arcadePage.gameUi.onside' : 'arcadePage.gameUi.offside');

    this.scoreLabel.textContent = `${Math.round(this.scores.reduce((a, b) => a + b, 0) / this.scores.length)}%`;

    this.resultArea.innerHTML = `
      <div class="glass-panel game-result-panel">
        <div class="game-result-verdict">${t(verdictKey)}</div>
        <div class="game-result-detail">${t('arcadePage.gameUi.distanceLabel')}: ${cmOff}cm — ${accuracy}% ${lang === 'ar' ? 'دقة' : 'accuracy'}</div>
        <div class="game-actions" style="margin-top: 1rem;">
          <button class="btn btn-primary" id="gameNextBtn">
            <span>${this.round >= ROUND_COUNT ? t('arcadePage.gameUi.finalTitle') : t('arcadePage.gameUi.nextRound')}</span>
          </button>
        </div>
      </div>
    `;

    this.resultArea.querySelector('#gameNextBtn').addEventListener('click', () => this._nextRound());
  }

  _showFinalResult() {
    const t = this.t;
    const avg = Math.round(this.scores.reduce((a, b) => a + b, 0) / this.scores.length);
    let rankKey = 'arcadePage.gameUi.ranks.chaos';
    if (avg >= 85) rankKey = 'arcadePage.gameUi.ranks.legend';
    else if (avg >= 65) rankKey = 'arcadePage.gameUi.ranks.solid';
    else if (avg >= 40) rankKey = 'arcadePage.gameUi.ranks.shaky';

    const BEST_KEY = 'yelo_varline_best_score';
    const prevBest = Number(localStorage.getItem(BEST_KEY) || 0);
    if (avg > prevBest) localStorage.setItem(BEST_KEY, String(avg));

    this.mountEl.innerHTML = `
      <div class="game-shell">
        <div class="glass-panel game-result-panel" style="padding: 2rem;" id="gameFinalPanel">
          <span class="section-badge">${t('arcadePage.gameUi.finalTitle')}</span>
          <div class="game-result-verdict" style="font-size: 1.4rem; margin-top: 0.75rem;">${t(rankKey)}</div>
          <div class="game-result-detail" style="font-size: 1rem; margin-top: 0.5rem;">${t('arcadePage.gameUi.score')}: <b style="color: var(--accent-acid);">${avg}%</b></div>
          <div class="game-actions" style="margin-top: 1.5rem;">
            <button class="btn btn-primary" id="gameReplayBtn"><span>${t('arcadePage.gameUi.playAgain')}</span></button>
          </div>
        </div>
      </div>
    `;
    this.mountEl.querySelector('#gameReplayBtn').addEventListener('click', () => this._startGame());

    // A good/legendary run deserves a small celebration, same as winning any
    // other arcade game — not just the penalty shootout.
    if (avg >= 65) {
      spawnConfettiFromElement(this.mountEl.querySelector('#gameFinalPanel'));
    }
  }
}
