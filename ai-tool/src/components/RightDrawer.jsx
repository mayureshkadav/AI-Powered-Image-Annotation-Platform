import React, { useState, useEffect } from 'react';
import './scrollbar.css';
import { 
  ChevronLeft, 
  ChevronRight, 
  FileImage, 
  Tag, 
  Layers, 
  Info,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Plus,
  Target
} from 'lucide-react';

const CollapseButton = ({ isCollapsed, onClick, direction, isDarkMode }) => (
  <button 
    onClick={onClick}
    style={styles.collapseButton(isDarkMode)}
  >
    {direction === 'right' ? 
      (isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />) : 
      (isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />)
    }
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
        onChange={(e) => onChange(Number(e.target.value))}
        style={styles.modernSlider(isDarkMode)}
      />
    </div>
  </div>
);

const AnnotationItem = ({ cls, isActive, isVisible, onToggleVisibility, onEdit, onDelete, isDarkMode, boundingBoxes = 0, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={styles.annotationItem(isDarkMode, isActive, isHovered)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div style={styles.annotationMain}>
        <div style={styles.annotationColor(cls.color)} />
        <div style={styles.annotationContent}>
          <div style={styles.annotationName(isDarkMode)}>{cls.name}</div>
          <div style={styles.annotationMeta(isDarkMode)}>
            {boundingBoxes > 0 ? `${boundingBoxes} annotation${boundingBoxes !== 1 ? 's' : ''}` : 'No annotations'}
          </div>
        </div>
        {isActive && (
          <div style={styles.activeIndicator(isDarkMode)}>
            <Target size={12} />
          </div>
        )}
      </div>
      
      <div style={styles.annotationActions(isHovered)}>
        <button 
          style={styles.actionButton(isDarkMode, isVisible)}
          onClick={onToggleVisibility}
          title={isVisible ? 'Hide annotations' : 'Show annotations'}
        >
          {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
        <button 
          style={styles.actionButton(isDarkMode)}
          onClick={onEdit}
          title="Edit class"
        >
          <Edit3 size={14} />
        </button>
        <button 
          style={styles.actionButtonDanger(isDarkMode)}
          onClick={onDelete}
          title="Delete class"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

const PropertyCard = ({ title, children, icon: Icon, isDarkMode, collapsible = true, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={styles.propertyCard(isDarkMode)}>
      <div 
        style={styles.propertyHeader(isDarkMode, collapsible)}
        onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
      >
        <div style={styles.propertyTitle}>
          {Icon && <Icon size={16} style={{ opacity: 0.8 }} />}
          <span>{title}</span>
        </div>
        {collapsible && (
          <ChevronRight 
            size={16} 
            style={{
              transform: `rotate(${isOpen ? 90 : 0}deg)`,
              transition: 'transform 0.2s ease',
              opacity: 0.6
            }}
          />
        )}
      </div>
      <div style={styles.propertyContent(isOpen, collapsible)}>
        {children}
      </div>
    </div>
  );
};

const ImageInfo = ({ imageIndex, images, isDarkMode }) => (
  <div style={styles.imageInfoContainer}>
    <div style={styles.imageNameContainer}>
      <div style={styles.imageName(isDarkMode)}>
        Sample_Image_{imageIndex + 1}.jpg
      </div>
      <div style={styles.imageStats(isDarkMode)}>
        <span>Image {imageIndex + 1} of {images.length}</span>
        <span style={styles.separator}>•</span>
        <span>15/100 annotated</span>
      </div>
    </div>
    
    <div style={styles.imageMetrics}>
      <div style={styles.metric(isDarkMode)}>
        <div style={styles.metricValue(isDarkMode)}>1920×1080</div>
        <div style={styles.metricLabel(isDarkMode)}>Resolution</div>
      </div>
      <div style={styles.metric(isDarkMode)}>
        <div style={styles.metricValue(isDarkMode)}>2.1 MB</div>
        <div style={styles.metricLabel(isDarkMode)}>Size</div>
      </div>
      <div style={styles.metric(isDarkMode)}>
        <div style={styles.metricValue(isDarkMode)}>JPG</div>
        <div style={styles.metricLabel(isDarkMode)}>Format</div>
      </div>
    </div>
  </div>
);

const RightDrawer = ({ 
  isRightSidebarCollapsed = false, 
  setIsRightSidebarCollapsed = () => {}, 
  rightSidebarWidth = 300, 
  imageIndex = 0, 
  images = [], 
  classes = [], 
  boundingBox = {}, 
  isDarkMode = false,
  onDeleteClass = () => {}, // Add onDeleteClass prop
  onClassItemClick = () => {},
  activeAnnIndex = null,
  // Image control props
  contrast = 100,
  setContrast = () => {},
  brightness = 100,
  setBrightness = () => {}
}) => {
  const [visibilityStates, setVisibilityStates] = useState(
    classes.reduce((acc, cls) => ({ ...acc, [cls.name]: cls.visible }), {})
  );

  // Keep visibility in sync when classes change (e.g., new per-image order)
  useEffect(() => {
    const next = classes.reduce((acc, cls) => ({ ...acc, [cls.name]: cls.visible }), {});
    setVisibilityStates(prev => ({ ...next, ...prev }));
  }, [classes]);

  const toggleVisibility = (className) => {
    setVisibilityStates(prev => ({ ...prev, [className]: !prev[className] }));
  };

  const handleEdit = (className) => {
    console.log('Edit class:', className);
  };

  const handleDelete = (className, annIndex) => {
    if (window.confirm(`Delete this bounding box for \"${className}\" on this image?\n\nOnly this single box will be removed. The class will remain available in the left drawer.`)) {
      onDeleteClass(className, annIndex);
    }
  };


  return (
    <div style={styles.rightSidebar(isRightSidebarCollapsed, rightSidebarWidth, isDarkMode)} className={isDarkMode ? 'dark' : ''}>
      <div style={styles.sidebarHeader(isDarkMode)}>
        <CollapseButton 
          isCollapsed={isRightSidebarCollapsed} 
          onClick={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)} 
          direction="right" 
          isDarkMode={isDarkMode} 
        />
        <div style={styles.headerContent}>
          {!isRightSidebarCollapsed && (
            <div style={styles.headerTitle}>
              <span>Properties</span>
              <Info size={18} style={{ opacity: 0.6 }} />
            </div>
          )}
        </div>
      </div>

      {!isRightSidebarCollapsed && (
        <div style={styles.sidebarContent} className="modern-scrollbar">
          
          <PropertyCard title="Image Details" icon={FileImage} isDarkMode={isDarkMode} collapsible={true} defaultOpen={true}>
            <ImageInfo 
              imageIndex={imageIndex} 
              images={images} 
              isDarkMode={isDarkMode} 
            />
          </PropertyCard>

          <PropertyCard 
            title="Image Balance" 
            icon={FileImage} 
            isDarkMode={isDarkMode}
            collapsible={true}
            defaultOpen={true}
          >
            <div style={styles.controlsContainer}>
              <SliderControl
                label="Contrast"
                value={contrast}
                onChange={setContrast}
                min={0}
                max={200}
                isDarkMode={isDarkMode}
              />
              <SliderControl
                label="Brightness"
                value={brightness}
                onChange={setBrightness}
                min={0}
                max={200}
                isDarkMode={isDarkMode}
              />
            </div>
          </PropertyCard>

          

          <PropertyCard title="Annotation Classes" icon={Tag} isDarkMode={isDarkMode}>
            <div style={styles.annotationsList} className="modern-scrollbar">
              {classes.map((cls, idx) => (
                <AnnotationItem
                  key={`${cls.name}-${idx}`}
                  cls={cls}
                  isActive={activeAnnIndex === cls.annIndex}
                  isVisible={visibilityStates[cls.name]}
                  onToggleVisibility={() => toggleVisibility(cls.name)}
                  onEdit={() => handleEdit(cls.name)}
                  onDelete={() => handleDelete(cls.name, cls.annIndex)}
                  isDarkMode={isDarkMode}
                  boundingBoxes={cls.count || 0}
                  onClick={() => onClassItemClick(cls.annIndex)}
                />
              ))}
            </div>
            
            <button style={styles.addClassButton(isDarkMode)}>
              <Plus size={16} />
              Add New Class
            </button>
          </PropertyCard>

          <PropertyCard 
            title="Layer Controls" 
            icon={Layers} 
            isDarkMode={isDarkMode}
            collapsible={true}
            defaultOpen={false}
          >
            <div style={styles.layerControls}>
              <div style={styles.layerOption}>
                <input 
                  type="checkbox" 
                  id="showGrid"
                  style={styles.checkbox}
                  defaultChecked
                />
                <label htmlFor="showGrid" style={styles.checkboxLabel(isDarkMode)}>
                  Show Grid
                </label>
              </div>
              <div style={styles.layerOption}>
                <input 
                  type="checkbox" 
                  id="showLabels"
                  style={styles.checkbox}
                  defaultChecked
                />
                <label htmlFor="showLabels" style={styles.checkboxLabel(isDarkMode)}>
                  Show Labels
                </label>
              </div>
              <div style={styles.layerOption}>
                <input 
                  type="checkbox" 
                  id="showConfidence"
                  style={styles.checkbox}
                />
                <label htmlFor="showConfidence" style={styles.checkboxLabel(isDarkMode)}>
                  Show Confidence
                </label>
              </div>
            </div>
          </PropertyCard>

        </div>
      )}
    </div>
  );
};

const styles = {
  rightSidebar: (isCollapsed, width, isDarkMode) => ({
    width: isCollapsed ? '56px' : `${width}px`,
    height: '100vh',
    background: isDarkMode 
      ? 'linear-gradient(180deg, #1a1a1a 0%, #0d1117 100%)'
      : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
    borderLeft: `1px solid ${isDarkMode ? '#30363d' : '#e1e5e9'}`,
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isDarkMode 
      ? '-2px 0 8px rgba(0, 0, 0, 0.3)'
      : '-2px 0 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    zIndex: 10
  }),

  // Shared slider styles (mirrored from LeftDrawer for consistency)
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

  sidebarHeader: (isDarkMode) => ({
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    borderBottom: `1px solid ${isDarkMode ? '#30363d' : '#e1e5e9'}`,
    background: isDarkMode 
      ? 'rgba(33, 38, 45, 0.8)'
      : 'rgba(248, 250, 252, 0.8)',
    backdropFilter: 'blur(8px)',
    position: 'sticky',
    top: 0,
    zIndex: 2
  }),

  headerContent: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end'
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
    width: '32px',
    height: '32px',
    background: isDarkMode 
      ? 'rgba(56, 64, 75, 0.6)'
      : 'rgba(148, 163, 184, 0.1)',
    border: `1px solid ${isDarkMode ? '#404040' : '#e2e8f0'}`,
    borderRadius: '8px',
    color: isDarkMode ? '#e2e8f0' : '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(4px)'
  }),

  sidebarContent: {
    flex: 1,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    overflowY: 'auto',
    overflowX: 'hidden'
  },

  propertyCard: (isDarkMode) => ({
    background: isDarkMode 
      ? 'rgba(33, 38, 45, 0.6)'
      : 'rgba(248, 250, 252, 0.8)',
    border: `1px solid ${isDarkMode ? '#30363d' : '#e1e5e9'}`,
    borderRadius: '12px',
    overflow: 'hidden',
    backdropFilter: 'blur(8px)'
  }),

  propertyHeader: (isDarkMode, clickable) => ({
    padding: '16px',
    borderBottom: `1px solid ${isDarkMode ? '#30363d' : '#e1e5e9'}`,
    cursor: clickable ? 'pointer' : 'default',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'background 0.2s ease'
  }),

  propertyTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b'
  },

  propertyContent: (isOpen, collapsible) => ({
    padding: '16px',
    maxHeight: collapsible ? (isOpen ? '500px' : '0') : 'auto',
    overflow: collapsible ? 'hidden' : 'visible',
    transition: collapsible ? 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease' : 'none',
    paddingTop: collapsible && !isOpen ? '0' : '16px',
    paddingBottom: collapsible && !isOpen ? '0' : '16px'
  }),

  imageInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },

  imageNameContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },

  imageName: (isDarkMode) => ({
    fontSize: '13px',
    fontWeight: '600',
    color: isDarkMode ? '#e2e8f0' : '#1f2937',
    wordBreak: 'break-all'
  }),

  imageStats: (isDarkMode) => ({
    fontSize: '11px',
    color: isDarkMode ? '#8b949e' : '#6b7280',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  }),

  separator: {
    opacity: 0.5
  },

  imageMetrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px'
  },

  metric: (isDarkMode) => ({
    textAlign: 'center',
    padding: '8px 4px',
    background: isDarkMode 
      ? 'rgba(56, 64, 75, 0.3)'
      : 'rgba(148, 163, 184, 0.1)',
    borderRadius: '8px',
    border: `1px solid ${isDarkMode ? '#404040' : '#e2e8f0'}`
  }),

  metricValue: (isDarkMode) => ({
    fontSize: '12px',
    fontWeight: '600',
    color: isDarkMode ? '#e2e8f0' : '#1f2937',
    marginBottom: '2px'
  }),

  metricLabel: (isDarkMode) => ({
    fontSize: '11px',
    color: isDarkMode ? '#8b949e' : '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }),

  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px'
  },

  summaryItem: (isDarkMode) => ({
    textAlign: 'center',
    padding: '16px 8px',
    background: isDarkMode 
      ? 'rgba(56, 64, 75, 0.3)'
      : 'rgba(148, 163, 184, 0.1)',
    borderRadius: '8px',
    border: `1px solid ${isDarkMode ? '#404040' : '#e2e8f0'}`
  }),

  summaryValue: (isDarkMode) => ({
    fontSize: '20px',
    fontWeight: '700',
    color: isDarkMode ? '#58a6ff' : '#0969da',
    marginBottom: '4px'
  }),

  summaryLabel: (isDarkMode) => ({
    fontSize: '11px',
    color: isDarkMode ? '#8b949e' : '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }),

  annotationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
    maxHeight: '240px',
    overflowY: 'auto',
    paddingRight: '6px'
  },

  annotationItem: (isDarkMode, isActive, isHovered) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    borderRadius: '8px',
    border: `1px solid ${isActive 
      ? (isDarkMode ? '#1f6feb' : '#0969da')
      : (isDarkMode ? '#404040' : '#e2e8f0')
    }`,
    background: isActive 
      ? (isDarkMode ? 'rgba(31, 111, 235, 0.1)' : 'rgba(9, 105, 218, 0.05)')
      : (isDarkMode ? 'rgba(56, 64, 75, 0.2)' : 'rgba(255, 255, 255, 0.5)'),
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  }),

  annotationMain: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1
  },

  annotationColor: (color) => ({
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: color,
    border: '2px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    flexShrink: 0
  }),

  annotationContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1
  },

  annotationName: (isDarkMode) => ({
    fontSize: '13px',
    fontWeight: '600',
    color: isDarkMode ? '#e2e8f0' : '#1f2937'
  }),

  annotationMeta: (isDarkMode) => ({
    fontSize: '11px',
    color: isDarkMode ? '#8b949e' : '#6b7280'
  }),

  activeIndicator: (isDarkMode) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: isDarkMode ? '#1f6feb' : '#0969da',
    color: '#ffffff'
  }),

  annotationActions: (isVisible) => ({
    display: 'flex',
    gap: '4px',
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.2s ease'
  }),

  actionButton: (isDarkMode, isActive = false) => ({
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: 'none',
    background: isActive
      ? (isDarkMode ? 'rgba(31, 111, 235, 0.2)' : 'rgba(9, 105, 218, 0.1)')
      : (isDarkMode ? 'rgba(56, 64, 75, 0.4)' : 'rgba(148, 163, 184, 0.1)'),
    color: isActive
      ? (isDarkMode ? '#58a6ff' : '#0969da')
      : (isDarkMode ? '#e2e8f0' : '#64748b'),
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  }),

  actionButtonDanger: (isDarkMode) => ({
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: 'none',
    background: isDarkMode ? 'rgba(248, 81, 73, 0.1)' : 'rgba(220, 38, 38, 0.1)',
    color: isDarkMode ? '#f85149' : '#dc2626',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  }),

  actionButtonDanger: (isDarkMode) => ({
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: 'none',
    background: isDarkMode ? 'rgba(248, 81, 73, 0.1)' : 'rgba(220, 38, 38, 0.1)',
    color: isDarkMode ? '#f85149' : '#dc2626',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  }),

  addClassButton: (isDarkMode) => ({
    width: '100%',
    height: '40px',
    background: isDarkMode 
      ? 'rgba(56, 64, 75, 0.4)'
      : 'rgba(148, 163, 184, 0.1)',
    border: `1px dashed ${isDarkMode ? '#404040' : '#9ca3af'}`,
    borderRadius: '8px',
    color: isDarkMode ? '#8b949e' : '#6b7280',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 0.2s ease'
  }),

  layerControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },

  layerOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 0'
  },

  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer'
  },

  checkboxLabel: (isDarkMode) => ({
    fontSize: '13px',
    fontWeight: '500',
    color: isDarkMode ? '#e2e8f0' : '#374151',
    cursor: 'pointer',
    userSelect: 'none'
  })
};

export default RightDrawer;