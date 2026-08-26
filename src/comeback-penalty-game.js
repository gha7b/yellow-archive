/**
 * ============================================================================
 * THE COMEBACK PENALTY — playable pixel-art penalty shootout for Yelo Arcade
 * ============================================================================
 * A tiny, dependency-free canvas game: pick left / center / right, the keeper
 * guesses a direction at the same instant, and the ball animates toward the
 * chosen corner. 5 penalties per shootout, score + round counter + a best
 * score saved locally. No external engine, no network calls — canvas
 * primitives only. All copy comes through CONTENT.arcadePage.penaltyUi so it
 * stays bilingual (EN/AR) via the site's existing i18n system.
 * ============================================================================
 */

import { spawnConfettiFromElement } from './confetti.js';

const BEST_SCORE_KEY = 'yelo_penalty_best_score';
const ROUNDS_PER_MATCH = 5;
const SHOT_ANIM_MS = 480;
const RESULT_PAUSE_MS = 1100;
const DIRECTIONS = ['left', 'center', 'right'];

export class ComebackPenaltyGame {
  constructor(mountEl, { t, getLang }) {
    this.mountEl = mountEl;
    this.t = t;
    this.getLang = getLang;
    this.rafId = null;
    this.particleRafId = null;
    this.particles = [];
    this.keyHandler = this._onKeyDown.bind(this);
    this._onResize = this._onResize.bind(this);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.particleRafId) cancelAnimationFrame(this.particleRafId);
    if (this.resolveTimeoutId) clearTimeout(this.resolveTimeoutId);
    window.removeEventListener('keydown', this.keyHandler);
    window.removeEventListener('resize', this._onResize);
  }

  getBestScore() {
    try {
      return parseInt(localStorage.getItem(BEST_SCORE_KEY) || '0', 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  setBestScore(val) {
    try {
      localStorage.setItem(BEST_SCORE_KEY, String(val));
    } catch (e) {
      /* localStorage unavailable — best score just won't persist */
    }
  }

  renderIntro() {
    const t = this.t;
    const best = this.getBestScore();
    this.mountEl.innerHTML = `
      <div class="game-shell">
        <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">${t('arcadePage.penaltyUi.instructions')}</p>
        <p style="color: var(--text-muted); font-size: 0.8rem;">${t('arcadePage.penaltyUi.bestLabel')}: <b style="color: var(--accent-acid);">${best}</b> / ${ROUNDS_PER_MATCH}</p>
        <button class="btn btn-primary" id="penaltyStartBtn" style="align-self: center;">
          <span>${t('arcadePage.penaltyUi.startButton')}</span>
        </button>
      </div>
    `;
    this.mountEl.querySelector('#penaltyStartBtn').addEventListener('click', () => this._startMatch());
  }

  _startMatch() {
    this.round = 0;
    this.score = 0;
    this.locked = false;
    this._renderShell();
    window.addEventListener('keydown', this.keyHandler);
    this._nextRound();
  }

  _renderShell() {
    const t = this.t;
    const best = this.getBestScore();
    this.mountEl.innerHTML = `
      <div class="game-shell">
        <div class="game-hud">
          <span>${t('arcadePage.penaltyUi.roundLabel')}<b id="penaltyRoundLabel">1 / ${ROUNDS_PER_MATCH}</b></span>
          <span>${t('arcadePage.penaltyUi.scoreLabel')}<b id="penaltyScoreLabel">0</b></span>
          <span>${t('arcadePage.penaltyUi.bestLabel')}<b id="penaltyBestLabel">${best}</b></span>
        </div>
        <div class="game-canvas-wrapper" id="penaltyCanvasWrapper">
          <canvas id="penaltyCanvas"></canvas>
        </div>
        <div class="game-actions penalty-dir-btns" id="penaltyDirectionBtns">
          <button class="btn btn-secondary" data-dir="left" style="flex: 1;"><span>${t('arcadePage.penaltyUi.leftButton')}</span></button>
          <button class="btn btn-secondary" data-dir="center" style="flex: 1;"><span>${t('arcadePage.penaltyUi.centerButton')}</span></button>
          <button class="btn btn-secondary" data-dir="right" style="flex: 1;"><span>${t('arcadePage.penaltyUi.rightButton')}</span></button>
        </div>
        <div id="penaltyResultArea"></div>
      </div>
    `;
    this.canvas = this.mountEl.querySelector('#penaltyCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.roundLabel = this.mountEl.querySelector('#penaltyRoundLabel');
    this.scoreLabel = this.mountEl.querySelector('#penaltyScoreLabel');
    this.bestLabel = this.mountEl.querySelector('#penaltyBestLabel');
    this.resultArea = this.mountEl.querySelector('#penaltyResultArea');
    this.dirBtnsWrap = this.mountEl.querySelector('#penaltyDirectionBtns');

    this._onResize();
    window.addEventListener('resize', this._onResize);

    this.dirBtnsWrap.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => this._shoot(btn.getAttribute('data-dir')));
    });
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
    if (!this.animState) this._draw(0, null);
  }

  _onKeyDown(e) {
    if (this.locked) return;
    const key = e.key;
    if (key === 'ArrowLeft' || key === '1') { e.preventDefault(); this._shoot('left'); }
    else if (key === 'ArrowDown' || key === 'ArrowUp' || key === '2') { e.preventDefault(); this._shoot('center'); }
    else if (key === 'ArrowRight' || key === '3') { e.preventDefault(); this._shoot('right'); }
  }

  _zoneX(dir) {
    const goalX = this.cssWidth * 0.12;
    const goalW = this.cssWidth * 0.76;
    if (dir === 'left') return goalX + goalW * 0.18;
    if (dir === 'right') return goalX + goalW * 0.82;
    return goalX + goalW * 0.5;
  }

  _nextRound() {
    if (this.particleRafId) cancelAnimationFrame(this.particleRafId);
    this.particleRafId = null;
    this.particles = [];
    this.round += 1;
    this.roundLabel.textContent = `${this.round} / ${ROUNDS_PER_MATCH}`;
    this.resultArea.innerHTML = '';
    this.locked = false;
    this.dirBtnsWrap.style.opacity = '1';
    this.dirBtnsWrap.style.pointerEvents = 'auto';
    this.animState = null;
    this._draw(0, null);
  }

  _shoot(playerDir) {
    if (this.locked) return;
    this.locked = true;
    if (this.particleRafId) cancelAnimationFrame(this.particleRafId);
    this.particleRafId = null;
    this.particles = [];
    this.dirBtnsWrap.style.opacity = '0.5';
    this.dirBtnsWrap.style.pointerEvents = 'none';

    const keeperDir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    const scored = playerDir !== keeperDir;

    this.animState = {
      startTime: performance.now(),
      playerDir,
      keeperDir,
      scored
    };
    this.rafId = requestAnimationFrame((now) => this._animateShot(now));
  }

  _animateShot(now) {
    const state = this.animState;
    if (!state) return;
    const elapsed = now - state.startTime;
    const progress = Math.min(1, elapsed / SHOT_ANIM_MS);
    this._draw(progress, state);

    if (progress < 1) {
      this.rafId = requestAnimationFrame((n) => this._animateShot(n));
    } else {
      this._resolveRound(state);
    }
  }

  _resolveRound(state) {
    const t = this.t;
    const lang = this.getLang();
    if (state.scored) {
      this.score += 1;
      const targetX = this._zoneX(state.playerDir);
      const goalY = this.cssHeight * 0.14;
      const goalH = this.cssHeight * 0.32;
      this._spawnGoalParticles(targetX, goalY + goalH * 0.55, state);
    }
    this.scoreLabel.textContent = this.score;

    const messageKey = state.scored ? 'success' : 'miss';
    const message = t(`arcadePage.penaltyUi.resultMessages.${messageKey}`);

    this.resultArea.innerHTML = `
      <div class="glass-panel game-result-panel">
        <div class="game-result-verdict">${message}</div>
      </div>
    `;

    // Tracked so destroy() can cancel it — otherwise closing the game modal
    // mid-pause doesn't stop this from firing later and touching a shell
    // that's no longer the active one.
    this.resolveTimeoutId = setTimeout(() => {
      this.resolveTimeoutId = null;
      if (this.round >= ROUNDS_PER_MATCH) {
        this._showFinalResult();
      } else {
        this._nextRound();
      }
    }, RESULT_PAUSE_MS);
  }

  _showFinalResult() {
    const t = this.t;
    const best = this.getBestScore();
    const isNewBest = this.score > best;
    if (isNewBest) this.setBestScore(this.score);
    this.bestLabel.textContent = isNewBest ? this.score : best;

    window.removeEventListener('keydown', this.keyHandler);

    this.mountEl.innerHTML = `
      <div class="game-shell">
        <div class="glass-panel game-result-panel" style="padding: 2rem;" id="penaltyFinalPanel">
          <span class="section-badge">${t('arcadePage.penaltyUi.finalTitle')}</span>
          ${isNewBest ? `<div class="satire-flag" style="margin-top: 0.75rem;">${t('arcadePage.penaltyUi.newBestNote')}</div>` : ''}
          <div class="game-result-verdict" style="font-size: 1.4rem; margin-top: 0.75rem;">${this.score} / ${ROUNDS_PER_MATCH}</div>
          <div class="game-result-detail" style="font-size: 1rem; margin-top: 0.5rem;">${t('arcadePage.penaltyUi.bestLabel')}: <b style="color: var(--accent-acid);">${Math.max(this.score, best)}</b> / ${ROUNDS_PER_MATCH}</div>
          <div class="game-actions" style="margin-top: 1.5rem;">
            <button class="btn btn-primary" id="penaltyReplayBtn"><span>${t('arcadePage.penaltyUi.restartButton')}</span></button>
          </div>
        </div>
      </div>
    `;
    this.mountEl.querySelector('#penaltyReplayBtn').addEventListener('click', () => this._startMatch());

    if (isNewBest || this.score >= 4) {
      spawnConfettiFromElement(this.mountEl.querySelector('#penaltyFinalPanel'));
    }
  }

  // Small canvas confetti burst fired from the goal spot the instant a shot
  // scores — pure physics (velocity + gravity + fading life), no libraries.
  _spawnGoalParticles(x, y, state) {
    if (this.particleRafId) cancelAnimationFrame(this.particleRafId);
    const colors = ['#F1EEE4', '#B8F23D', '#FFD34D', '#4DD4FF', '#FF6B6B'];
    this.particles = Array.from({ length: 26 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;
      return {
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: 2 + Math.random() * 3,
        life: 1,
        decay: 0.015 + Math.random() * 0.015,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    });
    this._lastResolvedState = state;
    this._tickParticles();
  }

  _tickParticles() {
    if (!this.particles.length) {
      this.particleRafId = null;
      return;
    }
    this.particles.forEach(p => {
      p.vy += 0.12;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
    });
    this.particles = this.particles.filter(p => p.life > 0);

    // Redraw the resting scene first (ball in the net, keeper dived) then
    // layer the particles on top so they read as a burst at the goal mouth.
    this._draw(1, this._lastResolvedState);
    this._drawParticles();

    if (this.particles.length) {
      this.particleRafId = requestAnimationFrame(() => this._tickParticles());
    } else {
      this.particleRafId = null;
    }
  }

  _drawParticles() {
    const ctx = this.ctx;
    if (!ctx) return;
    this.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  _draw(progress, state) {
    const ctx = this.ctx;
    const w = this.cssWidth;
    const h = this.cssHeight;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#123a26');
    grad.addColorStop(1, '#0a2318');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Goal frame.
    const goalX = w * 0.12;
    const goalW = w * 0.76;
    const goalY = h * 0.14;
    const goalH = h * 0.32;
    ctx.strokeStyle = 'rgba(241,238,228,0.7)';
    ctx.lineWidth = 3;
    ctx.strokeRect(goalX, goalY, goalW, goalH);

    // Net crosshatch.
    ctx.strokeStyle = 'rgba(241,238,228,0.18)';
    ctx.lineWidth = 1;
    const netStep = goalW / 10;
    for (let x = goalX; x <= goalX + goalW; x += netStep) {
      ctx.beginPath();
      ctx.moveTo(x, goalY);
      ctx.lineTo(x, goalY + goalH);
      ctx.stroke();
    }
    const netStepY = goalH / 5;
    for (let y = goalY; y <= goalY + goalH; y += netStepY) {
      ctx.beginPath();
      ctx.moveTo(goalX, y);
      ctx.lineTo(goalX + goalW, y);
      ctx.stroke();
    }

    // Keeper.
    const keeperDir = state ? state.keeperDir : 'center';
    const keeperBaseX = this._zoneX('center');
    const keeperTargetX = this._zoneX(keeperDir);
    const keeperProgress = state ? Math.min(1, progress * 1.4) : 0;
    const keeperX = keeperBaseX + (keeperTargetX - keeperBaseX) * keeperProgress;
    const keeperY = goalY + goalH - h * 0.02;
    const dive = state ? keeperProgress * (keeperDir === 'center' ? 0 : h * 0.03) : 0;
    ctx.fillStyle = '#A47A45';
    ctx.fillRect(keeperX - w * 0.035, keeperY - h * 0.09 + dive, w * 0.07, h * 0.09);
    ctx.fillStyle = '#d9a066';
    ctx.beginPath();
    ctx.arc(keeperX, keeperY - h * 0.1 + dive, w * 0.022, 0, Math.PI * 2);
    ctx.fill();

    // Kicker (static figure at the penalty spot).
    const kickerX = w * 0.5;
    const kickerY = h * 0.78;
    ctx.fillStyle = '#F1EEE4';
    ctx.fillRect(kickerX - w * 0.03, kickerY - h * 0.11, w * 0.06, h * 0.09);
    ctx.fillStyle = '#1E9E4C';
    ctx.fillRect(kickerX - w * 0.012, kickerY - h * 0.08, w * 0.024, h * 0.024);
    ctx.fillStyle = '#d9a066';
    ctx.beginPath();
    ctx.arc(kickerX, kickerY - h * 0.13, w * 0.022, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#101d15';
    ctx.fillRect(kickerX - w * 0.025, kickerY - h * 0.02, w * 0.05, h * 0.05);

    // Ball.
    let ballX = kickerX;
    let ballY = kickerY - h * 0.02;
    if (state) {
      const targetX = this._zoneX(state.playerDir);
      const targetY = goalY + goalH * 0.55;
      const ease = 1 - Math.pow(1 - progress, 2);
      ballX = kickerX + (targetX - kickerX) * ease;
      ballY = (kickerY - h * 0.02) + (targetY - (kickerY - h * 0.02)) * ease;
    }
    ctx.fillStyle = '#F1EEE4';
    ctx.beginPath();
    ctx.arc(ballX, ballY, Math.max(4, w * 0.018), 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}
