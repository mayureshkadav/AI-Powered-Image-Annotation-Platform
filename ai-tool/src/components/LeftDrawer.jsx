import React, { useState } from 'react';
import './scrollbar.css';
import { 
  Pencil, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  Palette,
  Sun,
  Moon,
  Mic,
  Tag,
  CheckCircle,
  Layers,
  Move,
  RotateCcw,
  Crop,
  Zap
} from 'lucide-react';
import MagicModal from './MagicModal';

const CollapseButton = ({ isCollapsed, onClick, direction, isDarkMode }) => (
  <button 
    className="collapse-btn"
    onClick={onClick}
    style={{
      ...styles.collapseButton(isDarkMode),
      transform: `translateX(${direction === 'left' && isCollapsed ? '2px' : '0'})`
    }}
  >
    {direction === 'left' ? 
      (isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />) : 
      (isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />)
    }
  </button>
);

const ToolButton = ({ icon: Icon, label, isActive, onClick, isCollapsed, isDarkMode, disabled = false }) => (
  <button
    style={styles.modernToolButton(isCollapsed, isDarkMode, isActive, disabled)}
    onClick={onClick}
    disabled={disabled}
    title={label}
    className="tool-btn"
  >
    <Icon size={isCollapsed ? 18 : 20} />
    {!isCollapsed && <span style={styles.toolLabel}>{label}</span>}
  </button>
);

const SliderControl = ({ label, value, onChange, min = 0, max = 100, isDarkMode }) => (
  <div style={styles.sliderContainer}>
    <div style={styles.sliderHeader}>
      <span style={styles.sliderLabel(isDarkMode)}>{label}</span>
      <span style={styles.sliderValue(isDarkMode)}>{value}%</span>
    </div>
    <div style={styles.sliderTrack(isDarkMode)}>
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.modernSlider(isDarkMode)}
      />
    </div>
  </div>
);

const RadioOption = ({ id, label, checked, onChange, isDarkMode, icon: Icon }) => (
  <label style={styles.radioLabel(isDarkMode, checked)} htmlFor={id}>
    <input 
      type="radio" 
      id={id} 
      checked={checked} 
      onChange={onChange}
      style={styles.hiddenRadio}
    />
    <div style={styles.radioIndicator(isDarkMode, checked)}>
      {checked && <div style={styles.radioInner} />}
    </div>
    {Icon && <Icon size={16} style={{ opacity: checked ? 1 : 0.6 }} />}
    <span>{label}</span>
  </label>
);

const LeftDrawer = ({ 
  isLeftSidebarCollapsed = false, 
  setIsLeftSidebarCollapsed = () => {}, 
  leftSidebarWidth = 280, 
  isDrawingBox = false, 
  toggleDrawingMode = () => {}, 
  selectedClass = '', 
  setSelectedClass = () => {}, 
  classes = [], 
  isValidationDrawerOpen = false, 
  setIsValidationDrawerOpen = () => {}, 
  voiceAssist = false, 
  setVoiceAssist = () => {}, 
  labelAssist = false, 
  setLabelAssist = () => {}, 
  labelValidation = false, 
  setLabelValidation = () => {}, 
  handleSaveSettings = () => {}, 
  toggleTheme = () => {}, 
  isDarkMode = false,
  activeTool = null,
  onToolSelect = () => {},
  onMagicClassSelect = () => {}
}) => {
  const tools = [
    { 
      id: 'draw',
      icon: Pencil, 
      label: 'Draw', 
      active: isDrawingBox, 
      onClick: () => {
        toggleDrawingMode();
        onToolSelect('draw');
      } 
    },
    { 
      id: 'move',
      icon: Move, 
      label: 'Move', 
      active: activeTool === 'move', 
      onClick: () => onToolSelect('move') 
    },
    { 
      id: 'crop',
      icon: Crop, 
      label: 'Crop', 
      active: activeTool === 'crop', 
      onClick: () => onToolSelect('crop') 
    },
    { 
      id: 'rotate',
      icon: RotateCcw, 
      label: 'Rotate', 
      active: activeTool === 'rotate', 
      onClick: () => onToolSelect('rotate') 
    },
    { 
      id: 'layers',
      icon: Layers, 
      label: 'Layers', 
      active: activeTool === 'layers', 
      onClick: () => onToolSelect('layers') 
    },
    { 
      id: 'magic',
      icon: Zap, 
      label: 'Magic', 
      active: activeTool === 'magic', 
      onClick: () => onToolSelect('magic') 
    }
  ];

  return (
    <div style={styles.leftSidebar(isLeftSidebarCollapsed, leftSidebarWidth, isDarkMode)} className={isDarkMode ? 'dark' : ''}>
      {/* Header */}
      <div style={styles.sidebarHeader(isDarkMode)}>
        <div style={styles.headerContent}>
          {!isLeftSidebarCollapsed && (
            <div style={styles.headerTitle}>
              <Palette size={18} style={{ opacity: 0.8 }} />
              <span>Tools & Layers</span>
            </div>
          )}
        </div>
        <CollapseButton
          isCollapsed={isLeftSidebarCollapsed}
          onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
          direction="left"
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Content */}
      <div style={styles.sidebarContent(isLeftSidebarCollapsed)} className="modern-scrollbar">
        
        {/* Tools Grid */}
        <div style={styles.toolsSection}>
          {!isLeftSidebarCollapsed && (
            <div style={styles.sectionTitle(isDarkMode)}>Tools</div>
          )}
          <div style={styles.toolsGrid(isLeftSidebarCollapsed)}>
            {tools.map((tool, index) => (
              <ToolButton
                key={tool.id}
                icon={tool.icon}
                label={tool.label}
                isActive={tool.active}
                onClick={tool.onClick}
                isCollapsed={isLeftSidebarCollapsed}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>

        {/* Magic Modal (Centered Overlay) */}
        <MagicModal
          open={activeTool === 'magic'}
          isDarkMode={isDarkMode}
          onClose={() => onToolSelect(null)}
          classes={classes}
          onSelectClass={(name, modelName) => onMagicClassSelect(name, modelName)}
        />

        {/* Class Section */}
        {!isLeftSidebarCollapsed && (
          <div style={styles.classSection}>
            <div style={styles.sectionTitle(isDarkMode)}>Classes</div>
            <div style={styles.classList} className="modern-scrollbar">
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <div 
                    key={cls.name} 
                    style={styles.classItem(selectedClass === cls.name, isDarkMode)}
                    onClick={() => setSelectedClass(cls.name)}
                  >
                    <span style={{...styles.classColor, backgroundColor: cls.color}} />
                    <span style={styles.className}>{cls.name}</span>
                  </div>
                ))
              ) : (
                <p style={styles.noClassesText(isDarkMode)}>No classes found</p>
              )}
            </div>
          </div>
        )}

        {/* Validation Settings */}
        {!isLeftSidebarCollapsed && (
          <div style={styles.validationSection(isDarkMode)}>
            <div 
              style={styles.validationHeader(isDarkMode)}
              onClick={() => setIsValidationDrawerOpen(!isValidationDrawerOpen)}
            >
              <div style={styles.validationTitle}>
                <Settings size={16} />
                <span>Validation Settings</span>
              </div>
              <ChevronRight 
                size={16} 
                style={{
                  transform: `rotate(${isValidationDrawerOpen ? 90 : 0}deg)`,
                  transition: 'transform 0.2s ease'
                }}
              />
            </div>
            
            <div style={styles.validationContent(isValidationDrawerOpen)}>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel(isDarkMode, voiceAssist)}>
                  <input 
                    type="checkbox" 
                    checked={voiceAssist} 
                    onChange={() => setVoiceAssist(!voiceAssist)}
                    style={styles.hiddenRadio}
                  />
                  <div style={styles.radioIndicator(isDarkMode, voiceAssist)}>
                    {voiceAssist && <div style={styles.radioInner} />}
                  </div>
                  <Mic size={16} />
                  <span>Voice Assistant</span>
                </label>
                <label style={styles.radioLabel(isDarkMode, labelAssist)}>
                  <input 
                    type="checkbox" 
                    checked={labelAssist} 
                    onChange={() => setLabelAssist(!labelAssist)}
                    style={styles.hiddenRadio}
                  />
                  <div style={styles.radioIndicator(isDarkMode, labelAssist)}>
                    {labelAssist && <div style={styles.radioInner} />}
                  </div>
                  <Tag size={16} />
                  <span>Label Assistant</span>
                </label>
                <label style={styles.radioLabel(isDarkMode, labelValidation)}>
                  <input 
                    type="checkbox" 
                    checked={labelValidation} 
                    onChange={() => setLabelValidation(!labelValidation)}
                    style={styles.hiddenRadio}
                  />
                  <div style={styles.radioIndicator(isDarkMode, labelValidation)}>
                    {labelValidation && <div style={styles.radioInner} />}
                  </div>
                  <CheckCircle size={16} />
                  <span>Label Validation</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Theme Toggle */}
        {!isLeftSidebarCollapsed && (
          <div style={styles.themeSection}>
            <button style={styles.modernThemeButton(isDarkMode)} onClick={toggleTheme}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  leftSidebar: (isCollapsed, width, isDarkMode) => ({
    width: isCollapsed ? '60px' : `${width}px`,
    minWidth: isCollapsed ? '60px' : `${width}px`,
    height: '100vh',
    backgroundColor: isDarkMode ? '#161b22' : '#f6f8fa',
    borderRight: `1px solid ${isDarkMode ? '#30363d' : '#d0d7de'}`,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '2px 0 5px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    zIndex: 10
  }),

  sidebarHeader: (isDarkMode) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    minHeight: '60px',
    borderBottom: `1px solid ${isDarkMode ? '#30363d' : '#d0d7de'}`,
    color: isDarkMode ? '#c9d1d9' : '#24292f',
    flexShrink: 0,
    position: 'relative'
  }),

  headerContent: {
    display: 'flex',
    alignItems: 'center',
    flex: 1
  },

  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b'
  },

  collapseButton: (isDarkMode) => ({
    background: 'transparent',
    border: 'none',
    color: isDarkMode ? '#8b949e' : '#57606a',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    ':hover': {
      background: isDarkMode ? 'rgba(177, 186, 196, 0.12)' : 'rgba(208, 215, 222, 0.32)'
    }
  }),

  sidebarContent: (isCollapsed) => ({
    padding: isCollapsed ? '16px 8px' : '16px',
    overflowY: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    height: '100%'
  }),

  toolsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },

  sectionTitle: (isDarkMode) => ({
    fontSize: '11px',
    fontWeight: '600',
    color: isDarkMode ? '#8b949e' : '#57606a',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '0 4px'
  }),

  toolsGrid: (isCollapsed) => ({
    display: 'grid',
    gridTemplateColumns: isCollapsed ? '1fr' : 'repeat(2, 1fr)',
    gap: '8px'
  }),

  modernToolButton: (isCollapsed, isDarkMode, isActive, disabled) => ({
    width: '100%',
    height: isCollapsed ? '44px' : 'auto',
    padding: isCollapsed ? 0 : '12px',
    background: isActive 
      ? (isDarkMode ? 'rgba(56, 139, 253, 0.2)' : 'rgba(9, 105, 218, 0.1)')
      : 'transparent',
    border: `1px solid ${isActive ? (isDarkMode ? '#388bfd' : '#0969da') : 'transparent'}`,
    borderRadius: '8px',
    color: isActive 
      ? (isDarkMode ? '#58a6ff' : '#0969da')
      : (isDarkMode ? '#c9d1d9' : '#24292f'),
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    flexDirection: isCollapsed ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isCollapsed ? '4px' : '12px',
    transition: 'all 0.2s ease',
    fontSize: '13px',
    fontWeight: '500',
    opacity: disabled ? 0.5 : 1,
    ':hover': {
      background: isActive 
        ? (isDarkMode ? 'rgba(56, 139, 253, 0.25)' : 'rgba(9, 105, 218, 0.15)')
        : (isDarkMode ? 'rgba(177, 186, 196, 0.1)' : 'rgba(208, 215, 222, 0.2)')
    }
  }),
 
  magicOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  magicModal(isDarkMode) {
    return {
      width: 'min(420px, 90vw)',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#e5e7eb' : '#111827',
      borderRadius: '12px',
      border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
      boxShadow: isDarkMode ? '0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.15)',
      overflow: 'hidden'
    };
  },
  magicModalHeader(isDarkMode) {
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      fontWeight: 600,
      borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
    };
  },
  magicModalBody(isDarkMode) {
    return {
      padding: '16px',
      fontSize: '14px',
      color: isDarkMode ? '#d1d5db' : '#374151',
    };
  },
  magicCloseBtn(isDarkMode) {
    return {
      border: 'none',
      background: 'transparent',
      color: isDarkMode ? '#9ca3af' : '#6b7280',
      cursor: 'pointer',
      fontSize: '18px',
      lineHeight: 1,
      padding: '4px',
      borderRadius: '6px'
    };
  },

  toolLabel: {
    whiteSpace: 'nowrap',
    fontSize: '13px',
    fontWeight: '500'
  },

  classSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },

  classList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    maxHeight: '200px',
    overflowY: 'auto',
    paddingRight: '4px',
  },

  classItem: (isSelected, isDarkMode) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    backgroundColor: isSelected 
      ? (isDarkMode ? 'rgba(56, 139, 253, 0.2)' : 'rgba(9, 105, 218, 0.1)')
      : 'transparent',
    border: `1px solid ${isSelected ? (isDarkMode ? '#388bfd' : '#0969da') : 'transparent'}`,
    color: isSelected 
      ? (isDarkMode ? '#58a6ff' : '#0969da')
      : (isDarkMode ? '#c9d1d9' : '#24292f'),
    ':hover': {
      backgroundColor: isSelected 
        ? (isDarkMode ? 'rgba(56, 139, 253, 0.25)' : 'rgba(9, 105, 218, 0.15)')
        : (isDarkMode ? 'rgba(177, 186, 196, 0.1)' : 'rgba(208, 215, 222, 0.2)')
    }
  }),

  classColor: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    flexShrink: 0,
  },

  className: {
    fontSize: '13px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  noClassesText: (isDarkMode) => ({
    fontSize: '13px',
    color: isDarkMode ? '#8b949e' : '#57606a',
    padding: '8px 12px',
    textAlign: 'center',
  }),

  imageControlsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },

  controlsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },

  sliderContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },

  sliderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  sliderLabel: (isDarkMode) => ({
    fontSize: '13px',
    fontWeight: '500',
    color: isDarkMode ? '#8b949e' : '#57606a'
  }),

  sliderValue: (isDarkMode) => ({
    fontSize: '12px',
    fontWeight: '400',
    color: isDarkMode ? '#8b949e' : '#57606a',
    background: isDarkMode ? 'rgba(177, 186, 196, 0.1)' : 'rgba(208, 215, 222, 0.3)',
    padding: '2px 6px',
    borderRadius: '4px'
  }),

  sliderTrack: (isDarkMode) => ({
    height: '4px',
    background: isDarkMode ? '#30363d' : '#e1e5e9',
    borderRadius: '2px',
    position: 'relative'
  }),

  modernSlider: (isDarkMode) => ({
    width: '100%',
    height: '6px',
    background: 'transparent',
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
    position: 'relative',
    WebkitAppearance: 'none',
  }),

  validationSection: (isDarkMode) => ({
    background: isDarkMode 
      ? 'rgba(33, 38, 45, 0.6)'
      : 'rgba(248, 250, 252, 0.8)',
    border: `1px solid ${isDarkMode ? '#30363d' : '#e1e5e9'}`,
    borderRadius: '12px',
    overflow: 'hidden',
    backdropFilter: 'blur(8px)'
  }),

  validationHeader: (isDarkMode) => ({
    padding: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${isDarkMode ? '#30363d' : '#e1e5e9'}`,
    transition: 'background 0.2s ease',
  }),

  validationTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b'
  },

  validationContent: (isOpen) => ({
    maxHeight: isOpen ? '300px' : '0',
    overflow: 'hidden',
    transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: isOpen ? '16px' : '0 16px'
  }),

  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px'
  },

  radioLabel: (isDarkMode, checked) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: checked 
      ? (isDarkMode ? 'rgba(31, 111, 235, 0.1)' : 'rgba(9, 105, 218, 0.1)')
      : 'transparent',
    border: `1px solid ${checked 
      ? (isDarkMode ? '#1f6feb' : '#0969da')
      : 'transparent'
    }`,
    fontSize: '13px',
    fontWeight: '500',
    color: isDarkMode ? '#e2e8f0' : '#374151'
  }),

  hiddenRadio: {
    display: 'none'
  },

  radioIndicator: (isDarkMode, checked) => ({
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: `2px solid ${checked 
      ? (isDarkMode ? '#58a6ff' : '#0969da')
      : (isDarkMode ? '#6e7681' : '#9ca3af')
    }`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  }),

  radioInner: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#58a6ff'
  },

  modernDoneButton: (isDarkMode) => ({
    width: '100%',
    height: '44px',
    background: isDarkMode 
      ? 'linear-gradient(135deg, #1f6feb 0%, #0969da 100%)'
      : 'linear-gradient(135deg, #0969da 0%, #0550ae 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(9, 105, 218, 0.3)',
  }),

  themeSection: {
    marginTop: 'auto'
  },

  modernThemeButton: (isDarkMode) => ({
    width: '100%',
    height: '44px',
    background: isDarkMode 
      ? 'rgba(56, 64, 75, 0.4)'
      : 'rgba(148, 163, 184, 0.1)',
    border: `1px solid ${isDarkMode ? '#404040' : '#e2e8f0'}`,
    borderRadius: '10px',
    color: isDarkMode ? '#e2e8f0' : '#475569',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(8px)',
  })
};

export default LeftDrawer;