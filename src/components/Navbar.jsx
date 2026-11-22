import { useState, useEffect } from 'react'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Toggle compact glass styling once user scrolls past 60px
      if (window.scrollY > 60) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      // Active section spy
      const sections = ['contacts', 'menu', 'story', 'home']
      const scrollPosition = window.scrollY + 220

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'About', href: '#story', id: 'story' },
    { name: 'Menu', href: '#menu', id: 'menu' },
    { name: 'Contacts', href: '#contacts', id: 'contacts' },
  ]

  const handleNavClick = (e, href, id) => {
    e.preventDefault()
    setMobileOpen(false)
    setActiveSection(id)

    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className={`luxury-navbar-wrapper ${scrolled ? 'is-scrolled' : 'is-initial'}`}>
      <div className="luxury-navbar-pill">
        {/* ── Left Side: Brand Logo ────────────────────────────────────── */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home', 'home')}
          className="luxury-logo-link"
          aria-label="Falooda World Home"
        >
          <img
            src="/logo/logo.png"
            alt="Falooda World Logo"
            className="luxury-logo-img"
          />
        </a>

        {/* ── Center: Desktop Navigation Links ─────────────────────────── */}
        <nav className="luxury-desktop-nav" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.id)}
                className={`luxury-nav-link ${isActive ? 'is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span>{link.name}</span>
                {/* Golden Underline */}
                <span className="nav-underline" />
              </a>
            )
          })}
        </nav>

        {/* ── Right Side: Log In & Sign Up (Matches Screenshot) ──────────── */}
        <div className="luxury-auth-actions">
          <button type="button" className="luxury-login-btn">
            Log In
          </button>
          <span className="luxury-auth-divider" style={{ opacity: 0.35, color: '#fbf5eb' }}>|</span>
          <button type="button" className="luxury-signup-btn">
            Sign Up
          </button>
        </div>

        {/* ── Mobile Animated Hamburger Toggle ─────────────────────────── */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`luxury-hamburger-btn ${mobileOpen ? 'is-open' : ''}`}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
        >
          <span className="luxury-hamburger-icon">
            <span className="luxury-hamburger-line line-1" />
            <span className="luxury-hamburger-line line-2" />
            <span className="luxury-hamburger-line line-3" />
          </span>
        </button>

        {/* ── Mobile Dropdown Menu (Under Pill) ─────────────────────────── */}
        {mobileOpen && (
          <div className="luxury-mobile-menu">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.id)}
                  className={`luxury-mobile-link ${isActive ? 'is-active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{link.name}</span>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </header>
  )
}
