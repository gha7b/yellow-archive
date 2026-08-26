/**
 * ============================================================================
 * ESCAPE FROM RELEGATION — playable pixel-art endless runner for Yelo Arcade
 * ============================================================================
 * A tiny, dependency-free canvas runner: a blocky pixel-art striker jumps
 * over satirical obstacles (yellow cards, footballs, archive files, warning
 * signs, a "YELO" road sign) while a referee silhouette chases from behind.
 * One button (Space / tap) controls everything. No external engine, no
 * network calls — just canvas primitives and a tiny inline pixel grid for
 * the two character sprites. All copy comes through CONTENT.arcadePage.runnerUi
 * so it stays bilingual (EN/AR) via the site's existing i18n system.
 * ============================================================================
 */

const BEST_SCORE_KEY = 'yelo_escape_best_score';

const GRAVITY = 2200;
const JUMP_VELOCITY = -780;
const BASE_SPEED = 220;
const MAX_SPEED = 520;
const SPEED_ACCEL_PER_SEC = 4.5;
const SPAWN_MIN_MS = 950;
const SPAWN_MAX_MS = 1650;

// 8x12 pixel grid for the running striker. '.' = transparent.
const RUN_FRAME_A = [
  '..HHHH..',
  '.KKKKKK.',
  '.KKKKKK.',
  '..KKKK..',
  '.JJJJJJ.',
  'JJJGGJJJ',
  'JJJGGJJJ',
  '.JJJJJJ.',
  '..S..S..',
  '.SS..SS.',
  'BB....BB',
  '........'
];
const RUN_FRAME_B = [
  '..HHHH..',
  '.KKKKKK.',
  '.KKKKKK.',
  '..KKKK..',
  '.JJJJJJ.',
  'JJJGGJJJ',
  'JJJGGJJJ',
  '.JJJJJJ.',
  '...SS...',
  '..SSSS..',
  '..BBBB..',
  '........'
];

const PLAYER_COLORS = { H: '#2a1a10', K: '#d9a066', J: '#F1EEE4', G: '#1E9E4C', S: '#101d15', B: '#0a0a0a' };
const REFEREE_COLORS = { H: '#2a1a10', K: '#d9a066', J: '#E4681C', G: '#E4681C', S: '#101010', B: '#050505' };

// How far behind the player (in pixel-sprite units) the chasing referee is drawn.
const REFEREE_CHASE_OFFSET_UNITS = 17;

function drawPixelSprite(ctx, frame, colors, x, y, pixelSize) {
  for (let row = 0; row < frame.length; row++) {
    const line = frame[row];
    for (let col = 0; col < line.length; col++) {
      const ch = line[col];
      if (ch === '.') continue;
      ctx.fillStyle = colors[ch] || '#000';
      ctx.fillRect(Math.round(x + col * pixelSize), Math.round(y + row * pixelSize), pixelSize + 0.5, pixelSize + 0.5);
    }
  }
}

const OBSTACLE_TYPES = ['card', 'ball', 'file', 'warning', 'sign'];

function obstacleSize(type) {
  switch (type) {
    case 'card': return { w: 16, h: 22 };
    case 'ball': return { w: 20, h: 20 };
    case 'file': return { w: 26, h: 19 };
    case 'warning': return { w: 26, h: 24 };
    case 'sign': return { w: 30, h: 34 };
    default: return { w: 20, h: 20 };
  }
}

function drawObstacle(ctx, type, x, y, w, h) {
  ctx.save();
  ctx.translate(x, y);
  switch (type) {
    case 'card': {
      ctx.fillStyle = '#E4C34A';
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(0, 0, w, h, 2);
      else ctx.rect(0, 0, w, h);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case 'ball': {
      const r = w / 2;
      ctx.fillStyle = '#F1EEE4';
      ctx.beginPath();
      ctx.arc(r, r, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.moveTo(r, r - r * 0.55);
      ctx.lineTo(r - r * 0.45, r - r * 0.1);
      ctx.lineTo(r - r * 0.2, r + r * 0.5);
      ctx.lineTo(r + r * 0.2, r + r * 0.5);
      ctx.lineTo(r + r * 0.45, r - r * 0.1);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'file': {
      ctx.fillStyle = '#A47A45';
      ctx.fillRect(0, h * 0.22, w, h * 0.78);
      ctx.fillRect(w * 0.08, 0, w * 0.5, h * 0.28);
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, h * 0.22, w, h * 0.78);
      break;
    }
    case 'warning': {
      ctx.fillStyle = '#E4C34A';
      ctx.strokeStyle = '#0a0a0a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#0a0a0a';
      ctx.font = `bold ${Math.round(h * 0.5)}px "Space Grotesk", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('!', w / 2, h * 0.85);
      break;
    }
    case 'sign': {
      // signpost pole
      ctx.fillStyle = 'rgba(154,169,158,0.4)';
      ctx.fillRect(w / 2 - 2, h * 0.55, 4, h * 0.45);
      // sign head
      ctx.fillStyle = '#0d1f14';
      ctx.strokeStyle = '#A47A45';
      ctx.lineWidth = 2;
      ctx.fillRect(0, 0, w, h * 0.55);
      ctx.strokeRect(0, 0, w, h * 0.55);
      ctx.fillStyle = '#E4C34A';
      ctx.font = `bold ${Math.round(h * 0.24)}px "Space Grotesk", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('YELO', w / 2, h * 0.36);
      break;
    }
  }
  ctx.restore();
}

export class EscapeRunnerGame {
  constructor(mountEl, { t, getLang }) {
    this.mountEl = mountEl;
    this.t = t;
    this.getLang = getLang;
    this.rafId = null;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onResize = this._onResize.bind(this);
    this._loop = this._loop.bind(this);
    this._jump = this._jump.bind(this);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('keydown', this._onKeyDown);
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
        <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">${t('arcadePage.runnerUi.instructions')}</p>
        <p style="color: var(--text-muted); font-size: 0.8rem;">${t('arcadePage.runnerUi.bestLabel')}: <b style="color: var(--accent-acid);">${best}</b></p>
        <button class="btn btn-primary" id="runnerStartBtn" style="align-self: center;">
          <span>${t('arcadePage.runnerUi.startButton')}</span>
        </button>
      </div>
    `;
    this.mountEl.querySelector('#runnerStartBtn').addEventListener('click', () => this._startGame());
  }

  _startGame() {
    this._renderShell();
    this._resetState();
    window.addEventListener('keydown', this._onKeyDown);
    this.rafId = requestAnimationFrame(this._loop);
  }

  _renderShell() {
    const t = this.t;
    const best = this.getBestScore();
    this.mountEl.innerHTML = `
      <div class="game-shell">
        <div class="game-hud">
          <span>${t('arcadePage.runnerUi.scoreLabel')}<b id="runnerScoreLabel">0</b></span>
          <span>${t('arcadePage.runnerUi.bestLabel')}<b id="runnerBestLabel">${best}</b></span>
        </div>
        <div class="game-canvas-wrapper" id="runnerCanvasWrapper">
          <canvas id="runnerCanvas"></canvas>
        </div>
        <button class="btn btn-primary game-jump-btn" id="runnerJumpBtn" type="button">
          <span>${t('arcadePage.runnerUi.jumpButton')}</span>
        </button>
        <div id="runnerResultArea"></div>
      </div>
    `;
    this.canvas = this.mountEl.querySelector('#runnerCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.wrapper = this.mountEl.querySelector('#runnerCanvasWrapper');
    this.scoreLabel = this.mountEl.querySelector('#runnerScoreLabel');
    this.bestLabel = this.mountEl.querySelector('#runnerBestLabel');
    this.resultArea = this.mountEl.querySelector('#runnerResultArea');
    this.jumpBtn = this.mountEl.querySelector('#runnerJumpBtn');

    this._onResize();
    window.addEventListener('resize', this._onResize);

    this.jumpBtn.addEventListener('click', this._jump);
    this.canvas.addEventListener('pointerdown', this._jump);
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
    this.groundY = this.cssHeight * 0.78;
    this.pixelSize = Math.max(3, Math.round(this.cssHeight / 65));
  }

  _resetState() {
    this.running = true;
    this.speed = BASE_SPEED;
    this.score = 0;
    this.lastTime = performance.now();
    this.spriteTimer = 0;
    this.spriteFrame = 0;
    this.nextSpawnIn = this._randomSpawnDelay();
    this.obstacles = [];

    const spriteH = 12 * this.pixelSize;
    this.playerX = this.cssWidth * 0.16;
    this.playerW = 8 * this.pixelSize;
    this.playerH = spriteH;
    this.playerY = this.groundY - this.playerH;
    this.velocityY = 0;
    this.onGround = true;
  }

  _randomSpawnDelay() {
    const speedRatio = Math.min(1, (this.speed - BASE_SPEED) / (MAX_SPEED - BASE_SPEED));
    const min = SPAWN_MIN_MS - speedRatio * 300;
    const max = SPAWN_MAX_MS - speedRatio * 500;
    return min + Math.random() * (max - min);
  }

  _onKeyDown(e) {
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      this._jump();
    }
  }

  _jump() {
    if (!this.running) return;
    if (this.onGround) {
      this.velocityY = JUMP_VELOCITY;
      this.onGround = false;
    }
  }

  _loop(now) {
    if (!this.running) return;
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    this._update(dt, now);
    this._draw(now);

    this.rafId = requestAnimationFrame(this._loop);
  }

  _update(dt, now) {
    // Speed ramps up slowly over time, capped.
    this.speed = Math.min(MAX_SPEED, this.speed + SPEED_ACCEL_PER_SEC * dt);

    // Score by distance survived.
    this.score += this.speed * dt * 0.05;
    this.scoreLabel.textContent = Math.floor(this.score);

    // Player physics.
    this.velocityY += GRAVITY * dt;
    this.playerY += this.velocityY * dt;
    if (this.playerY >= this.groundY - this.playerH) {
      this.playerY = this.groundY - this.playerH;
      this.velocityY = 0;
      this.onGround = true;
    }

    // Running animation (skip flipping too fast under reduced motion, but keep gameplay-critical movement).
    this.spriteTimer += dt;
    const frameInterval = this.reducedMotion ? 0.35 : 0.14;
    if (this.spriteTimer > frameInterval) {
      this.spriteTimer = 0;
      this.spriteFrame = this.spriteFrame === 0 ? 1 : 0;
    }

    // Spawn obstacles.
    this.nextSpawnIn -= dt * 1000;
    if (this.nextSpawnIn <= 0) {
      const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
      const { w, h } = obstacleSize(type);
      this.obstacles.push({ type, x: this.cssWidth + w, y: this.groundY - h, w, h });
      this.nextSpawnIn = this._randomSpawnDelay();
    }

    // Move + collide + cull obstacles.
    const playerBox = { x: this.playerX + this.pixelSize, y: this.playerY + this.pixelSize, w: this.playerW - this.pixelSize * 2, h: this.playerH - this.pixelSize };
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const ob = this.obstacles[i];
      ob.x -= this.speed * dt;
      if (ob.x + ob.w < -10) {
        this.obstacles.splice(i, 1);
        continue;
      }
      const hit = playerBox.x < ob.x + ob.w * 0.85 &&
        playerBox.x + playerBox.w > ob.x + ob.w * 0.15 &&
        playerBox.y < ob.y + ob.h &&
        playerBox.y + playerBox.h > ob.y + ob.h * 0.15;
      if (hit) {
        this._gameOver();
        return;
      }
    }
  }

  _draw() {
    const ctx = this.ctx;
    const w = this.cssWidth;
    const h = this.cssHeight;
    ctx.clearRect(0, 0, w, h);

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#123a26');
    grad.addColorStop(1, '#0a2318');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Ground line.
    ctx.strokeStyle = 'rgba(241,238,228,0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, this.groundY);
    ctx.lineTo(w, this.groundY);
    ctx.stroke();

    // Referee chasing at a fixed offset behind the player (kept further back per feedback).
    const refFrame = this.spriteFrame === 0 ? RUN_FRAME_A : RUN_FRAME_B;
    const refX = Math.max(4, this.playerX - REFEREE_CHASE_OFFSET_UNITS * this.pixelSize);
    drawPixelSprite(ctx, refFrame, REFEREE_COLORS, refX, this.groundY - 12 * this.pixelSize, this.pixelSize);

    // Obstacles.
    this.obstacles.forEach(ob => drawObstacle(ctx, ob.type, ob.x, ob.y, ob.w, ob.h));

    // Player.
    const frame = this.onGround ? (this.spriteFrame === 0 ? RUN_FRAME_A : RUN_FRAME_B) : RUN_FRAME_A;
    drawPixelSprite(ctx, frame, PLAYER_COLORS, this.playerX, this.playerY, this.pixelSize);
  }

  _gameOver() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('keydown', this._onKeyDown);

    const finalScore = Math.floor(this.score);
    const best = this.getBestScore();
    const isNewBest = finalScore > best;
    if (isNewBest) this.setBestScore(finalScore);

    const t = this.t;
    const lang = this.getLang();
    const messages = CONTENT_RUNNER_MESSAGES(t);
    const message = isNewBest ? messages[1] : messages[0];

    this.bestLabel.textContent = isNewBest ? finalScore : best;

    this.resultArea.innerHTML = `
      <div class="glass-panel game-result-panel">
        ${isNewBest ? `<div class="satire-flag" style="margin-bottom: 0.4rem;">${t('arcadePage.runnerUi.newBestNote')}</div>` : ''}
        <div class="game-result-verdict">${message}</div>
        <div class="game-result-detail">${t('arcadePage.runnerUi.scoreLabel')}: ${finalScore} · ${t('arcadePage.runnerUi.bestLabel')}: ${Math.max(finalScore, best)}</div>
        <div class="game-actions" style="margin-top: 1rem;">
          <button class="btn btn-primary" id="runnerRestartBtn"><span>${t('arcadePage.runnerUi.restartButton')}</span></button>
        </div>
      </div>
    `;
    this.resultArea.querySelector('#runnerRestartBtn').addEventListener('click', () => this._startGame());
  }
}

function CONTENT_RUNNER_MESSAGES(t) {
  return [
    t('arcadePage.runnerUi.gameOverMessages.0'),
    t('arcadePage.runnerUi.gameOverMessages.1')
  ];
}
