/**
 * motion.ts — núcleo de movimiento (mejora progresiva).
 *
 * Sin JS el sitio se ve completo. Este módulo se ejecuta como script
 * diferido, espera a que el navegador pinte una vez, pre-marca lo que
 * ya está en pantalla (evita parpadeo) y solo entonces activa el gate
 * html[data-motion="on"], del que cuelgan todos los estados ocultos.
 * Con prefers-reduced-motion no se activa nada.
 */

const root = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion: reduce)");

if (!reduce.matches) {
  const progress = document.getElementById("scroll-progress");
  const nav = document.querySelector("[data-nav]");

  // Tras el primer pintado: no ocultar nada antes de que se vea.
  requestAnimationFrame(() => {
    requestAnimationFrame(init);
  });

  function init() {
    // 1) Pre-marcamos lo ya visible para que no parpadee al abrir el gate.
    const pending: Element[] = [];
    const viewportH = window.innerHeight;
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (el.getBoundingClientRect().top < viewportH) {
        el.classList.add("is-visible");
      } else {
        pending.push(el);
      }
    });

    // 2) Gate DESPUÉS del pre-marcado.
    root.dataset.motion = "on";

    // 3) Reveal una sola vez por elemento.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("is-visible");
          io.unobserve(el);
          countUpIn(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    pending.forEach((el) => io.observe(el));

    // 4) Barra de progreso + estado del navbar: un listener, rAF.
    let queued = false;
    const paint = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (progress) progress.style.transform = `scaleX(${p})`;
      nav?.toggleAttribute("data-scrolled", window.scrollY > 8);
    };
    addEventListener(
      "scroll",
      () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(paint);
      },
      { passive: true },
    );
    paint();

    // 5) Parallax del diagrama: solo puntero fino (en táctil no existe).
    if (matchMedia("(pointer: fine)").matches) {
      document
        .querySelectorAll<HTMLElement>("[data-diagram-parallax]")
        .forEach((box) => {
          let queuedPx = false;
          let px = 0;
          let py = 0;
          const apply = () => {
            queuedPx = false;
            box.style.setProperty("--px", String(px));
            box.style.setProperty("--py", String(py));
          };
          box.addEventListener("pointermove", (e) => {
            const r = box.getBoundingClientRect();
            px = +((((e.clientX - r.left) / r.width) * 2 - 1) * 0.5).toFixed(3);
            py = +((((e.clientY - r.top) / r.height) * 2 - 1) * 0.5).toFixed(3);
            if (queuedPx) return;
            queuedPx = true;
            requestAnimationFrame(apply);
          });
          box.addEventListener("pointerleave", () => {
            px = 0;
            py = 0;
            apply();
          });
        });

      // 5b) Tilt 3D de tarjetas: rotateX/rotateY ≤6°, rAF-throttled.
      //     Sin clics interceptados (solo transform). En táctil no
      //     se inicializa (pointer:fine) y reduce ya bloqueó todo.
      const TILT_MAX = 6; // grados
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
        let queuedT = false;
        let rx = 0;
        let ry = 0;
        const applyTilt = () => {
          queuedT = false;
          card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        };
        card.addEventListener("pointermove", (e) => {
          if (reduce.matches) return;
          const r = card.getBoundingClientRect();
          const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
          const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
          ry = +(nx * TILT_MAX).toFixed(2);
          rx = +(-ny * TILT_MAX).toFixed(2);
          card.classList.add("is-tilting");
          if (queuedT) return;
          queuedT = true;
          requestAnimationFrame(applyTilt);
        });
        card.addEventListener("pointerleave", () => {
          card.classList.remove("is-tilting");
          card.style.transform = "";
        });
      });

      // 5c) CTAs magnéticos: sigue al puntero con ≤0.3× del offset,
      //     clamp a 6px; vuelve con "spring" al salir.
      const MAG_CLAMP = 6; // px
      document
        .querySelectorAll<HTMLElement>("[data-magnetic]")
        .forEach((el) => {
          let queuedM = false;
          let tx = 0;
          let ty = 0;
          const applyMag = () => {
            queuedM = false;
            el.style.transform = tx || ty ? `translate(${tx}px, ${ty}px)` : "";
          };
          el.addEventListener("pointermove", (e) => {
            if (reduce.matches) return;
            const r = el.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            tx = Math.max(-MAG_CLAMP, Math.min(MAG_CLAMP, dx * 0.3));
            ty = Math.max(-MAG_CLAMP, Math.min(MAG_CLAMP, dy * 0.3));
            if (queuedM) return;
            queuedM = true;
            requestAnimationFrame(applyMag);
          });
          el.addEventListener("pointerleave", () => {
            tx = 0;
            ty = 0;
            applyMag();
          });
        });
    }

    // 6) Kill-switch en caliente: si activan reduce, todo vuelve a estático.
    reduce.addEventListener("change", (e) => {
      if (!e.matches) return;
      root.removeAttribute("data-motion");
      io.disconnect();
      if (progress) progress.style.transform = "";
      document
        .querySelectorAll<HTMLElement>("[data-tilt],[data-magnetic]")
        .forEach((el) => {
          el.style.transform = "";
          el.classList.remove("is-tilting");
        });
    });
  }

  /** Contador animado: el valor real siempre vive en el HTML. */
  function countUpIn(el: Element) {
    el.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
      if (node.dataset.counted !== undefined) return;
      node.dataset.counted = "";
      const final = node.textContent ?? "";
      const target = Number.parseInt(final, 10);
      if (!Number.isFinite(target)) return;
      const start = performance.now();
      const duration = 900;
      const tick = (now: number) => {
        if (reduce.matches || root.dataset.motion === undefined) {
          node.textContent = final;
          return;
        }
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - (1 - t) ** 3;
        if (t < 1) {
          node.textContent = String(Math.round(target * eased));
          requestAnimationFrame(tick);
        } else {
          node.textContent = final;
        }
      };
      node.textContent = "0";
      requestAnimationFrame(tick);
    });
  }
}
