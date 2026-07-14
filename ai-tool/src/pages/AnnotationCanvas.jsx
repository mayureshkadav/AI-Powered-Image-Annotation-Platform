import React from 'react';
import './AnnotationCanvas.css';
const TOOL = {
  BOX: "box",
  POLYGON: "polygon",
};


export default function AnnotationCanvas() {
  return (
    <div className="annotation-wrapper">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="project-info">
          <span className="project-name">XYZ_annotate_24_7_25</span>
          <span className="image-count">100/240</span>
          <span className="image-name">Mayuresh_30-06-2025_Created_UBI_14.jpg</span>
        </div>
        <div className="export-btn">⤓</div>
      </div>

      {/* Left Sidebar */}
      <div className="sidebar-left">
        <div className="section">
          <h4>Annotation</h4>
          <ul>
            <li><span className="color-dot green"></span>person</li>
            <li><span className="color-dot red"></span>Table</li>
            <li><span className="color-dot yellow"></span>mobile</li>
            <li><span className="color-dot purple"></span>bag</li>
          </ul>
        </div>
        <div className="section">Comments</div>
        <div className="section">File format</div>
        <div className="section">Validate</div>
      </div>

      {/* Main Canvas Area */}
      <div className="canvas-container">
        <canvas width="900" height="500" id="annotationCanvas"></canvas>
      </div>

      {/* Right Sidebar (Tools) */}
      <div className="sidebar-right">
        <button className="tool-btn">✋</button>
        <button className="tool-btn">▭</button>
        <button className="tool-btn">🔺</button>
        <button className="tool-btn">🎯</button>
        <button className="tool-btn">👁</button>
        <button className="tool-btn">⟲</button>
        <button className="tool-btn">⟳</button>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <button>🗑</button>
        <button>🔍➕</button>
        <button>🔍➖</button>
        <button>🔎</button>
        <button>←</button>
        <button>→</button>
      </div>
    </div>
  );
}
