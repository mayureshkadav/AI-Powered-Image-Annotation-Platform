import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Hand, ZoomIn, ZoomOut, ArrowLeft, ArrowRight } from 'lucide-react';
import LeftDrawer from '../components/LeftDrawer';
import DrawingTool from '../components/DrawingTool';
import { apiUrl } from '../api';

const FigmaStyleAnnotationTool = () => {
  const { projectName } = useParams();
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(280);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(320);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Validate zoom level
  useEffect(() => {
    if (isNaN(zoomLevel) || zoomLevel <= 0) {
      setZoomLevel(1);
    }
  }, [zoomLevel]);
  const [isPanning, setIsPanning] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  // Validate offset
  useEffect(() => {
    if (isNaN(offset.x) || isNaN(offset.y)) {
      setOffset({ x: 0, y: 0 });
    }
  }, [offset]);
  const [handMode, setHandMode] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  // Drawing state
  const [isDrawingBox, setIsDrawingBox] = useState(false);
  const [isFirstClick, setIsFirstClick] = useState(false);
  const [currentBox, setCurrentBox] = useState(null);
  const [savedBoxes, setSavedBoxes] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [grainReduction, setGrainReduction] = useState(0);
  const [voiceAssist, setVoiceAssist] = useState(false);
  const [labelAssist, setLabelAssist] = useState(false);
  const [labelValidation, setLabelValidation] = useState(false);
  const [isValidationDrawerOpen, setIsValidationDrawerOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [images, setImages] = useState([]);
  const [classes, setClasses] = useState([]);
  const [annotations, setAnnotations] = useState([]);

  const startPosition = useRef({ x: 0, y: 0 });
  const canvasRef = useRef();
  const imageRef = useRef();
  
  // Image dimensions for coordinate system
  const [imageDimensions, setImageDimensions] = useState({ width: 800, height: 600 });
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });

  // Update canvas dimensions when component mounts or resizes
  useEffect(() => {
    const updateCanvasDimensions = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasDimensions({ width: rect.width, height: rect.height });
        console.log('Canvas dimensions updated:', { width: rect.width, height: rect.height });
      }
    };
    
    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);
    
    return () => window.removeEventListener('resize', updateCanvasDimensions);
  }, []);
  
  useEffect(() => {
    if (projectName) {
      console.log('Fetching project data for:', projectName);
      fetch(apiUrl(`/get-project/${projectName}`))
        .then(res => res.json())
        .then(data => {
          console.log('Project data received:', data);
          if (data.error) {
            console.error('Error in project data:', data.error);
            return;
          }
          console.log('Setting classes:', data.annotationClasses);
          setClasses(data.annotationClasses || []);
          const imageUrls = (data.uploadedFiles || []).map(file => 
            `${apiUrl(`/uploads/${projectName.replace(/ /g, '_')}/${file}`)}`
          );
          console.log('Setting image URLs:', imageUrls);
          setImages(imageUrls);
        })
        .catch(err => console.error('Error fetching project data:', err));
    }
  }, [projectName]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  // Convert screen coordinates to image coordinates
  const screenToImageCoordinates = (screenX, screenY) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    // Calculate relative position within canvas
    const relativeX = screenX - canvasRect.left;
    const relativeY = screenY - canvasRect.top;
    
    // Convert to image coordinates accounting for zoom and offset
    const imageX = (relativeX - offset.x) / zoomLevel;
    const imageY = (relativeY - offset.y) / zoomLevel;
    
    // Clamp to image bounds
    const clampedX = Math.max(0, Math.min(imageDimensions.width, imageX));
    const clampedY = Math.max(0, Math.min(imageDimensions.height, imageY));
    
    return { x: clampedX, y: clampedY };
  };
  
  // Convert image coordinates to screen coordinates
  const imageToScreenCoordinates = (imageX, imageY) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const screenX = offset.x + (imageX * zoomLevel);
    const screenY = offset.y + (imageY * zoomLevel);
    
    return { x: screenX, y: screenY };
  };

  const handleMouseDown = (e) => {
    if (handMode) {
      setIsPanning(true);
      startPosition.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
      return;
    }

    if (!isDrawingBox || !canvasRef.current || zoomLevel <= 0) {
      return;
    }

    const imageCoords = screenToImageCoordinates(e.clientX, e.clientY);
    
    // Validate coordinates
    if (isNaN(imageCoords.x) || isNaN(imageCoords.y) || !isFinite(imageCoords.x) || !isFinite(imageCoords.y)) {
      console.log('❌ Invalid coordinates for mouse down:', imageCoords);
      return;
    }

    if (!isFirstClick) {
      // First click - start new box
      setCurrentBox({
        startX: imageCoords.x,
        startY: imageCoords.y,
        endX: imageCoords.x,
        endY: imageCoords.y,
        class: selectedClass || 'default',
        id: Date.now(),
        imageIndex: imageIndex
      });
      setIsFirstClick(true);
    } else {
      // Second click - complete the box
      if (currentBox) {
        const completedBox = {
          ...currentBox,
          endX: imageCoords.x,
          endY: imageCoords.y,
          class: selectedClass || currentBox.class
        };

        // Only save if the box has valid size
        const boxWidth = Math.abs(completedBox.endX - completedBox.startX);
        const boxHeight = Math.abs(completedBox.endY - completedBox.startY);
        
        if (boxWidth > 5 && boxHeight > 5) {
          setSavedBoxes(prev => [...prev, completedBox]);
          setAnnotations(prev => [...prev, completedBox]);
        }
      }
      
      // Reset for next box
      setCurrentBox(null);
      setIsFirstClick(false);
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning && handMode) {
      const newX = e.clientX - startPosition.current.x;
      const newY = e.clientY - startPosition.current.y;
      setOffset({ x: newX, y: newY });
    } else if (isDrawingBox && isFirstClick && currentBox && canvasRef.current && zoomLevel > 0) {
      const imageCoords = screenToImageCoordinates(e.clientX, e.clientY);
      
      // Update the current box's end coordinates
      if (!isNaN(imageCoords.x) && !isNaN(imageCoords.y) && isFinite(imageCoords.x) && isFinite(imageCoords.y)) {
        setCurrentBox(prev => ({
          ...prev,
          endX: imageCoords.x,
          endY: imageCoords.y
        }));
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    if (isDrawingBox && boundingBox.startX !== 0 && boundingBox.startY !== 0) {
      // Save the completed bounding box to annotations
      const completedBox = {
        ...boundingBox,
        endX: boundingBox.endX || boundingBox.startX,
        endY: boundingBox.endY || boundingBox.startY,
        class: selectedClass || (classes.length > 0 ? classes[0].name : 'default'),
        id: Date.now(), // Simple unique ID
        imageIndex: imageIndex
      };
      
      // Only save if the box has some size and coordinates are valid
      const boxWidth = Math.abs(completedBox.endX - completedBox.startX);
      const boxHeight = Math.abs(completedBox.endY - completedBox.startY);
      
      console.log('Attempting to save box:', {
        completedBox,
        boxWidth,
        boxHeight,
        isValidSize: boxWidth > 5 && boxHeight > 5,
        hasValidCoords: !isNaN(completedBox.startX) && !isNaN(completedBox.startY) && !isNaN(completedBox.endX) && !isNaN(completedBox.endY)
      });
      
      if (!isNaN(boxWidth) && !isNaN(boxHeight) && boxWidth > 5 && boxHeight > 5 &&
          !isNaN(completedBox.startX) && !isNaN(completedBox.startY) &&
          !isNaN(completedBox.endX) && !isNaN(completedBox.endY)) {
        
        console.log('✅ Saving bounding box:', completedBox);
        setAnnotations(prev => {
          const newAnnotations = [...prev, completedBox];
          console.log('✅ Updated annotations array:', newAnnotations);
          return newAnnotations;
        });
      } else {
        console.log('❌ Box not saved - invalid size or coordinates');
      }
      
      // Reset the current bounding box
      setBoundingBox({ startX: 0, startY: 0, endX: 0, endY: 0, class: '' });
      // Don't immediately turn off drawing mode - let user continue drawing if needed
      // setIsDrawingBox(false);
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY;
    setZoomLevel((prev) => Math.min(Math.max(prev + (delta > 0 ? -0.1 : 0.1), 0.3), 3));
  };

  const fitToScreen = () => {
    if (!imageRef.current || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const img = imageRef.current;
    const scaleX = canvasRect.width / img.naturalWidth;
    const scaleY = canvasRect.height / img.naturalHeight;
    const fitZoom = Math.min(scaleX, scaleY) * 0.9;
    setZoomLevel(fitZoom);
    setOffset({ x: (canvasRect.width - img.naturalWidth * fitZoom) / 2, y: (canvasRect.height - img.naturalHeight * fitZoom) / 2 });
  };

  const toggleDrawingMode = (isEnabled) => {
    setIsDrawingBox(isEnabled);
    if (!isEnabled) {
      setCurrentBox(null);
      setIsFirstClick(false);
    }
  };

  const handleClassSelect = (classId) => {
    setSelectedClass(classId);
  };

  // Combine saved boxes and current box for rendering
  const allBoxes = [...savedBoxes];
  if (currentBox) {
    allBoxes.push(currentBox);
  }

  const handleSaveSettings = () => {
    console.log('Settings saved:', { voiceAssist, labelAssist, labelValidation });
    setIsValidationDrawerOpen(false);
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      width: '100vw',
      fontFamily: 'Segoe UI, Roboto, sans-serif',
      background: isDarkMode ? '#2c2c2c' : '#f0f0f0',
      color: isDarkMode ? '#ffffff' : '#000000',
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden'
    },
    leftSidebar: {
      width: isLeftSidebarCollapsed ? '60px' : leftSidebarWidth,
      background: isDarkMode ? '#1e1e1e' : '#ffffff',
      borderRight: `1px solid ${isDarkMode ? '#404040' : '#d0d0d0'}`,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      overflow: 'hidden'
    },
    sidebarHeader: {
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      borderBottom: `1px solid ${isDarkMode ? '#404040' : '#d0d0d0'}`
    },
    sidebarTitle: {
      fontSize: '14px',
      fontWeight: '600',
      marginLeft: '8px'
    },
    toolButton: {
      width: '100%',
      padding: '12px 16px',
      background: 'transparent',
      border: 'none',
      color: isDarkMode ? '#ffffff' : '#000000',
      textAlign: 'left',
      cursor: 'pointer'
    },
    mainCanvas: {
      flex: 1,
      position: 'relative',
      background: isDarkMode ? '#2c2c2c' : '#f0f0f0',
      overflow: 'hidden',
    },
    toolbarSeparator: {
      width: '1px',
      height: '20px',
      background: isDarkMode ? '#404040' : '#d0d0d0'
    },
    rightSidebar: {
      width: isRightSidebarCollapsed ? 0 : rightSidebarWidth,
      background: 'lightgrey'
    },
    classSection: {
      padding: '0 16px',
      marginTop: '20px',
    },
    sectionTitle: (isDarkMode) => ({
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '10px',
      color: isDarkMode ? '#a0aec0' : '#4a5568',
    }),
    classList: {
      maxHeight: '150px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    classItem: (isSelected, isDarkMode) => ({
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      borderRadius: '6px',
      cursor: 'pointer',
      backgroundColor: isSelected 
        ? (isDarkMode ? '#4a5568' : '#e2e8f0') 
        : 'transparent',
      border: `1px solid ${isSelected ? (isDarkMode ? '#63b3ed' : '#4299e1') : 'transparent'}`, 
      transition: 'background-color 0.2s, border-color 0.2s',
    }),
    classColor: {
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      marginRight: '12px',
    },
    className: {
      fontSize: '14px',
    },
    noClassesText: (isDarkMode) => ({
      fontSize: '14px',
      color: isDarkMode ? '#a0aec0' : '#718096',
      textAlign: 'center',
      padding: '20px 0',
    }),
    classSelect: {
      width: '100%',
      padding: '5px',
      marginTop: '10px',
      borderRadius: '4px',
      border: `1px solid ${isDarkMode ? '#404040' : '#d0d0d0'}`,
      background: isDarkMode ? '#2c2c2c' : '#ffffff',
      color: isDarkMode ? '#fff' : '#000'
    },
    sliderLabel: {
      fontSize: '14px',
      marginTop: '12px'
    },
    slider: {
      width: '100%'
    },
    annotationTable: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '10px'
    },
    validationSection: {
      marginTop: '20px',
      padding: '10px',
      borderTop: `1px solid ${isDarkMode ? '#404040' : '#d0d0d0'}`,
      background: isDarkMode ? '#262626' : '#e8e8e8',
      transition: 'max-height 0.3s ease',
      maxHeight: isValidationDrawerOpen ? '300px' : '0',
      overflow: 'hidden'
    },
    validationTitle: {
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '10px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    radioContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '10px'
    },
    doneButton: {
      width: '100%',
      padding: '8px',
      background: '#0078D4',
      border: 'none',
      borderRadius: '4px',
      color: '#ffffff',
      cursor: 'pointer',
      marginTop: '10px'
    },
    validationNavbar: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '48px',
      background: isDarkMode ? '#ffffff' : '#333333',
      color: isDarkMode ? '#000000' : '#ffffff',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      zIndex: 15,
      fontSize: '14px',
      fontWeight: '600',
      boxShadow: `0 2px 4px ${isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'}`
    },
    themeToggleButton: {
      width: '100%',
      padding: '8px',
      background: isDarkMode ? '#333' : '#e0e0e0',
      border: `1px solid ${isDarkMode ? '#404040' : '#d0d0d0'}`,
      borderRadius: '4px',
      color: isDarkMode ? '#ffffff' : '#000000',
      cursor: 'pointer',
      marginTop: '10px',
      textAlign: 'center'
    }
  };

  const CollapseButton = ({ isCollapsed, onClick, direction }) => (
    <button 
      style={{ background: 'transparent', border: 'none', color: isDarkMode ? '#a0aec0' : '#718096', cursor: 'pointer' }}
      onClick={onClick}
    >
      {direction === 'left' ? (isCollapsed ? '→' : '←') : (isCollapsed ? '←' : '→')}
    </button>
  );

  return (
    <div
      style={styles.container}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* LEFT SIDEBAR */}
      <div style={styles.leftSidebar}>
        <div style={styles.sidebarHeader}>
          <CollapseButton isCollapsed={isLeftSidebarCollapsed} onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)} direction="left" />
          <span style={styles.sidebarTitle}>
            {!isLeftSidebarCollapsed && 'Tools'}
          </span>
        </div>
        <div style={{ padding: '16px' }}>
          <button style={styles.toolButton} onClick={toggleDrawingMode}>
            <Pencil size={20} style={{ marginRight: '8px' }} />
            {!isLeftSidebarCollapsed && 'Draw Bounding Box'}
          </button>

          {isDrawingBox && !isLeftSidebarCollapsed && (
            <div style={styles.classSection}>
              <div style={styles.sectionTitle(isDarkMode)}>Classes</div>
              <div style={styles.classList}>
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

          {!isLeftSidebarCollapsed && (
            <div style={{ width: '100%' }}>
              <div style={styles.sliderLabel}>Contrast</div>
              <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(e.target.value)} style={styles.slider} />
              <div style={styles.sliderLabel}>Brightness</div>
              <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(e.target.value)} style={styles.slider} />
              <div style={styles.sliderLabel}>Grain Reduction</div>
              <input type="range" min="0" max="100" value={grainReduction} onChange={(e) => setGrainReduction(e.target.value)} style={styles.slider} />
              
              {/* VALIDATION DRAWER */}
              <div style={styles.validationSection}>
                <div style={styles.validationTitle} onClick={() => setIsValidationDrawerOpen(!isValidationDrawerOpen)}>
                  Validation Settings {isValidationDrawerOpen ? '▼' : '▶'}
                </div>
                <div style={styles.radioContainer}>
                  <input
                    type="radio"
                    id="voiceAssist"
                    checked={voiceAssist}
                    onChange={() => setVoiceAssist(!voiceAssist)}
                  />
                  <label htmlFor="voiceAssist">Voice Assist</label>
                </div>
                <div style={styles.radioContainer}>
                  <input
                    type="radio"
                    id="labelAssist"
                    checked={labelAssist}
                    onChange={() => setLabelAssist(!labelAssist)}
                  />
                  <label htmlFor="labelAssist">Label Assist</label>
                </div>
                <div style={styles.radioContainer}>
                  <input
                    type="radio"
                    id="labelValidation"
                    checked={labelValidation}
                    onChange={() => setLabelValidation(!labelValidation)}
                  />
                  <label htmlFor="labelValidation">Label Validation</label>
                </div>
                <button style={styles.doneButton} onClick={handleSaveSettings}>
                  Done
                </button>
              </div>
              <button style={styles.themeToggleButton} onClick={toggleTheme}>
                {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MAIN CANVAS */}
      <div 
        style={styles.mainCanvas} 
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        {labelValidation && (
          <div style={styles.validationNavbar}>
            Label Validation Mode
          </div>
        )}
        {/* Current drawing bounding box */}
        {isDrawingBox && boundingBox.startX !== 0 && boundingBox.startY !== 0 && (() => {
          // Calculate screen positions from image coordinates for current drawing box
          const topLeft = imageToScreenCoordinates(
            Math.min(boundingBox.startX || 0, boundingBox.endX || 0),
            Math.min(boundingBox.startY || 0, boundingBox.endY || 0)
          );
          const bottomRight = imageToScreenCoordinates(
            Math.max(boundingBox.startX || 0, boundingBox.endX || 0),
            Math.max(boundingBox.startY || 0, boundingBox.endY || 0)
          );
          
          const left = topLeft.x;
          const top = topLeft.y;
          const width = bottomRight.x - topLeft.x;
          const height = bottomRight.y - topLeft.y;
          
          // Only render if coordinates are valid
          if (isNaN(left) || isNaN(top) || isNaN(width) || isNaN(height) || 
              !isFinite(left) || !isFinite(top) || !isFinite(width) || !isFinite(height)) {
            return null;
          }
          
          return (
            <div style={{
              position: 'absolute',
              border: `2px dashed ${isDarkMode ? '#fff' : '#000'}`,
              left: left,
              top: top,
              width: width,
              height: height,
              zIndex: 3
            }} />
          );
        })()}
        
        
        {/* Saved annotations */}
        {(() => {
          const filteredAnnotations = annotations.filter(annotation => annotation.imageIndex === imageIndex);
          console.log('🎨 Rendering', filteredAnnotations.length, 'annotations for image', imageIndex, ':', filteredAnnotations);
          return filteredAnnotations.map((annotation) => {
            const classColor = classes.find(cls => cls.name === annotation.class)?.color || '#ff0000';
            
            // Calculate screen positions from image coordinates
            const topLeft = imageToScreenCoordinates(
              Math.min(annotation.startX || 0, annotation.endX || 0),
              Math.min(annotation.startY || 0, annotation.endY || 0)
            );
            const bottomRight = imageToScreenCoordinates(
              Math.max(annotation.startX || 0, annotation.endX || 0),
              Math.max(annotation.startY || 0, annotation.endY || 0)
            );
            
            const left = topLeft.x;
            const top = topLeft.y;
            const width = bottomRight.x - topLeft.x;
            const height = bottomRight.y - topLeft.y;
            
            // Skip rendering if any value is NaN or invalid
            if (isNaN(left) || isNaN(top) || isNaN(width) || isNaN(height) || 
                !isFinite(left) || !isFinite(top) || !isFinite(width) || !isFinite(height)) {
              console.log('❌ Skipping invalid annotation:', { annotation, left, top, width, height });
              return null;
            }
            
            console.log('✅ Rendering annotation:', { annotation, left, top, width, height });
            
            return (
              <div key={annotation.id} style={{
                position: 'absolute',
                border: `2px solid ${classColor}`,
                left: left,
                top: top,
                width: width,
                height: height,
                zIndex: 3,
                backgroundColor: `${classColor}20`, // Semi-transparent background
                pointerEvents: 'auto',
                cursor: 'pointer'
              }}
              onClick={() => {
                console.log('Clicked annotation:', annotation);
                // Optional: Select the annotation for editing
              }}
              title={`${annotation.class} annotation`}
              >
                {/* Class label */}
                <div style={{
                  position: 'absolute',
                  top: '-25px',
                  left: '0px',
                  backgroundColor: classColor,
                  color: 'white',
                  padding: '2px 6px',
                  fontSize: '12px',
                  borderRadius: '3px',
                  whiteSpace: 'nowrap'
                }}>
                  {annotation.class}
                </div>
              </div>
            );
          })
        })}
        {allBoxes
          .filter(box => box.imageIndex === imageIndex)
          .map((box, index) => {
            const left = offset.x + Math.min(box.startX, box.endX) * zoomLevel;
            const top = offset.y + Math.min(box.startY, box.endY) * zoomLevel;
            const width = Math.abs(box.endX - box.startX) * zoomLevel;
            const height = Math.abs(box.endY - box.startY) * zoomLevel;
            const boxClass = classes.find(c => c.name === box.class);
            const borderColor = boxClass?.color || '#4CAF50';

            return (
              <div
                key={`${box.id || index}`}
                style={{
                  position: 'absolute',
                  left: `${left}px`,
                  top: `${top}px`,
                  width: `${width}px`,
                  height: `${height}px`,
                  border: `2px solid ${borderColor}`,
                  backgroundColor: `${borderColor}33`, // 20% opacity
                  pointerEvents: 'none',
                  zIndex: 10,
                }}
              />
            );
          })}
        <div style={{
          position: 'absolute',
          top: offset.y,
          left: offset.x,
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top left',
          filter: `contrast(${contrast}%) brightness(${brightness}%) blur(${grainReduction}px)`,
          zIndex: 2,
          cursor: handMode ? 'grab' : (isDrawingBox ? 'crosshair' : 'default')
        }}>
          {images.length > 0 ? (
            <img ref={imageRef} src={images[imageIndex]} alt="Zoomable" style={{ borderRadius: '8px', maxWidth: '100%', maxHeight: '100%' }} />
          ) : (
            <p>Loading image...</p>
          )}
        </div>

        {/* BOTTOM CONTROL PANEL */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: isDarkMode ? '#1e1e1e' : '#ffffff',
          border: `1px solid ${isDarkMode ? '#404040' : '#d0d0d0'}`,
          borderRadius: '8px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 10
        }}>
          <button style={{
            width: '40px',
            height: '40px',
            background: isDarkMode ? '#333' : '#e0e0e0',
            border: 'none',
            borderRadius: '4px',
            color: isDarkMode ? '#ffffff' : '#000000',
            cursor: 'pointer'
          }} onClick={() => setHandMode(prev => !prev)}><Hand size={20} /></button>
          <button style={{
            width: '40px',
            height: '40px',
            background: isDarkMode ? '#333' : '#e0e0e0',
            border: 'none',
            borderRadius: '4px',
            color: isDarkMode ? '#ffffff' : '#000000',
            cursor: 'pointer'
          }} onClick={() => setZoomLevel(z => Math.min(z + 0.1, 3))}><ZoomIn size={20} /></button>
          <button style={{
            width: '40px',
            height: '40px',
            background: isDarkMode ? '#333' : '#e0e0e0',
            border: 'none',
            borderRadius: '4px',
            color: isDarkMode ? '#ffffff' : '#000000',
            cursor: 'pointer'
          }} onClick={() => setZoomLevel(z => Math.max(z - 0.1, 0.3))}><ZoomOut size={20} /></button>
          <button style={{
            width: '40px',
            height: '40px',
            background: isDarkMode ? '#333' : '#e0e0e0',
            border: 'none',
            borderRadius: '4px',
            color: isDarkMode ? '#ffffff' : '#000000',
            cursor: 'pointer'
          }} onClick={fitToScreen}>🖥️</button>
          <div style={{
            width: '1px',
            height: '20px',
            background: isDarkMode ? '#404040' : '#d0d0d0'
          }} />
          <button style={{
            width: '40px',
            height: '40px',
            background: isDarkMode ? '#333' : '#e0e0e0',
            border: 'none',
            borderRadius: '4px',
            color: isDarkMode ? '#ffffff' : '#000000',
            cursor: 'pointer'
          }} onClick={() => setImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))}><ArrowLeft size={20} /></button>
          <button style={{
            width: '40px',
            height: '40px',
            background: isDarkMode ? '#333' : '#e0e0e0',
            border: 'none',
            borderRadius: '4px',
            color: isDarkMode ? '#ffffff' : '#000000',
            cursor: 'pointer'
          }} onClick={() => setImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))}><ArrowRight size={20} /></button>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div style={styles.rightSidebar}>
        <div style={styles.sidebarHeader}>
          <CollapseButton isCollapsed={isRightSidebarCollapsed} onClick={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)} direction="right" />
          <span style={styles.sidebarTitle}>
            {!isRightSidebarCollapsed && 'Properties'}
          </span>
        </div>
        {!isRightSidebarCollapsed && (
          <div style={{ padding: '16px' }}>
            {/* IMAGE NAME & COUNTER */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Image Name: <span style={{ color: isDarkMode ? '#ccc' : '#666' }}>Sample_Image_{imageIndex + 1}.jpg</span>
              </div>
              <div style={{ fontSize: '14px', color: isDarkMode ? '#aaa' : '#888', marginTop: '4px' }}>
                Image {imageIndex + 1} / {images.length} (Dummy: 15/100)
              </div>
            </div>

            {/* ANNOTATIONS TABLE */}
            <h4>Annotation Labels</h4>
            {selectedClass && (
              <div style={{
                padding: '8px',
                backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                borderRadius: '4px',
                marginBottom: '8px',
                fontSize: '12px',
                color: isDarkMode ? '#4ade80' : '#16a34a'
              }}>
                Selected: {selectedClass} - Ready to draw!
              </div>
            )}

            <table style={styles.annotationTable}>
              <tbody>
                {classes.map((cls) => (
                  <tr 
                    key={cls.name} 
                    onClick={() => setSelectedClass(cls.name)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: selectedClass === cls.name ? (isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.1)') : 'transparent',
                      padding: '8px',
                      borderRadius: '4px',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <td>
                      <span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', background: cls.color, marginRight: '8px' }} />
                      {cls.name} {selectedClass === cls.name && <span style={{ fontWeight: 'bold', color: isDarkMode ? '#60a5fa' : '#3b82f6' }}>(Selected)</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FigmaStyleAnnotationTool;