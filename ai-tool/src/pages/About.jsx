import React from 'react';

const About = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#000' }}>
      <header style={{
        borderBottom: '2px solid #000',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>A</div>
          <span style={{ fontWeight: 700 }}>AnnotateAI</span>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 16 }}>About Us</h1>
        <p style={{ fontSize: 18, color: '#444', lineHeight: 1.7 }}>
          AnnotateAI helps teams build high-quality datasets with AI-augmented annotation tools.
          We focus on speed, quality, and collaboration so your team can deliver production-ready
          training data faster.
        </p>

        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Our Mission</h2>
          <p style={{ fontSize: 16, color: '#555', lineHeight: 1.7 }}>
            Empower organizations to accelerate AI development with reliable, scalable, and
            user-friendly data annotation workflows.
          </p>
        </section>

        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>What We Do</h2>
          <ul style={{ paddingLeft: 18, color: '#555', lineHeight: 1.8 }}>
            <li>AI-powered auto-annotation to reduce manual effort</li>
            <li>Built-in validation and quality checks</li>
            <li>Team collaboration with roles and review workflows</li>
            <li>Support for multiple data types and export formats</li>
          </ul>
        </section>

        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Makers</h2>
          <ul style={{ paddingLeft: 18, color: '#555', lineHeight: 1.8 }}>
            <li>Mayuresh Kadav</li>
            <li>Rishabh Singh</li>
            <li>Hulgesh Pawar</li>
            <li>Aniruddha Gavade</li>
            <li>Sanskrutee Mhatre</li>
          </ul>
        </section>
      </main>

      <footer style={{ borderTop: '2px solid #f3f4f6', padding: '24px', textAlign: 'center', color: '#666' }}>
        © {new Date().getFullYear()} AnnotateAI. All rights reserved.
      </footer>
    </div>
  );
};

export default About;
