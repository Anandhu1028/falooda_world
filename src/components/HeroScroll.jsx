/**
 * HeroScroll.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Ultra-Premium Cinematic Scroll-Controlled Falooda Reveal Experience
 *
 * Engineered for:
 * • 190-frame high-resolution sequence (public/hero/frame_000001 to frame_000190)
 * • Auto-detection of WebP with seamless PNG fallback
 * • Pixel-perfect High-DPI Canvas rendering (devicePixelRatio capped at 2)
 * • Composition-aware image scaling (dessert stays fully visible & centered)
 * • Progressive chunk preloading with graceful fallback (zero blank frames)
 * • GSAP ScrollTrigger with buttery scrub synchronization
 * • Pinned dwell zone at the final frame before seamless release
 * • prefers-reduced-motion accessibility fallback
 * • Total cleanup on unmount (zero memory leaks)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HeroOverlay.css";

gsap.registerPlugin(ScrollTrigger);

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_FRAMES = 190;
const INITIAL_BATCH = 12;     // frames required to unlock hero interaction
const CHUNK_SIZE    = 15;     // frame batch size for progressive background loading
const MAX_DPR       = 2;      // cap DPR to avoid excessive GPU memory on high-density mobile screens
const HERO_SCROLL_DISTANCE = 3600;

/**
 * Generates the frame path. Default to webp as specified,
 * supporting dynamic extension detection (.webp / .png).
 */
const getFramePath = (index, ext = "webp") =>
  `/hero/frame_${String(index).padStart(6, "0")}.${ext}`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeroScroll() {
  const sectionRef    = useRef(null);   // outer pinned section
  const runwayRef     = useRef(null);   // fills the hero pin range without a post-pin gap
  const canvasRef     = useRef(null);   // HTML5 canvas
  const overlayRef    = useRef(null);   // luxury loading overlay
  const progressRef   = useRef(null);   // loader bar fill
  const statusRef     = useRef(null);   // loader percentage text
  const hintRef       = useRef(null);   // "scroll to explore" pill
  const contentOverlayRef = useRef(null); // editorial text overlay (Crave Something Extra / One scoop was never enough)

  const imagesRef       = useRef([]);   // cached HTMLImageElement array [0..189]
  const loadedCountRef  = useRef(0);    // count of loaded frames
  const currentFrameRef = useRef(0);    // active rendered frame index (0-based)
  const rafRef          = useRef(null); // RAF handle
  const stRef           = useRef(null); // ScrollTrigger instance
  const roRef           = useRef(null); // ResizeObserver instance
  const ctxRef          = useRef(null); // CanvasRenderingContext2D
  const extRef          = useRef("webp"); // active format ("webp" or "png")

  // ─── Render Frame onto Canvas ───────────────────────────────────────────────

  const renderFrame = useCallback((frameIdx) => {
    const canvas = canvasRef.current;
    const ctx    = ctxRef.current;
    if (!canvas || !ctx) return;

    // Retrieve requested frame or closest available loaded frame
    let img = imagesRef.current[frameIdx];
    let resolvedIdx = frameIdx;

    if (!img || !img.complete || img.naturalWidth === 0) {
      // Search backward first for the closest loaded frame
      let found = false;
      for (let i = frameIdx - 1; i >= 0; i--) {
        if (imagesRef.current[i]?.complete && imagesRef.current[i]?.naturalWidth > 0) {
          img = imagesRef.current[i];
          resolvedIdx = i;
          found = true;
          break;
        }
      }
      // If none backward, search forward
      if (!found) {
        for (let i = frameIdx + 1; i < TOTAL_FRAMES; i++) {
          if (imagesRef.current[i]?.complete && imagesRef.current[i]?.naturalWidth > 0) {
            img = imagesRef.current[i];
            resolvedIdx = i;
            break;
          }
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    currentFrameRef.current = resolvedIdx;

    const cW = canvas.width;
    const cH = canvas.height;

    // Composition-aware scaling:
    // Dessert is centered horizontally and spans ~80% of vertical height.
    // Cover scale ensures full-bleed cinematic presence on all screen aspect ratios
    // while perfectly preserving the central dessert without distortion.
    const scale = Math.max(cW / img.naturalWidth, cH / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;

    const offsetX = (cW - drawW) / 2;
    const offsetY = (cH - drawH) / 2;

    ctx.clearRect(0, 0, cW, cH);
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }, []);

  // ─── Schedule render with requestAnimationFrame ─────────────────────────────

  const scheduleRender = useCallback((frameIdx) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      renderFrame(frameIdx);
      rafRef.current = null;
    });
  }, [renderFrame]);

  // ─── High-DPI Canvas Resizing ───────────────────────────────────────────────

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx    = ctxRef.current;
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const rect = canvas.getBoundingClientRect();

    const displayW = Math.round(rect.width * dpr);
    const displayH = Math.round(rect.height * dpr);

    if (canvas.width !== displayW || canvas.height !== displayH) {
      canvas.width  = displayW;
      canvas.height = displayH;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    }

    renderFrame(currentFrameRef.current);
  }, [renderFrame]);

  // ─── Single Image Loader ────────────────────────────────────────────────────

  const loadImage = useCallback((index, ext) => {
    return new Promise((resolve) => {
      if (imagesRef.current[index]?.complete && imagesRef.current[index]?.naturalWidth > 0) {
        resolve(imagesRef.current[index]);
        return;
      }

      const img = new Image();
      img.decoding = "async";

      img.onload = () => {
        imagesRef.current[index] = img;
        loadedCountRef.current += 1;

        // Update progress bar UI smoothly
        const progress = Math.min(loadedCountRef.current / TOTAL_FRAMES, 1);
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${progress})`;
        }
        if (statusRef.current) {
          statusRef.current.textContent = `${Math.round(progress * 100)}%`;
        }

        resolve(img);
      };

      img.onerror = () => {
        // Fallback or graceful resolve to avoid blocking pipeline
        resolve(null);
      };

      img.src = getFramePath(index + 1, ext);
    });
  }, []);

  // ─── Batch Loader ───────────────────────────────────────────────────────────

  const loadBatch = useCallback((indices, ext) => {
    return Promise.all(indices.map((idx) => loadImage(idx, ext)));
  }, [loadImage]);

  // ─── Main Lifecycle & GSAP ScrollTrigger ────────────────────────────────────

  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    ctxRef.current = ctx;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const rootElement = document.documentElement;
    const bodyElement = document.body;
    const previousRootOverflow = rootElement.style.overflow;
    const previousBodyOverflow = bodyElement.style.overflow;
    let scrollLocked = true;
    rootElement.style.overflow = "hidden";
    bodyElement.style.overflow = "hidden";
    const unlockPageScroll = () => {
      if (!scrollLocked) return;
      rootElement.style.overflow = previousRootOverflow;
      bodyElement.style.overflow = previousBodyOverflow;
      scrollLocked = false;
    };
    const updateScrollRunway = () => {
      const section = sectionRef.current;
      const runway = runwayRef.current;
      if (!section || !runway) return;
      runway.style.height = `${Math.max(0, HERO_SCROLL_DISTANCE - section.offsetHeight)}px`;
    };

    imagesRef.current = new Array(TOTAL_FRAMES).fill(null);
    loadedCountRef.current = 0;

    resizeCanvas();

    // 1. Detect image format: test .webp first, fallback to .png if necessary
    const probeFormat = async () => {
      const probeWebP = new Promise((resolve) => {
        const testImg = new Image();
        testImg.onload = () => resolve("webp");
        testImg.onerror = () => resolve("png");
        testImg.src = getFramePath(1, "webp");
      });

      const detectedExt = await probeWebP;
      extRef.current = detectedExt;
      return detectedExt;
    };

    let isCancelled = false;

    probeFormat().then(async (ext) => {
      if (isCancelled) return;

      // Handle prefers-reduced-motion: load only frame 0 and display
      if (prefersReducedMotion) {
        await loadImage(0, ext);
        renderFrame(0);
        if (overlayRef.current) {
          overlayRef.current.style.opacity = "0";
          overlayRef.current.style.pointerEvents = "none";
        }
        if (contentOverlayRef.current) {
          contentOverlayRef.current.classList.add("is-revealed");
        }
        unlockPageScroll();
        return;
      }

      // Load an initial batch first so the canvas has a valid first frame.
      const initialIndices = Array.from({ length: INITIAL_BATCH }, (_, i) => i);
      await loadBatch(initialIndices, ext);

      if (isCancelled) return;

      // Finish loading the sequence before enabling scroll interaction. This
      // prevents ScrollTrigger from requesting frames that are not available.
      const remainingIndices = Array.from(
        { length: TOTAL_FRAMES - INITIAL_BATCH },
        (_, i) => i + INITIAL_BATCH
      );

      const loadRemaining = async () => {
        for (let i = 0; i < remainingIndices.length; i += CHUNK_SIZE) {
          if (isCancelled) break;
          const chunk = remainingIndices.slice(i, i + CHUNK_SIZE);
          await loadBatch(chunk, ext);
        }
      };

      await loadRemaining();
      if (isCancelled) return;

      if (loadedCountRef.current !== TOTAL_FRAMES) {
        if (statusRef.current) {
          statusRef.current.textContent = "Unable to load all frames. Please refresh.";
        }
        unlockPageScroll();
        return;
      }

      renderFrame(0);

      // Reveal the hero only after every frame is ready.
      if (overlayRef.current) {
        overlayRef.current.style.transition = "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease";
        overlayRef.current.style.opacity = "0";
        overlayRef.current.style.filter = "blur(8px)";
        overlayRef.current.style.pointerEvents = "none";
      }

      if (contentOverlayRef.current) {
        contentOverlayRef.current.classList.add("is-revealed");
      }

      // Setup the hero pin after its frames load, then recalculate downstream
      // pins that were registered earlier in the page lifecycle.
      updateScrollRunway();
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${HERO_SCROLL_DISTANCE}`,
        pin: true,
        pinSpacing: false,
        scrub: 0.8,              // buttery smooth scroll scrub
        anticipatePin: 1,
        onUpdate: (self) => {
          // Fade out the editorial text smoothly as the visitor scrolls into the frame animation
          if (contentOverlayRef.current) {
            const contentOpacity = Math.max(0, 1 - self.progress * 6);
            contentOverlayRef.current.style.opacity = String(contentOpacity);
            contentOverlayRef.current.style.transform = `translateY(${self.progress * -35}px)`;
            contentOverlayRef.current.style.pointerEvents = contentOpacity < 0.1 ? 'none' : 'auto';
          }

          // Fade out the scroll prompt quickly once user starts scrolling
          if (hintRef.current) {
            const hintOpacity = Math.max(0, 1 - self.progress * 8);
            hintRef.current.style.opacity = String(hintOpacity);
          }

          const frameProgress = self.progress;
          const targetFrame = Math.min(
            Math.round(frameProgress * (TOTAL_FRAMES - 1)),
            TOTAL_FRAMES - 1
          );

          if (targetFrame !== currentFrameRef.current) {
            scheduleRender(targetFrame);
          }

        },
      });

      stRef.current = st;
      ScrollTrigger.refresh();
      unlockPageScroll();
    });

    // Responsive ResizeObserver
    const ro = new ResizeObserver(() => {
      if (stRef.current) updateScrollRunway();
      resizeCanvas();
      ScrollTrigger.refresh();
    });

    if (sectionRef.current) {
      ro.observe(sectionRef.current);
    }
    roRef.current = ro;

    return () => {
      isCancelled = true;
      unlockPageScroll();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (stRef.current) {
        stRef.current.kill();
        stRef.current = null;
      }
      if (roRef.current)  roRef.current.disconnect();
      imagesRef.current = [];
    };
  }, [loadImage, loadBatch, renderFrame, resizeCanvas, scheduleRender]);

  // ─── Component Markup ───────────────────────────────────────────────────────

  return (
    <div className="hero-scroll-track">
      <section
        ref={sectionRef}
        id="home"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "100vw",
          height: "100svh",
          overflow: "hidden",
          background: "#120d09",        // deep warm ambient background matching video tone
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
      {/* ── HTML5 High-DPI Canvas ────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        aria-label="Cinematic dessert scroll reveal animation"
        role="img"
      />

      {/* ── Editorial Hero Overlay (Matches Reference Screenshot) ───────── */}
      <div ref={contentOverlayRef} className="hero-overlay-container">
        {/* Left Side: CRAVE SOMETHING EXTRA. */}
        <div className="hero-left-block">
          <h1 className="hero-left-headline">
            CRAVE<br />
            SOMETHING<br />
            EXTRA<span className="hero-dot-accent">.</span>
          </h1>
          <p className="hero-left-desc">
            One sip feels a rush and tastes beyond delicious. Creamy bliss
            crafted for true dessert lovers.
          </p>
        </div>

        {/* Right Side: One scoop was never enough (Curved Arch Tagline) */}
        <div className="hero-right-block">
          <div className="hero-arch-wrapper">
            <svg
              viewBox="0 0 250 65"
              className="hero-arch-svg"
              aria-label="Indulge to happiness"
            >
              <defs>
                <path
                  id="indulgeArchPath"
                  d="M 22 60 A 120 100 0 0 1 228 60"
                  fill="none"
                />
              </defs>
              {/* Left radial tick */}
              <line
                x1="26"
                y1="48"
                x2="14"
                y2="64"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Arched uppercase text */}
              <text className="hero-arch-text" fill="currentColor">
                <textPath
                  href="#indulgeArchPath"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  INDULGE TO HAPPINESS
                </textPath>
              </text>
              {/* Right radial tick */}
              <line
                x1="224"
                y1="48"
                x2="236"
                y2="64"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2 className="hero-right-headline">
            One scoop<br />
            was never<br />
            enough.
          </h2>
        </div>
      </div>

      {/* ── Elegant scroll hint (Bottom Center, fades on scroll) ─────────── */}
      <div
        ref={hintRef}
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.6rem",
          pointerEvents: "none",
          userSelect: "none",
          transition: "opacity 0.3s ease",
          zIndex: 5,
        }}
      >
        <span
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 500,
            color: "#57351d",
          }}
        >
          Scroll to Explore
        </span>
        <div
          style={{
            width: "1px",
            height: "22px",
            background: "linear-gradient(to bottom, #57351d, transparent)",
            animation: "pulseScroll 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />
      </div>

      {/* ── Ultra-Luxury Smooth Loading Overlay ─────────────────────────── */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          background: "linear-gradient(180deg, #caa689 0%, #b8987e 100%)",
          zIndex: 20,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              margin: "0 0 0.4rem",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 800,
              fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)",
              letterSpacing: "0.14em",
              color: "#2a1408",
              textTransform: "uppercase",
            }}
          >
            Falooda World
          </h2>
          <p
            style={{
              margin: 0,
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "rgba(42, 20, 8, 0.7)",
              fontWeight: 500,
            }}
          >
            Crafting The Experience
          </p>
        </div>

        {/* Minimalist Smooth Progress Track */}
        <div
          style={{
            width: "clamp(180px, 32vw, 280px)",
            height: "2px",
            background: "rgba(42, 20, 8, 0.18)",
            borderRadius: "2px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            ref={progressRef}
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, #5c351b, #2a1408)",
              transformOrigin: "left center",
              transform: "scaleX(0)",
              transition: "transform 0.15s ease-out",
            }}
          />
        </div>

        {/* Percentage text */}
        <span
          ref={statusRef}
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, monospace",
            fontSize: "0.74rem",
            letterSpacing: "0.18em",
            color: "rgba(42, 20, 8, 0.8)",
            fontWeight: 600,
          }}
        >
          0%
        </span>
      </div>
      </section>
      <div ref={runwayRef} className="hero-scroll-runway" aria-hidden="true" />
    </div>
  );
}
