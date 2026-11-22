import { useState } from 'react'
import './ContactSection.css'

export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Elegant client-side demonstration feedback
    setSubmitted(true)
  }

  return (
    <section id="contacts" className="contact-section" aria-label="Contact Falooda World">
      <div className="contact-container">
        {/* ── A. Contact Introduction ──────────────────────────────────── */}
        <div className="contact-header">
          <span className="contact-eyebrow">Let's Connect</span>
          <h2 className="contact-main-title">Good Things Start with a Hello.</h2>
          <p className="contact-subtitle">
            Have a question, a craving, or something sweet to share? We’d love to hear from you.
          </p>
        </div>

        {/* ── Split Grid: Info Concierge + Contact Form ────────────────── */}
        <div className="contact-split-grid">
          {/* Left Column: Direct Inquiries */}
          <div className="contact-info-card">
            <h3 className="contact-info-title">Bespoke Inquiries</h3>
            <p className="contact-info-desc">
              Whether you are planning a grand private reception, seeking artisan dessert catering, 
              or wishing to reserve a private tasting flight, our concierge team is at your service.
            </p>

            <div className="contact-methods">
              <div className="contact-method-item">
                <div className="contact-method-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="contact-method-details">
                  <strong>Email Concierge</strong>
                  <a href="mailto:concierge@faloodaworld.com">concierge@faloodaworld.com</a>
                </div>
              </div>

              <div className="contact-method-item">
                <div className="contact-method-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="contact-method-details">
                  <strong>Direct Line</strong>
                  <a href="tel:+18003256632">+1 (800) FALOODA</a>
                </div>
              </div>
            </div>

            <div className="contact-timing-pill">
              🕒 <strong>Atelier Service Hours:</strong> Open Daily 12:00 — 23:00
            </div>
          </div>

          {/* Right Column: Premium Contact Form */}
          <div className="contact-form-wrap">
            {submitted ? (
              <div className="form-status-alert is-success">
                <h4>Thank You for Connecting!</h4>
                <p>Your message has been received. Our concierge will be in touch with you shortly.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group-row">
                  <div className="form-field">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      className="form-input"
                      placeholder="Lady / Lord Sterling"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-input"
                      placeholder="guest@domain.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-field">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="form-input"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="subject">Subject</label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      className="form-input"
                      placeholder="Private Tasting / Feedback"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-textarea"
                    placeholder="Tell us about your craving or event..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="form-submit-btn">
                  <span>Send Message</span>
                  <span>→</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── B. Location and Visit Experience ─────────────────────────── */}
        <div className="contact-visit-banner">
          <div className="contact-visit-content">
            <span className="contact-eyebrow">The Atelier</span>
            <h3 className="contact-visit-title">Come Find Your Happy Place.</h3>
            <p className="contact-visit-desc">
              Immerse yourself in our sensorial flagship boutique—designed with warm marble tables, 
              flowing caramel-hued acoustics, and the intoxicating fragrance of fresh Damascena rose nectar.
            </p>
            <div className="contact-visit-details">
              <div className="contact-visit-box">
                <strong>Flagship Boutique</strong>
                <span>Falooda World Pavilion<br />Grand Boulevard & 5th Avenue</span>
              </div>
              <div className="contact-visit-box">
                <strong>Tasting Appointments</strong>
                <span>Walk-ins welcome<br />Private VIP rooms upon request</span>
              </div>
            </div>
          </div>

          <div className="contact-visit-visual">
            <img
              src="/icecream/vanilla.webp"
              alt="Falooda World Boutique Dessert Destination"
              className="contact-visit-img"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* ── C. Final Full-Width Chocolate CTA ──────────────────────────── */}
      <div className="contact-final-cta">
        <div className="contact-cta-content">
          <span className="contact-cta-eyebrow">An Invitation to Bliss</span>
          <h2 className="contact-cta-title">Life Is Sweeter with One More Scoop.</h2>
          <p className="contact-cta-subtitle">
            Your next favourite dessert is waiting to be experienced.
          </p>
          <a href="#menu" className="contact-cta-btn">
            <span>Explore Our Menu</span>
            <span>→</span>
          </a>
        </div>
      </div>

      {/* ── 5. PREMIUM DARK CHOCOLATE FOOTER ──────────────────────────── */}
      <footer className="luxury-footer" role="contentinfo">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="/logo/logo.png" alt="Falooda World Logo" className="footer-logo-img" />
            <p className="footer-tagline">Scoop. Smile. Repeat.</p>
            <p className="footer-desc">
              Pioneers in royal botanical falooda, artisanal kulfi gelato, and luxury frozen confectionery.
            </p>
          </div>

          <div className="footer-col">
            <h5>Navigation</h5>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#story">About Us</a></li>
              <li><a href="#collection">Collection</a></li>
              <li><a href="#menu">Menu</a></li>
              <li><a href="#contacts">Contacts</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Creations</h5>
            <ul className="footer-links">
              <li><a href="#collection">Classic Vanilla</a></li>
              <li><a href="#collection">Belgian Chocolate</a></li>
              <li><a href="#collection">Strawberry Bliss</a></li>
              <li><a href="#collection">Mango Delight</a></li>
              <li><a href="#collection">Pistachio Dream</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Concierge</h5>
            <div className="footer-contact-info">
              <span>+1 (800) FALOODA</span>
              <span>concierge@faloodaworld.com</span>
              <span>Open Daily: 12:00 – 23:00</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Falooda World. Crafted for Connoisseurs.</span>
          <span>All Rights Reserved.</span>
        </div>
      </footer>
    </section>
  )
}
