import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './IceCreamCollection.css'

gsap.registerPlugin(ScrollTrigger)

const ICE_CREAM_COLLECTION = [
  {
    id: 'vanilla',
    name: 'Classic Vanilla',
    desc: 'Creamy, smooth and timeless.',
    bg: '#FAF3EA',
    textColor: '#24140C',
    subColor: '#6D503B',
    image: '/icecream/bowl_vanilla.webp',
    video: '/icecream/vanilla.mp4',
  },
  {
    id: 'chocolate',
    name: 'Belgian Chocolate',
    desc: 'Deep, rich chocolate indulgence.',
    bg: '#3D2316',
    textColor: '#FAF3EA',
    subColor: '#D4C2B2',
    image: '/icecream/bowl_chocolate.png',
    video: '/icecream/chocolate.mp4',
  },
  {
    id: 'strawberry',
    name: 'Strawberry Bliss',
    desc: 'Sweet strawberry with a creamy finish.',
    bg: 'linear-gradient(180deg, #FFA1B5 0%, #FF8DA4 45%, #F69CB0 100%)',
    textColor: '#24140C',
    subColor: '#52212B',
    image: '/icecream/bowl_strawberry.webp',
    video: '/icecream/strawberry.mp4',
    badge: 'BEST SELLER',
  },
  {
    id: 'mango',
    name: 'Mango Delight',
    desc: 'Refreshing tropical mango flavour.',
    bg: '#F7B955',
    textColor: '#24140C',
    subColor: '#5C3708',
    image: '/icecream/bowl_mango.webp',
    video: '/icecream/mango.mp4',
  },
  {
    id: 'pistachio',
    name: 'Pistachio Dream',
    desc: 'Rich pistachio with a nutty finish.',
    bg: '#DCE6CC',
    textColor: '#1B2E16',
    subColor: '#4A6045',
    image: '/icecream/bowl_pistachio.webp',
    video: '/icecream/pistachio.mp4',
  },
]

export default function IceCreamCollection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredId, setHoveredId] = useState(null)
  const total = ICE_CREAM_COLLECTION.length

  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const cardRefs = useRef([])
  const activeIndexRef = useRef(0)
  const triggerRef = useRef(null)
  const videoRefs = useRef({})

  // Touch swipe support
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // Pause and reset all playing videos
  const stopAllVideos = useCallback(() => {
    Object.values(videoRefs.current).forEach((v) => {
      if (v) {
        v.pause()
        v.currentTime = 0
      }
    })
  }, [])

  const handleNext = useCallback(() => {
    setHoveredId(null)
    stopAllVideos()
    const next = Math.min(total - 1, activeIndexRef.current + 1)
    const trigger = triggerRef.current
    if (trigger) {
      const targetTop = trigger.start + (trigger.end - trigger.start) * (next / (total - 1))
      window.scrollTo({ top: targetTop, behavior: 'smooth' })
    } else {
      activeIndexRef.current = next
      setActiveIndex(next)
    }
  }, [total, stopAllVideos])

  const handlePrev = useCallback(() => {
    setHoveredId(null)
    stopAllVideos()
    const prev = Math.max(0, activeIndexRef.current - 1)
    const trigger = triggerRef.current
    if (trigger) {
      const targetTop = trigger.start + (trigger.end - trigger.start) * (prev / (total - 1))
      window.scrollTo({ top: targetTop, behavior: 'smooth' })
    } else {
      activeIndexRef.current = prev
      setActiveIndex(prev)
    }
  }, [total, stopAllVideos])

  // Video hover start
  const handleMouseEnter = useCallback((id) => {
    const itemIndex = ICE_CREAM_COLLECTION.findIndex((item) => item.id === id)
    if (itemIndex !== activeIndexRef.current) return
    setHoveredId(id)
    Object.entries(videoRefs.current).forEach(([k, v]) => {
      if (v) {
        if (k === id) {
          const playPromise = v.play()
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Gracefully handle browser autoplay blocks
            })
          }
        } else {
          v.pause()
          v.currentTime = 0
        }
      }
    })
  }, [])

  // Video hover leave: smoothly pause and rewind
  const handleMouseLeave = useCallback((id) => {
    setHoveredId((current) => (current === id ? null : current))
    const v = videoRefs.current[id]
    if (v) {
      v.pause()
      setTimeout(() => {
        if (v && v.paused) {
          v.currentTime = 0
        }
      }, 350)
    }
  }, [])

  // Card click / touch interaction
  const selectCard = (index) => {
    const item = ICE_CREAM_COLLECTION[index]
    if (index !== activeIndex) {
      const trigger = triggerRef.current
      if (trigger) {
        const progress = index / (total - 1)
        const targetTop = trigger.start + (trigger.end - trigger.start) * progress
        window.scrollTo({ top: targetTop, behavior: 'smooth' })
      } else {
        setActiveIndex(index)
        activeIndexRef.current = index
      }
    } else {
      // Tapping already active card toggles video preview
      if (hoveredId === item.id) {
        handleMouseLeave(item.id)
      } else {
        handleMouseEnter(item.id)
      }
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev])

  useEffect(() => {
    const section = sectionRef.current
    const cards = cardRefs.current.filter(Boolean)
    if (!section || cards.length !== total) return

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${(total - 1) * 620}`,
      pin: true,
      pinSpacing: true,
      scrub: 0.65,
      anticipatePin: 1,
      onUpdate: (self) => {
        const current = gsap.utils.clamp(0, total - 1, self.progress * (total - 1))
        const nearest = Math.round(current)

        if (nearest !== activeIndexRef.current) {
          activeIndexRef.current = nearest
          setHoveredId(null)
          stopAllVideos()
          setActiveIndex(nearest)
        }

        const viewportWidth = window.innerWidth
        const spacing = viewportWidth < 680
          ? Math.min(190, viewportWidth * 0.34)
          : viewportWidth < 900
            ? Math.min(220, viewportWidth * 0.26)
            : Math.min(270, viewportWidth * 0.21)
        const activeWidth = viewportWidth < 900
          ? Math.min(250, viewportWidth * 0.58)
          : Math.min(295, viewportWidth * 0.24)
        const activeHeight = Math.min(
          445,
          Math.max(375, window.innerHeight * 0.44)
        )

        cards.forEach((card, index) => {
          const distance = index - current
          const absDistance = Math.abs(distance)
          const scale = absDistance < 0.01
            ? 1
            : Math.max(0.68, 0.88 - absDistance * 0.10)
          const opacity = Math.max(0.45, 1 - absDistance * 0.16)
          const blur = Math.min(1.4, absDistance * 0.45)
          const isActive = index === nearest

          card.style.width = `${isActive ? activeWidth : Math.max(165, activeWidth * 0.72)}px`
          card.style.height = `${isActive ? activeHeight : activeHeight * 0.78}px`
          card.style.left = '50%'
          card.style.bottom = '0'
          card.style.zIndex = String(20 - Math.round(absDistance * 4))
          card.style.opacity = String(opacity)
          card.style.filter = absDistance > 0 ? `saturate(${Math.max(0.72, 1 - absDistance * 0.12)}) blur(${blur}px)` : 'none'
          card.style.transform =
            `translate3d(calc(-50% + ${distance * spacing}px), 0, 0) scale(${scale})`
          card.classList.toggle('is-active', isActive)
          card.setAttribute('aria-selected', isActive ? 'true' : 'false')
        })
      },
    })

    triggerRef.current = trigger
    trigger.update()
    ScrollTrigger.refresh()

    return () => {
      trigger.kill()
      triggerRef.current = null
    }
  }, [total, stopAllVideos])

  // Cleanup on unmount
  useEffect(() => {
    const currentVideos = videoRefs.current
    return () => {
      Object.values(currentVideos).forEach((v) => {
        if (v) {
          v.pause()
          v.src = ''
        }
      })
    }
  }, [])

  // Touch handlers
  const onTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX
  }

  const onTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX
    const delta = touchStartX.current - touchEndX.current
    if (Math.abs(delta) > 40) {
      if (delta > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
  }

  return (
    <section ref={sectionRef} id="collection" className="icecream-section" aria-label="Ice Cream Collection">
      {/* ── Background Organic Silk Dessert Waves ──────────────────────── */}
      <div className="collection-bg-swirls" aria-hidden="true">
        <svg viewBox="0 0 1440 800" fill="none" preserveAspectRatio="none" className="bg-swirls-svg">
          <path
            d="M-100,180 C320,60 640,360 1080,120 C1320,0 1520,200 1620,260 L1620,900 L-100,900 Z"
            fill="rgba(247, 218, 199, 0.42)"
          />
          <path
            d="M-50,440 C380,260 760,580 1180,310 C1380,180 1520,380 1620,430 L1620,900 L-50,900 Z"
            fill="rgba(238, 202, 180, 0.32)"
          />
          <path
            d="M0,620 C480,470 920,740 1480,510 L1480,900 L0,900 Z"
            fill="rgba(224, 184, 160, 0.22)"
          />
        </svg>
      </div>

      {/* ── Top-Right Strawberry Scoop with Chocolate Swirl Splash ─────── */}
      <div className="collection-top-splash" aria-hidden="true">
        <img
          src="/icecream/top_right_splash_feathered.png"
          alt=""
          className="splash-img"
        />
        {/* Floating chocolate cubes */}
        <span className="floating-choco-cube cube-1" />
        <span className="floating-choco-cube cube-2" />
        <span className="floating-choco-cube cube-3" />
      </div>

      {/* ── Section Header (1:1 Reference Typography) ─────────────────── */}
      <div className="collection-header">
        <h2 className="collection-main-title">
          A WORLD OF<br />
          ICE CREAM
        </h2>
      </div>

      {/* ── Overlapping Horizontal 5-Card Stage ────────────────────────── */}
      <div
        className="collection-stage-container"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="region"
        aria-roledescription="carousel"
        aria-label="Ice Cream Flavor Collection"
      >
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="stage-arrow-btn prev-btn"
          aria-label="Previous flavor"
        >
          ‹
        </button>

        <div ref={stageRef} className={`collection-stage ${hoveredId ? 'has-hovered' : ''}`}>
          {ICE_CREAM_COLLECTION.map((item, index) => {
            const isActive = index === activeIndex
            const isHovered = hoveredId === item.id

            return (
              <article
                key={item.id}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`dessert-card ${isActive ? 'is-active' : ''} ${isHovered ? 'is-hovered' : ''}`}
                style={{ background: item.bg, color: item.textColor }}
                onClick={() => selectCard(index)}
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={() => handleMouseLeave(item.id)}
                aria-label={`${item.name} ice cream card`}
                aria-selected={isActive}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    selectCard(index)
                  }
                }}
              >
                {/* Static Product Image (Base Layer) */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="card-bg-cover-img"
                  loading="lazy"
                />

                {/* Hover Product Video (Plays on hover with crossfade) */}
                <video
                  ref={(el) => (videoRefs.current[item.id] = el)}
                  src={item.video}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="card-hover-video"
                  aria-hidden="true"
                />

                {/* Subtle gradient scrim for text legibility */}
                <div className="card-gradient-overlay" />

                {/* Active Card Best Seller Badge */}
                {isActive && (
                  <span className="card-badge-bestseller">
                    ⭐ BEST SELLER
                  </span>
                )}

                {/* Card Title & Description */}
                <div className="card-text-block">
                  <h3 className="card-title">
                    {item.name}
                  </h3>
                  <p className="card-desc">
                    {item.desc}
                  </p>

                  {/* Active Card Explore Button */}
                  {isActive && (
                    <button type="button" className="card-explore-btn">
                      Explore <span>→</span>
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          className="stage-arrow-btn next-btn"
          aria-label="Next flavor"
        >
          ›
        </button>
      </div>

      {/* ── Indicator Dots ────────────────────────────────────────────── */}
      <div className="collection-dots" role="tablist" aria-label="Flavor indicators">
        {ICE_CREAM_COLLECTION.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={idx === activeIndex}
            aria-label={`Go to ${item.name}`}
            className={`collection-dot ${idx === activeIndex ? 'is-active' : ''}`}
            onClick={() => selectCard(idx)}
          />
        ))}
      </div>
    </section>
  )
}
