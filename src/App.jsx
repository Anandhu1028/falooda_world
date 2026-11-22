import Navbar from './components/Navbar'
import HeroScroll from './components/HeroScroll'
import WhiteoutSection from './components/WhiteoutSection'
import AboutSection from './components/AboutSection'
import MenuSection from './components/MenuSection'
import ContactSection from './components/ContactSection'
import './App.css'

export default function App() {
  return (
    <main
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#120d09',
        color: '#f5ebe0',
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── Fixed Luxury Brand Capsule Navbar ──────────────────────────── */}
      <Navbar />

      {/* ── Ultra-Premium Cinematic Scroll Animation Hero ──────────────── */}
      <HeroScroll />

      {/* ── Whiteout title after the complete hero frame sequence ──────── */}
      <WhiteoutSection />

      {/* ── Section 1: About Us / Brand Storytelling (#story) ──────────── */}
      <AboutSection />

      {/* ── Section 2: Menu / Interactive Dessert Experience (#menu) ───── */}
      <MenuSection />

      {/* ── Section 3: Contact Us, Boutique Experience & Footer (#contacts) ── */}
      <ContactSection />
    </main>
  )
}
