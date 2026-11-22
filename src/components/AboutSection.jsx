import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './AboutSection.css'

gsap.registerPlugin(ScrollTrigger)

export default function AboutSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: '.about-intro-scene',
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      })
        .to('.about-hero-container', { autoAlpha: 0, duration: 0.45, ease: 'none' }, 0.3)
        .fromTo(
          '.about-transition-panel',
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.45, ease: 'none' },
          0.3
        )

      // 1. Eyebrow badge entrance
      gsap.fromTo(
        '.about-hero-container .about-eyebrow',
        { y: 25, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.about-hero-container',
            start: 'top 82%',
          },
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
        }
      )

      // 2. Headline smooth split-line entrance
      gsap.fromTo(
        '.about-hero-container .about-headline-line',
        { y: '105%', opacity: 0, rotateX: -15 },
        {
          scrollTrigger: {
            trigger: '.about-hero-container',
            start: 'top 80%',
          },
          y: '0%',
          opacity: 1,
          rotateX: 0,
          stagger: 0.16,
          duration: 1.25,
          ease: 'power4.out',
        }
      )

      // 3. Narrative description reveal with subtle upward glide
      gsap.fromTo(
        '.about-hero-container .about-desc-wrap',
        { y: 35, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.about-hero-container',
            start: 'top 75%',
          },
          y: 0,
          opacity: 1,
          duration: 1.15,
          delay: 0.25,
          ease: 'power3.out',
        }
      )

      // 4. CTA button reveal
      gsap.fromTo(
        '.about-hero-container .about-hero-btn',
        { y: 25, opacity: 0, scale: 0.94 },
        {
          scrollTrigger: {
            trigger: '.about-hero-container',
            start: 'top 72%',
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          delay: 0.4,
          ease: 'back.out(1.4)',
        }
      )

      // Content container smooth entrance
      gsap.fromTo(
        '.about-hero-container .about-hero-content',
        { x: 35, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.about-hero-container',
            start: 'top 80%',
          },
          x: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
        }
      )

      // Values 3 cards entrance
      gsap.fromTo(
        '.about-value-item',
        { y: 45, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.about-values-grid',
            start: 'top 82%',
          },
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 1,
          ease: 'power3.out',
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="story" ref={sectionRef} className="about-section" aria-label="About Falooda World">
      {/* Ambient background glows */}
      <div className="about-ambient-glow about-glow-1" aria-hidden="true" />
      <div className="about-ambient-glow about-glow-2" aria-hidden="true" />

      {/* ── A. About Hero (Screen Fit with Decadent Chocolate Sundae Splash) ── */}
      <div className="about-intro-scene">
        <div className="about-hero-container">
          <div className="about-hero-content">
            <span className="about-eyebrow">
              <span className="about-eyebrow-line" />
              Our Heritage & Story
            </span>

            <h2 className="about-hero-headline" aria-label="A Little More Sweetness. A Lot More Happiness.">
              <span className="about-headline-mask">
                <span className="about-headline-line">
                  A Little More <span className="headline-serif-italic">Sweetness.</span>
                </span>
              </span>
              <span className="about-headline-mask">
                <span className="about-headline-line">
                  A Lot More <span className="headline-gold-accent">Happiness.</span>
                </span>
              </span>
            </h2>

            <div className="about-desc-wrap">
              <p className="about-hero-desc">
                <span className="about-lead-phrase">At Falooda World,</span> dessert isn’t just an indulgence—it’s an art form. Born from a rich royal tradition of slow-simmered rose infusions, velvety churned gelato, and delicate vermicelli, we re-imagine timeless confectionery for the modern epicurean.
              </p>
            </div>

            <a href="#menu" className="about-hero-btn">
              <span>Discover Our Story</span>
              <span className="about-hero-btn-arrow">→</span>
            </a>
          </div>
        </div>

        <div className="about-transition-panel">
          <div className="about-hero-content about-transition-content">
            <span className="about-eyebrow">
              <span className="about-eyebrow-line" />
              Our Heritage & Story
            </span>

            <h2 className="about-hero-headline" aria-label="A Little More Sweetness. A Lot More Happiness.">
              <span className="about-headline-mask">
                <span className="about-headline-line">
                  A Little More <span className="headline-serif-italic">Sweetness.</span>
                </span>
              </span>
              <span className="about-headline-mask">
                <span className="about-headline-line">
                  A Lot More <span className="headline-gold-accent">Happiness.</span>
                </span>
              </span>
            </h2>

            <div className="about-desc-wrap">
              <p className="about-hero-desc">
                <span className="about-lead-phrase">At Falooda World,</span> dessert isn’t just an indulgence—it’s an art form. Born from a rich royal tradition of slow-simmered rose infusions, velvety churned gelato, and delicate vermicelli, we re-imagine timeless confectionery for the modern epicurean.
              </p>
            </div>

            <a href="#menu" className="about-hero-btn">
              <span>Discover Our Story</span>
              <span className="about-hero-btn-arrow">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── C. Brand Values ──────────────────────────────────────────────── */}
      <div className="about-values-section">
        <div className="about-values-header">
          <span className="about-eyebrow">Our Philosophy</span>
          <h3 className="about-story-title">Values in Every Layer</h3>
        </div>

        <div className="about-values-grid">
          <div className="about-value-item">
            <div className="about-value-icon-circle">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <h4 className="about-value-title">Premium Ingredients</h4>
            <p className="about-value-desc">
              Only authentic Bourbon vanilla pods, hand-selected Sicilian pistachios, 
              and pure whole dairy cream make the cut.
            </p>
          </div>

          <div className="about-value-item">
            <div className="about-value-icon-circle">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h4 className="about-value-title">Crafted with Love</h4>
            <p className="about-value-desc">
              Small-batch preparation daily ensures every sundae, falooda, and milkshake 
              carries authentic artisanal warmth.
            </p>
          </div>

          <div className="about-value-item">
            <div className="about-value-icon-circle">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <h4 className="about-value-title">Happiness in Every Scoop</h4>
            <p className="about-value-desc">
              From children to seasoned dessert connoisseurs, our mission is to spark 
              an instantaneous smile with each bite.
            </p>
          </div>
        </div>
      </div>

      {/* ── D. Brand Highlight (Full-Width Cinematic Statement) ──────────── */}
      <div className="about-cinematic-banner">
        <img
          src="/icecream/vanilla.webp"
          alt="Luxury Dessert Atmosphere"
          className="about-cinematic-bg"
          loading="lazy"
        />
        <div className="about-cinematic-overlay" />
        <div className="about-cinematic-content">
          <span className="about-cinematic-eyebrow">The Falooda World Credo</span>
          <h2 className="about-cinematic-statement">
            “Every Scoop Tells a Sweeter Story.”
          </h2>
        </div>
      </div>
    </section>
  )
}
