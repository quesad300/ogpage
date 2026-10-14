/**
 * ambient.ts — campo de partículas de fondo (mejora progresiva).
 *
 * Canvas decorativo (pointer-events:none, aria-hidden en el markup)
 * fijo bajo el contenido (-z-10): solo se percibe en el hero, la
 * única sección con fondo transparente. Reglas:
 *  - prefers-reduced-motion ⇒ nunca se inicializa.
 *  - Se detiene al salir de pantalla (IO de #hero), al ocultar la
 *    pestaña y al activar reduce en caliente.
 *  - DPR limitado a 2; 30–70 puntos según área; un solo rAF.
 *  - Null-check de #hero (la página 404 no lo tiene ⇒ sin canvas activo).
 */

const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const canvas = document.getElementById(
  "ambient-canvas",
) as HTMLCanvasElement | null;
const hero = document.getElementById("hero");

if (canvas && hero && !reduce.matches) {
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const LINK = 110; // px: distancia máxima para dibujar enlace
    let raf = 0;
    let running = false;
    let heroVisible = true;
    let w = 0;
    let h = 0;
    let pts: { x: number; y: number; vx: number; vy: number }[] = [];

    const seed = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(30, Math.min(70, Math.floor((w * h) / 24000)));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(59,130,246,0.5)";
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, 6.2832);
        ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.globalAlpha = 0.14 * (1 - d / LINK);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduce.matches || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    seed();

    new IntersectionObserver((entries) => {
      heroVisible = entries[0].isIntersecting;
      if (heroVisible) start();
      else stop();
    }).observe(hero);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden || !heroVisible) stop();
      else start();
    });

    reduce.addEventListener("change", (e) => {
      if (e.matches) stop();
    });

    let resizeQueued = false;
    addEventListener(
      "resize",
      () => {
        if (resizeQueued) return;
        resizeQueued = true;
        requestAnimationFrame(() => {
          resizeQueued = false;
          seed();
        });
      },
      { passive: true },
    );
  }
}
