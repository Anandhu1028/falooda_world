import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './WhiteoutSection.css'

gsap.registerPlugin(ScrollTrigger)

export default function WhiteoutSection() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(titleRef.current, { autoAlpha: 1 })
        return
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: true,
        scrub: 0.8,
        anticipatePin: 1,
        onUpdate: (self) => {
          const reveal = gsap.utils.clamp(
            0,
            1,
            gsap.utils.mapRange(0.1, 0.5, 0, 1, self.progress)
          )
          let overshoot = 0

          if (reveal > 0.82) {
            overshoot = Math.sin((reveal - 0.82) * Math.PI * 3.2) *
              (1 - reveal) * 0.018
          }

          const y = (1 - reveal) * window.innerHeight * 0.18
          const scale = 0.94 + reveal * 0.06 + overshoot
          const stableReveal = reveal >= 1 ? 1 : reveal
          const exit = gsap.utils.clamp(
            0,
            1,
            gsap.utils.mapRange(0.8, 1, 0, 1, self.progress)
          )

          titleRef.current.style.opacity = String(Math.max(0, stableReveal * (1 - exit)))
          titleRef.current.style.transform =
            `translate3d(0, ${y + overshoot * window.innerHeight}px, 0) scale(${scale})`
          titleRef.current.style.filter = `blur(${exit * 8}px)`
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="whiteout-section"
      aria-label="Ice cream"
    >
      <h2 ref={titleRef} className="ice-cream-center-title">
        ICE CREAM
      </h2>
    </section>
  )
}
