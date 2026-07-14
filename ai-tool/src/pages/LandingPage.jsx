import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Shield, Users, Database, TrendingUp, CheckCircle2, Play, Star, ArrowUpRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';


const LandingPage = () => {

  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Sparkles className="feature-icon" />,
      title: 'Smart Auto-Annotation',
      desc: 'AI automatically annotates data with high precision, reducing manual work by up to 80%',
      stat: '80%'
    },
    {
      icon: <CheckCircle2 className="feature-icon" />,
      title: 'Quality Assurance',
      desc: 'Built-in validation and quality checks ensure consistent, accurate annotations every time.',
      stat: '99.9%'
    },
    {
      icon: <Users className="feature-icon" />,
      title: 'Collaborative Workflow',
      desc: 'Team-friendly interface with real-time collaboration and review capabilities.',
      stat: '5x'
    },
    {
      icon: <Database className="feature-icon" />,
      title: 'Multi-Format Support',
      desc: 'Works with images, text, audio, and video across various industry standards.',
      stat: '10+'
    },
    {
      icon: <Shield className="feature-icon" />,
      title: 'Scalable Processing',
      desc: 'Handle projects of any size with cloud-based infrastructure that grows with you.',
      stat: '∞'
    },
    {
      icon: <TrendingUp className="feature-icon" />,
      title: 'Advanced Analytics',
      desc: 'Deep insights into annotation quality, team productivity, and project progress.',
      stat: '24/7'
    },
  ];

  return (
    <div className="landing-page">
      
      {/* Floating Navigation */}
      <nav className="floating-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">
              <span className="logo-text">A</span>
            </div>
            <span className="brand-name">AnnotateAI</span>
          </div>

          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <Link to="/about" className="nav-link">About</Link>
          </div>

          <button className="nav-cta-btn" onClick={() => navigate('/Login')}>
            <span>Get Started</span>
            <ArrowRight className="nav-icon" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        {/* Background Grid */}
        <div className="hero-bg-grid"></div>

        {/* Large Geometric Shapes */}
        <div className="hero-shape-1"></div>
        <div className="hero-shape-2"></div>

        <div className="hero-container">
          {/* Left Content */}
          <div className={`hero-content ${isLoaded ? 'loaded' : ''}`}>
            <div className="hero-badge">
              <Star className="badge-icon" />
              <span>Powered by Advanced AI</span>
            </div>

            <h1 className="hero-title">
              DATA
              <br />
              <span className="text-outline">ANNOTATION</span>
              <br />
              <span className="hero-subtitle">reimagined</span>
            </h1>

            <p className="hero-description">
              Transform your workflow with AI-powered precision.
              Achieve 95% accuracy while reducing manual effort by 80%.
            </p>

            <div className="hero-buttons">
              <button className="hero-btn-primary">
                <span>Start Free Trial</span>
                <ArrowRight className="btn-icon" />
              </button>
              <button className="hero-btn-secondary">
                <Play className="btn-icon" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">Accuracy</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">80%</div>
                <div className="stat-label">Time Saved</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Users</div>
              </div>
            </div>
          </div>

          {/* Right Visual Element */}
          <div className={`hero-visual ${isLoaded ? 'loaded' : ''}`}>
            <div className="visual-container">
              {/* Main Card */}
              <div className="main-card">
                <div className="card-header">
                  <div className="card-status">AI Processing</div>
                  <div className="status-indicator"></div>
                </div>
                <div className="progress-bars">
                  <div className="progress-bar">
                    <div className="progress-fill progress-1"></div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill progress-2"></div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill progress-3"></div>
                  </div>
                </div>
                <div className="card-number">2,847 annotations</div>
                <div className="card-subtitle">processed in real-time</div>
              </div>

              {/* Floating Elements */}
              <div className="floating-element floating-1">
                <CheckCircle2 className="floating-icon" />
              </div>
              <div className="floating-element floating-2">
                <TrendingUp className="floating-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">
              POWERFUL
              <br />
              <span className="text-outline">FEATURES</span>
            </h2>
            <p className="features-description">
              Everything you need for professional-grade annotation workflows
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="feature-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Stat Badge */}
                <div className="feature-badge">
                  {feature.stat}
                </div>

                <div className="feature-icon-container">
                  {feature.icon}
                </div>

                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>

                <div className="feature-link">
                  <span>Learn more</span>
                  <ArrowUpRight className="link-icon" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        {/* Background Pattern */}
        <div className="cta-bg-pattern"></div>

        <div className="cta-container">
          <h2 className="cta-title">
            READY TO
            <br />
            <span className="text-outline-white">TRANSFORM</span>
            <br />
            YOUR WORKFLOW?
          </h2>

          <p className="cta-description">
            Join 10,000+ professionals who have revolutionized their data annotation process
          </p>

          <div className="cta-buttons">
            <button className="cta-btn-primary">
              <span>Start Free Trial</span>
              <ArrowRight className="cta-icon" />
            </button>
            <button className="cta-btn-secondary">
              Schedule Demo
            </button>
          </div>

          <div className="cta-fine-print">
            No credit card required · 14-day free trial · Cancel anytime
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <span className="footer-logo-text">A</span>
                </div>
                <span className="footer-brand-name">AnnotateAI</span>
              </div>
              <p className="footer-description">
                Revolutionizing data annotation with cutting-edge AI technology.
              </p>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Product</h4>
              <ul className="footer-links">
                <li><a href="#features" className="footer-link">Features</a></li>
                <li><a href="#pricing" className="footer-link">Pricing</a></li>
                <li><a href="#" className="footer-link">Integrations</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Company</h4>
              <ul className="footer-links">
                <li><Link to="/about" className="footer-link">About</Link></li>
                <li><a href="#" className="footer-link">Careers</a></li>
                <li><a href="#" className="footer-link">Contact</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Legal</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Privacy</a></li>
                <li><a href="#" className="footer-link">Terms</a></li>
                <li><a href="#" className="footer-link">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">© 2025 AnnotateAI. All rights reserved.</p>
            <div className="footer-social">
              <span className="social-label">Follow us:</span>
              <div className="social-icons">
                <div className="social-icon">T</div>
                <div className="social-icon">L</div>
                <div className="social-icon">G</div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* Base Styles */
        .landing-page {
          background: white;
          color: black;
          position: relative;
          overflow-x: hidden;
        }

        /* Text Outline Utilities */
        .text-outline {
          -webkit-text-stroke: 2px black;
          -webkit-text-fill-color: transparent;
        }

        .text-outline-white {
          -webkit-text-stroke: 2px white;
          -webkit-text-fill-color: transparent;
        }

        /* Navigation Styles */
        .floating-nav {
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          padding: 16px 32px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .nav-container {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: black;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          color: white;
          font-size: 14px;
          font-weight: bold;
        }

        .brand-name {
          font-weight: bold;
          font-size: 18px;
        }

        .nav-links {
          display: none;
          align-items: center;
          gap: 24px;
          font-size: 14px;
        }

        @media (min-width: 768px) {
          .nav-links {
            display: flex;
          }
        }

        .nav-link {
          color: inherit;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #666;
        }

        .nav-cta-btn {
          background: black;
          color: white;
          border: none;
          padding: 8px 24px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-cta-btn:hover {
          background: #333;
        }

        .nav-icon {
          width: 16px;
          height: 16px;
        }

        /* Hero Section Styles */
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 96px 0 48px;
        }

        .hero-bg-grid {
          position: absolute;
          inset: 0;
          opacity: 0.05;
          background-image: radial-gradient(circle at 1px 1px, black 1px, transparent 0);
          background-size: 50px 50px;
        }

        .hero-shape-1 {
          position: absolute;
          top: 80px;
          right: 40px;
          width: 384px;
          height: 384px;
          border: 2px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          transform: rotate(12deg);
          display: none;
        }

        .hero-shape-2 {
          position: absolute;
          bottom: 80px;
          left: 40px;
          width: 256px;
          height: 256px;
          background: rgba(0, 0, 0, 0.05);
          transform: rotate(-12deg);
          display: none;
        }

        @media (min-width: 1024px) {
          .hero-shape-1,
          .hero-shape-2 {
            display: block;
          }
        }

        .hero-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          gap: 48px;
          align-items: center;
          position: relative;
          z-index: 10;
        }

        @media (min-width: 1024px) {
          .hero-container {
            grid-template-columns: 1fr 1fr;
          }
        }

        .hero-content {
          transition: all 1s ease;
          transition-delay: 300ms;
          opacity: 0;
          transform: translateX(-40px);
        }

        .hero-content.loaded {
          opacity: 1;
          transform: translateX(0);
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: black;
          color: white;
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 14px;
          margin-bottom: 32px;
        }

        .badge-icon {
          width: 16px;
          height: 16px;
          fill: currentColor;
        }

        .hero-title {
          font-size: 96px;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 24px;
        }

        @media (min-width: 1024px) {
          .hero-title {
            font-size: 128px;
          }
        }

        .hero-subtitle {
          font-size: 64px;
          font-weight: 300;
        }

        @media (min-width: 1024px) {
          .hero-subtitle {
            font-size: 80px;
          }
        }

        .hero-description {
          font-size: 20px;
          color: #666;
          margin-bottom: 40px;
          max-width: 500px;
          line-height: 1.6;
        }

        .hero-buttons {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 48px;
        }

        @media (min-width: 640px) {
          .hero-buttons {
            flex-direction: row;
          }
        }

        .hero-btn-primary {
          background: black;
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 16px;
        }

        .hero-btn-primary:hover {
          background: #333;
        }

        .hero-btn-primary .btn-icon {
          transition: transform 0.3s ease;
        }

        .hero-btn-primary:hover .btn-icon {
          transform: translateX(4px);
        }

        .hero-btn-secondary {
          border: 2px solid black;
          color: black;
          background: transparent;
          padding: 16px 32px;
          border-radius: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 16px;
        }

        .hero-btn-secondary:hover {
          background: black;
          color: white;
        }

        .btn-icon {
          width: 20px;
          height: 20px;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .stat-item {
          text-align: left;
        }

        .stat-number {
          font-size: 32px;
          font-weight: 900;
        }

        .stat-label {
          font-size: 14px;
          color: #666;
        }

        .hero-visual {
          position: relative;
          transition: all 1s ease;
          transition-delay: 500ms;
          opacity: 0;
          transform: translateX(40px);
        }

        .hero-visual.loaded {
          opacity: 1;
          transform: translateX(0);
        }

        .visual-container {
          position: relative;
        }

        .main-card {
          background: black;
          color: white;
          padding: 32px;
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          transform: rotate(3deg);
          transition: transform 0.5s ease;
        }

        .main-card:hover {
          transform: rotate(0deg);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .card-status {
          font-size: 14px;
          opacity: 0.6;
        }

        .status-indicator {
          width: 12px;
          height: 12px;
          background: #4ade80;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .progress-bars {
          margin-bottom: 24px;
        }

        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .progress-fill {
          height: 100%;
          background: white;
          border-radius: 9999px;
          animation: pulse 2s infinite;
        }

        .progress-1 {
          width: 80%;
        }

        .progress-2 {
          width: 60%;
          animation-delay: 0.5s;
        }

        .progress-3 {
          width: 83.33%;
          animation-delay: 1s;
        }

        .card-number {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .card-subtitle {
          font-size: 14px;
          opacity: 0.6;
        }

        .floating-element {
          position: absolute;
          background: white;
          border: 2px solid black;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .floating-1 {
          top: -16px;
          right: -16px;
        }

        .floating-2 {
          bottom: -16px;
          left: -16px;
        }

        .floating-icon {
          width: 32px;
          height: 32px;
        }

        /* Features Section Styles */
        .features-section {
          padding: 96px 0;
          background: #f9fafb;
          position: relative;
        }

        .features-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .features-header {
          text-align: center;
          margin-bottom: 80px;
        }

        .features-title {
          font-size: 80px;
          font-weight: 900;
          margin-bottom: 24px;
        }

        .features-description {
          font-size: 20px;
          color: #666;
          max-width: 512px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          gap: 32px;
        }

        @media (min-width: 768px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .feature-card {
          position: relative;
          background: white;
          border: 2px solid rgba(0, 0, 0, 0.1);
          border-radius: 24px;
          padding: 32px;
          transition: all 0.5s ease;
          transform: translateY(0);
        }

        .feature-card:hover {
          border-color: black;
          transform: translateY(-8px);
        }

        .feature-badge {
          position: absolute;
          top: -12px;
          right: -12px;
          background: black;
          color: white;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
        }

        .feature-icon-container {
          width: 56px;
          height: 56px;
          background: #f3f4f6;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          transition: all 0.3s ease;
        }

        .feature-card:hover .feature-icon-container {
          background: black;
          color: white;
        }

        .feature-icon {
          width: 28px;
          height: 28px;
        }

        .feature-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 16px;
        }

        .feature-desc {
          color: #666;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .feature-link {
          display: flex;
          align-items: center;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .feature-card:hover .feature-link {
          color: black;
        }

        .link-icon {
          width: 16px;
          height: 16px;
          margin-left: 8px;
          transition: transform 0.3s ease;
        }

        .feature-card:hover .link-icon {
          transform: translate(4px, -4px);
        }

        /* CTA Section Styles */
        .cta-section {
          padding: 96px 0;
          background: black;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .cta-bg-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.1;
          background-image: linear-gradient(45deg, transparent 45%, white 45%, white 55%, transparent 55%);
          background-size: 30px 30px;
        }

        .cta-container {
          max-width: 1024px;
          margin: 0 auto;
          padding: 0 24px;
          text-align: center;
          position: relative;
          z-index: 10;
        }

        .cta-title {
          font-size: 96px;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 32px;
        }

        .cta-description {
          font-size: 20px;
          color: #ccc;
          margin-bottom: 48px;
          max-width: 512px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          flex-direction: column;
          gap: 24px;
          justify-content: center;
          margin-bottom: 32px;
        }

        @media (min-width: 640px) {
          .cta-buttons {
            flex-direction: row;
          }
        }

        .cta-btn-primary {
          background: white;
          color: black;
          border: none;
          padding: 20px 40px;
          border-radius: 16px;
          font-weight: bold;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .cta-btn-primary:hover {
          background: #f3f4f6;
          transform: scale(1.05);
        }

        .cta-btn-secondary {
          border: 2px solid white;
          color: white;
          background: transparent;
          padding: 20px 40px;
          border-radius: 16px;
          font-weight: bold;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cta-btn-secondary:hover {
          background: white;
          color: black;
        }

        .cta-icon {
          width: 24px;
          height: 24px;
        }

        .cta-fine-print {
          font-size: 14px;
          color: #666;
        }

        /* Footer Styles */
        .footer {
          background: white;
          padding: 64px 0;
          border-top: 2px solid black;
        }

        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .footer-grid {
          display: grid;
          gap: 48px;
          margin-bottom: 48px;
        }

        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr 1fr;
          }
        }

        .footer-brand {
          grid-column: span 2;
        }

        @media (min-width: 768px) {
          .footer-brand {
            grid-column: span 1;
          }
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .footer-logo-icon {
          width: 48px;
          height: 48px;
          background: black;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .footer-logo-text {
          color: white;
          font-weight: bold;
          font-size: 18px;
        }

        .footer-brand-name {
          font-size: 24px;
          font-weight: 900;
        }

        .footer-description {
          color: #666;
          font-size: 18px;
          line-height: 1.6;
          max-width: 400px;
        }

        .footer-column-title {
          font-weight: bold;
          font-size: 18px;
          margin-bottom: 24px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 16px;
        }

        .footer-link {
          color: #666;
          text-decoration: none;
          font-size: 18px;
          transition: color 0.3s ease;
        }

        .footer-link:hover {
          color: black;
        }

        .footer-bottom {
          border-top: 2px solid #f3f4f6;
          padding-top: 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
        }

        @media (min-width: 768px) {
          .footer-bottom {
            flex-direction: row;
          }
        }

        .footer-copyright {
          color: #666;
          font-size: 18px;
        }

        .footer-social {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-top: 16px;
        }

        @media (min-width: 768px) {
          .footer-social {
            margin-top: 0;
          }
        }

        .social-label {
          color: #999;
        }

        .social-icons {
          display: flex;
          gap: 16px;
        }

        .social-icon {
          width: 40px;
          height: 40px;
          background: black;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .social-icon:hover {
          background: #333;
        }

        /* Responsive Typography */
        @media (max-width: 1023px) {
          .hero-title {
            font-size: 72px;
          }
          
          .hero-subtitle {
            font-size: 48px;
          }
          
          .features-title {
            font-size: 60px;
          }
          
          .cta-title {
            font-size: 72px;
          }
        }

        @media (max-width: 767px) {
          .hero-title {
            font-size: 56px;
          }
          
          .hero-subtitle {
            font-size: 36px;
          }
          
          .features-title {
            font-size: 48px;
          }
          
          .cta-title {
            font-size: 56px;
          }
          
          .hero-buttons {
            gap: 12px;
          }
          
          .cta-buttons {
            gap: 16px;
          }
        }

        /* Animation Keyframes */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Additional Hover Effects */
        .hero-btn-primary:hover,
        .hero-btn-secondary:hover,
        .nav-cta-btn:hover,
        .cta-btn-primary:hover,
        .cta-btn-secondary:hover {
          box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        /* Smooth Scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Focus States for Accessibility */
        button:focus,
        a:focus {
          outline: 2px solid #4f46e5;
          outline-offset: 2px;
        }

        /* Print Styles */
        @media print {
          .floating-nav,
          .hero-bg-grid,
          .hero-shape-1,
          .hero-shape-2,
          .cta-bg-pattern {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;