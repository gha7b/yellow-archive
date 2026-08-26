/**
 * ============================================================================
 * SHARED CONFETTI BURST — tiny, dependency-free celebration effect usable from
 * ANY screen in the site (not just inside a canvas game loop). Spawns a
 * handful of small DOM squares/dots that fly outward and fade, then remove
 * themselves. Used for "you won" / "new best score" moments across all three
 * arcade games.
 * ============================================================================
 */

const COLORS = ['#F1EEE4', '#B8F23D', '#FFD34D', '#4DD4FF', '#FF6B6B'];

export function spawnConfettiBurst(x, y, count = 34) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const angle = Math.random() * Math.PI * 2;
    const distance = 70 + Math.random() * 110;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 60; // bias the burst upward
    const size = 5 + Math.random() * 6;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const duration = 750 + Math.random() * 550;
    const rotation = Math.random() * 360;

    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      margin: -${size / 2}px 0 0 -${size / 2}px;
      background: ${color};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      pointer-events: none;
      z-index: 9999;
      opacity: 1;
      transform: translate(0, 0) rotate(0deg);
      transition: transform ${duration}ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity ${duration}ms ease-out;
      will-change: transform, opacity;
    `;
    document.body.appendChild(el);

    requestAnimationFrame(() => {
      el.style.transform = `translate(${dx}px, ${dy + 140}px) rotate(${rotation}deg)`;
      el.style.opacity = '0';
    });

    setTimeout(() => el.remove(), duration + 80);
  }
}

// Convenience: burst from the center of a given element (or screen-center as
// a fallback), so callers don't need to compute coordinates themselves.
export function spawnConfettiFromElement(el, count = 34) {
  if (!el) {
    spawnConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, count);
    return;
  }
  const rect = el.getBoundingClientRect();
  spawnConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, count);
}
