import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Hand, ZoomIn, ZoomOut, ArrowLeft, ArrowRight } from 'lucide-react';
import LeftDrawer from '../components/LeftDrawer';
import RightDrawer from '../components/RightDrawer';
import { apiUrl } from '../api';

const FigmaStyleAnnotationTool = () => {
  const { projectName } = useParams();
  const [images, setImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);

  // Sidebar states
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(280);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(320);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);

  // Canvas interaction states
  const [zoomLevel, setZoomLevel] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [handMode, setHandMode] = useState(false);
  const [isDrawingBox, setIsDrawingBox] = useState(false);
  const [activeTool, setActiveTool] = useState(null); // 'move', 'rotate', 'crop', 'magic', 'layers'
  const [boundingBox, setBoundingBox] = useState({ startX: 0, startY: 0, endX: 0, endY: 0 });
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);

  // Multiple annotations
  const [annotations, setAnnotations] = useState({}); // { "image.jpg": [{class, x_center, y_center, width, height}, ...] }

  // Annotation and class states
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);

  // Image adjustment states
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  
  // Track hovered and selected bounding boxes
  const [hoveredBox, setHoveredBox] = useState(null);
  const [selectedBox, setSelectedBox] = useState(null);
  // Track highlighted annotation index from RightDrawer (per-card)
  const [highlightedAnnIndex, setHighlightedAnnIndex] = useState(null);

  // Feature flags
  const [voiceAssist, setVoiceAssist] = useState(false);
  const [labelAssist, setLabelAssist] = useState(false);
  const [labelValidation, setLabelValidation] = useState(false);
  const [isValidationDrawerOpen, setIsValidationDrawerOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showHappyEmoji, setShowHappyEmoji] = useState(false);

  // Helper function to get contrasting text color based on background color
  const getContrastColor = (hexColor) => {
    if (!hexColor) return isDarkMode ? '#fff' : '#000';
    
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light colors, white for dark colors
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  // Trigger AI annotation for the selected class on the current image
  const handleMagicClassSelect = async (className, modelName) => {
    try {
      const currentImagePath = images[imageIndex];
      if (!currentImagePath) return;
      
      console.log(`Using model: ${modelName || 'default'} for class: ${className}`);
      const imageName = currentImagePath.split('/').pop();
      const projectSlug = currentImagePath.split('/').reverse()[1];

      // Call backend inference
      const response = await fetch(apiUrl('/ai-annotate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_name: projectName,
          image_name: currentImagePath.split('/').pop(),
          class_name: className,
          model_name: modelName  // Pass the selected model name to the backend
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('AI annotate error:', data?.error || response.statusText);
        alert(`AI annotate failed: ${data?.error || response.statusText}`);
        console.error('AI annotate error:', data?.error || resp.statusText);
        alert(`AI annotate failed: ${data?.error || resp.statusText}`);
        return;
      }

      const anns = Array.isArray(data.annotations) ? data.annotations : [];
      if (anns.length === 0) {
        alert(`No '${className}' found by the model on this image.`);
      }

      // Merge annotations into current image
      setAnnotations((prev) => {
        const updated = { ...prev };
        const current = Array.isArray(updated[imageName]) ? [...updated[imageName]] : [];
        const newOnes = anns.map((a) => ({
          class: a.class || className,
          x_center: a.x_center,
          y_center: a.y_center,
          width: a.width,
          height: a.height,
        }));
        updated[imageName] = [...current, ...newOnes];
        return updated;
      });

      // Close Magic modal
      setActiveTool(null);
    } catch (e) {
      console.error('handleMagicClassSelect failed:', e);
      alert(`AI annotate failed: ${e.message}`);
    }
  };

  // Handle saving settings and show happy emoji if label assist is enabled
  const handleSaveSettings = () => {
    console.log('Settings saved');
    
    // Show happy emoji if label assist is enabled
    if (labelAssist) {
      setShowHappyEmoji(true);
      // Hide the emoji after 3 seconds
      setTimeout(() => setShowHappyEmoji(false), 3000);
    }
  };

  // Refs
  const startPosition = useRef({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Voice assistant - simple helper using Web Speech API
  const speak = (text) => {
    try {
      if (!('speechSynthesis' in window)) return;
      // Clear any queued utterances to avoid overlap
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
    }
  };

  // A set of highly distinguishable colors for annotation classes
  const DISTINCT_COLORS = [
    '#FF5252', // Red
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#FFC107', // Amber
    '#9C27B0', // Purple
    '#00BCD4', // Cyan
    '#FF9800', // Orange
    '#795548', // Brown
    '#607D8B', // Blue Grey
    '#E91E63', // Pink
    '#8BC34A', // Light Green
    '#3F51B5', // Indigo
    '#FF5722', // Deep Orange
    '#009688', // Teal
    '#673AB7'  // Deep Purple
  ];

  // Load project images & classes
  useEffect(() => {
    if (projectName) {
      fetch(apiUrl(`/get-project/${projectName}`))
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            console.error(data.error);
            return;
          }
          // Filter out any empty or invalid annotation classes
          let validClasses = (data.annotationClasses || []).filter(
            cls => cls && cls.name && cls.name.trim() !== ''
          );
          
          // Assign distinct colors to each class if not already set
          validClasses = validClasses.map((cls, index) => ({
            ...cls,
            color: cls.color || DISTINCT_COLORS[index % DISTINCT_COLORS.length]
          }));
          
          setClasses(validClasses);
          
          const imageUrls = (data.uploadedFiles || []).map(file =>
            `${apiUrl(`/uploads/${projectName.replace(/ /g, '_')}/${file}`)}`
          );
          setImages(imageUrls);
        })
        .catch(err => console.error('Error fetching project data:', err));
    }
  }, [projectName]);

  // Disable scrollbars
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleMouseDown = (e) => {
    // Only handle box selection when not in drawing mode
    if (!isDrawingBox) {
      // Clear selected box when clicking outside
      if (!e.target.closest('[data-bounding-box]')) {
        setSelectedBox(null);
      }
    }
    
    // Ignore events from the toolbar
    if (e.target.closest('.toolbar-button') || e.target.closest('.bottom-toolbar')) {
      setActiveTool(null);
      return;
    }
    
    // Handle different tools
    if (activeTool === 'move' || handMode) {
      // Start moving the canvas
      startPosition.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
      return;
    } else if (activeTool === 'crop' || activeTool === 'rotate' || activeTool === 'magic') {
      // Handle crop/rotate/magic tool selection
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - offset.x) / zoomLevel;
      const y = (e.clientY - rect.top - offset.y) / zoomLevel;
      
      // Check if we clicked on an annotation
      const clickedAnnotation = findAnnotationAtPosition(x, y);
      if (clickedAnnotation) {
        setSelectedAnnotation(clickedAnnotation);
        
        if (activeTool === 'crop') {
          // Start crop operation
          console.log('Starting crop on annotation:', clickedAnnotation);
        } else if (activeTool === 'rotate') {
          // Start rotate operation
          console.log('Starting rotate on annotation:', clickedAnnotation);
        } else if (activeTool === 'magic') {
          // Start magic operation (e.g., auto-crop/auto-rotate)
          console.log('Starting magic operation on annotation:', clickedAnnotation);
          handleMagicOperation(clickedAnnotation);
        }
      }
      return;
    }

    if (handMode) {
      startPosition.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    } else if (isDrawingBox && selectedClass) {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const img = imageRef.current;
      
      // Calculate the displayed image dimensions (maintaining aspect ratio)
      const imgAspect = img.naturalWidth / img.naturalHeight;
      let displayWidth = img.width;
      let displayHeight = img.height;
      
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        displayWidth = Math.min(img.width, img.height * imgAspect);
        displayHeight = displayWidth / imgAspect;
      }
      
      // Calculate the position of the image within the canvas
      const imgX = (img.width - displayWidth) / 2;
      const imgY = (img.height - displayHeight) / 2;
      
      // Convert screen coordinates to canvas coordinates
      const canvasX = (e.clientX - rect.left - offset.x) / zoomLevel;
      const canvasY = (e.clientY - rect.top - offset.y) / zoomLevel;
      
      // Convert canvas coordinates to image coordinates
      let x = (canvasX - imgX) * (img.naturalWidth / displayWidth);
      let y = (canvasY - imgY) * (img.naturalHeight / displayHeight);
      
      // Constrain coordinates to image boundaries
      x = Math.max(0, Math.min(x, img.naturalWidth));
      y = Math.max(0, Math.min(y, img.naturalHeight));
      
      setBoundingBox({ startX: x, startY: y, endX: x, endY: y });
    }
  };

  const findAnnotationAtPosition = (x, y) => {
    if (!images[imageIndex]) return null;
    
    const currentImageName = images[imageIndex].split('/').pop();
    const imageAnns = annotations[currentImageName] || [];
    
    // Find the top-most annotation at the given position
    for (let i = imageAnns.length - 1; i >= 0; i--) {
      const ann = imageAnns[i];
      const img = imageRef.current;
      
      if (!img) continue;
      
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      
      const x1 = (ann.x_center - ann.width / 2) * imgWidth;
      const y1 = (ann.y_center - ann.height / 2) * imgHeight;
      const x2 = x1 + (ann.width * imgWidth);
      const y2 = y1 + (ann.height * imgHeight);
      
      if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
        return { ...ann, index: i };
      }
    }
    
    return null;
  };
  
  const handleMagicOperation = (annotation) => {
    // Implement magic operation (e.g., auto-adjust crop/rotation)
    // This is a placeholder - implement your specific magic operation logic here
    console.log('Performing magic operation on:', annotation);
    
    // Example: Auto-rotate the selected annotation
    if (annotation) {
      const currentImageName = images[imageIndex].split('/').pop();
      setAnnotations(prev => {
        const updated = { ...prev };
        const imageAnns = [...(updated[currentImageName] || [])];
        
        // Find and update the annotation
        const index = imageAnns.findIndex(a => 
          a.x_center === annotation.x_center && 
          a.y_center === annotation.y_center &&
          a.width === annotation.width &&
          a.height === annotation.height
        );
        
        if (index !== -1) {
          // Apply magic transformation (example: rotate 90 degrees)
          const updatedAnn = { ...imageAnns[index] };
          // Example: Swap width/height for a 90-degree rotation
          [updatedAnn.width, updatedAnn.height] = [updatedAnn.height, updatedAnn.width];
          imageAnns[index] = updatedAnn;
          updated[currentImageName] = imageAnns;
        }
        
        return updated;
      });
    }
  };

  const handleMouseMove = (e) => {
    if ((handMode || activeTool === 'move') && e.buttons === 1) {
      // Move canvas
      const newX = e.clientX - startPosition.current.x;
      const newY = e.clientY - startPosition.current.y;
      setOffset({ x: newX, y: newY });
    } else if ((activeTool === 'crop' || activeTool === 'rotate') && selectedAnnotation && e.buttons === 1) {
      // Handle crop/rotate operation
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - offset.x) / zoomLevel;
      const y = (e.clientY - rect.top - offset.y) / zoomLevel;
      
      // Update the selected annotation based on the tool
      updateSelectedAnnotation(x, y);
    } else if (isDrawingBox && boundingBox.startX !== 0 && e.buttons === 1) {
      if (!canvasRef.current || !imageRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const img = imageRef.current;
      
      // Calculate the displayed image dimensions (maintaining aspect ratio)
      const imgAspect = img.naturalWidth / img.naturalHeight;
      let displayWidth = img.width;
      let displayHeight = img.height;
      
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        displayWidth = Math.min(img.width, img.height * imgAspect);
        displayHeight = displayWidth / imgAspect;
      }
      
      // Calculate the position of the image within the canvas
      const imgX = (img.width - displayWidth) / 2;
      const imgY = (img.height - displayHeight) / 2;
      
      // Convert screen coordinates to canvas coordinates
      const canvasX = (e.clientX - rect.left - offset.x) / zoomLevel;
      const canvasY = (e.clientY - rect.top - offset.y) / zoomLevel;
      
      // Convert canvas coordinates to image coordinates
      let x = (canvasX - imgX) * (img.naturalWidth / displayWidth);
      let y = (canvasY - imgY) * (img.naturalHeight / displayHeight);
      
      // Constrain coordinates to image boundaries
      x = Math.max(0, Math.min(x, img.naturalWidth));
      y = Math.max(0, Math.min(y, img.naturalHeight));
      
      setBoundingBox(prev => ({ ...prev, endX: x, endY: y }));
    }
  };

  const updateSelectedAnnotation = (x, y) => {
    if (!selectedAnnotation || !images[imageIndex]) return;
    
    const currentImageName = images[imageIndex].split('/').pop();
    setAnnotations(prev => {
      const updated = { ...prev };
      const imageAnns = [...(updated[currentImageName] || [])];
      
      // Find and update the annotation
      const index = imageAnns.findIndex(a => 
        a.x_center === selectedAnnotation.x_center && 
        a.y_center === selectedAnnotation.y_center &&
        a.width === selectedAnnotation.width &&
        a.height === selectedAnnotation.height
      );
      
      if (index !== -1) {
        const updatedAnn = { ...imageAnns[index] };
        
        if (activeTool === 'crop') {
          // Update crop dimensions
          const img = imageRef.current;
          if (!img) return updated;
          
          const imgWidth = img.naturalWidth;
          const imgHeight = img.naturalHeight;
          
          // Calculate new dimensions based on mouse position
          const centerX = x / imgWidth;
          const centerY = y / imgHeight;
          
          updatedAnn.x_center = Math.max(0, Math.min(1, centerX));
          updatedAnn.y_center = Math.max(0, Math.min(1, centerY));
          
          // You can add more sophisticated crop logic here
          
        } else if (activeTool === 'rotate') {
          // Update rotation (example: simple 90-degree rotation)
          [updatedAnn.width, updatedAnn.height] = [updatedAnn.height, updatedAnn.width];
        }
        
        imageAnns[index] = updatedAnn;
        updated[currentImageName] = imageAnns;
        setSelectedAnnotation(updatedAnn);
      }
      
      return updated;
    });
  };

  const handleMouseUp = () => {
    if (isDrawingBox && boundingBox.startX !== 0 && selectedClass) {
      const img = imageRef.current;
      const origWidth = img.naturalWidth;
      const origHeight = img.naturalHeight;

      const x1 = Math.min(boundingBox.startX, boundingBox.endX);
      const y1 = Math.min(boundingBox.startY, boundingBox.endY);
      const w = Math.abs(boundingBox.endX - boundingBox.startX);
      const h = Math.abs(boundingBox.endY - boundingBox.startY);

      // Convert to original coordinates
      const scaleX = origWidth / img.width;
      const scaleY = origHeight / img.height;

      const origX1 = x1 * scaleX;
      const origY1 = y1 * scaleY;
      const origW = w * scaleX;
      const origH = h * scaleY;

      // YOLO format
      const x_center = (origX1 + origW / 2) / origWidth;
      const y_center = (origY1 + origH / 2) / origHeight;
      const width_norm = origW / origWidth;
      const height_norm = origH / origHeight;

      const newBox = {
        class: selectedClass,
        x_center,
        y_center,
        width: width_norm,
        height: height_norm
      };

      const currentImage = images[imageIndex].split('/').pop();
      setAnnotations(prev => ({
        ...prev,
        [currentImage]: [...(prev[currentImage] || []), newBox]
      }));

      // Voice announcement when a box is drawn - speak class name only once
      if (voiceAssist) {
        const speakClass = selectedClass || 'box';
        speak(speakClass);
      }

      setBoundingBox({ startX: 0, startY: 0, endX: 0, endY: 0 });
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoomLevel(prevZoom => Math.max(0.1, Math.min(prevZoom + delta, 5)));
  };

  const fitToScreen = () => {
    if (imageRef.current && canvasRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      const { width: canvasWidth, height: canvasHeight } = canvasRef.current.getBoundingClientRect();

      const scaleX = canvasWidth / naturalWidth;
      const scaleY = canvasHeight / naturalHeight;
      const newZoom = Math.min(scaleX, scaleY) * 0.9;
      setZoomLevel(newZoom);

      const newOffsetX = (canvasWidth - (naturalWidth * newZoom)) / 2;
      const newOffsetY = (canvasHeight - (naturalHeight * newZoom)) / 2;
      setOffset({ x: newOffsetX, y: newOffsetY });
    }
  };

  const handleToolSelect = (tool) => {
    // Toggle tool off if clicking the same tool
    const newTool = activeTool === tool ? null : tool;
    setActiveTool(newTool);
    
    // Special handling for draw tool
    if (newTool === 'draw') {
      setIsDrawingBox(true);
      setHandMode(false);
    } else {
      setIsDrawingBox(false);
      setHandMode(newTool === 'move');
    }
    
    // Reset selection when switching tools or deselecting
    setSelectedAnnotation(null);
    
    // If deselecting all tools, ensure drawing mode is also turned off
    if (!newTool) {
      setIsDrawingBox(false);
      setHandMode(false);
    }
  };

  const toggleDrawingMode = () => {
    if (isDrawingBox) {
      setIsDrawingBox(false);
      setActiveTool(null);
    } else {
      handleToolSelect('draw');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Handle deleting a single annotation (bounding box) by index for the current image
  const handleDeleteClass = (className, annIndex) => {
    const currentImage = images[imageIndex]?.split('/')?.pop();
    if (!currentImage || typeof annIndex !== 'number') return;

    setAnnotations(prevAnnotations => {
      const updated = { ...prevAnnotations };
      const imageAnns = Array.isArray(updated[currentImage]) ? [...updated[currentImage]] : [];

      if (annIndex < 0 || annIndex >= imageAnns.length) {
        return updated; // index out of range; no-op
      }

      // Safety: ensure the targeted annotation matches the class shown in the UI
      if (imageAnns[annIndex]?.class !== className) {
        return updated; // mismatch; no-op
      }

      imageAnns.splice(annIndex, 1);

      if (imageAnns.length > 0) {
        updated[currentImage] = imageAnns;
      } else {
        delete updated[currentImage];
      }
      return updated;
    });
  };

  const saveYOLOFile = async () => {
    const currentImagePath = images[imageIndex];
    const imageName = currentImagePath.split('/').pop();
    const projectName = currentImagePath.split('/').reverse()[1]; // Get project name from path
    
    const annotationsForImage = annotations[imageName] || [];
    
    if (annotationsForImage.length === 0) {
      alert('No annotations to save.');
      return;
    }
    
    try {
      // Prepare annotations in YOLO format
      const formattedAnnotations = annotationsForImage.map(ann => ({
        class_id: classes.findIndex(c => c.name === ann.class),
        x_center: parseFloat(ann.x_center) || 0,
        y_center: parseFloat(ann.y_center) || 0,
        width: parseFloat(ann.width) || 0,
        height: parseFloat(ann.height) || 0
      }));
      
      // Send to server
      const response = await fetch(apiUrl('/save-annotations'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_name: projectName,
          image_name: imageName,
          annotations: formattedAnnotations
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert(`Annotations saved successfully at: ${result.path}`);
      } else {
        throw new Error(result.error || 'Failed to save annotations');
      }
    } catch (error) {
      console.error('Error saving annotations:', error);
      alert(`Error saving annotations: ${error.message}`);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: isDarkMode ? '#1a202c' : '#f7fafc',
      paddingTop: (labelAssist && selectedClass) ? '40px' : '0',
      color: isDarkMode ? '#fff' : '#000'
    },
    mainCanvas: {
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      cursor: handMode ? 'grab' : (isDrawingBox ? 'crosshair' : 'default')
    },
    canvasContainer: { 
      width: '100%', 
      height: '100%', 
      position: 'relative', 
      overflow: 'hidden',
      filter: labelValidation ? 'none' : 'none' // This is where we'll apply the grayscale filter if needed for the container
    },
    canvasBackground: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: `radial-gradient(circle at 50% 50%, ${isDarkMode ? '#333' : '#d0d0d0'} 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      opacity: 0.3,
    },
    imageAndAnnotationWrapper: {
      position: 'absolute',
      top: offset.y,
      left: offset.x,
      transform: `scale(${zoomLevel})`,
      transformOrigin: 'top left',
    },
    imageStyle: { 
      filter: labelValidation ? `contrast(${contrast}%) brightness(${brightness}%) grayscale(100%)` : `contrast(${contrast}%) brightness(${brightness}%)`, 
      display: 'block' 
    },
    bottomToolbar: {
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: isDarkMode ? 'rgba(40, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      borderRadius: '8px',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      zIndex: 10
    },
    toolbarButton: {
      background: 'transparent',
      border: 'none',
      color: isDarkMode ? '#fff' : '#000',
      cursor: 'pointer',
      padding: '6px'
    }
  };

  // Compute ordered classes for the current image based on annotation sequence
  const displayClasses = useMemo(() => {
    if (!images || images.length === 0) return [];
    const currentImageName = images[imageIndex]?.split('/')?.pop();
    const anns = (currentImageName && annotations[currentImageName]) ? annotations[currentImageName] : [];

    if (!Array.isArray(anns) || anns.length === 0) return [];

    // Count annotations per class
    const counts = anns.reduce((acc, a) => {
      const cname = a?.class;
      if (!cname) return acc;
      acc[cname] = (acc[cname] || 0) + 1;
      return acc;
    }, {});

    // Get unique class names in reverse chronological order (latest drawn first)
    const orderedUnique = [];
    for (let i = anns.length - 1; i >= 0; i--) {
      const cname = anns[i]?.class;
      if (cname && !orderedUnique.includes(cname)) {
        orderedUnique.push(cname);
      }
    }

    // Build display class objects with count and fallback color/visibility if missing
    const result = orderedUnique.map((name) => {
      const base = classes.find(c => c?.name === name) || {};
      return {
        name,
        color: base.color || '#1f6feb',
        visible: typeof base.visible === 'boolean' ? base.visible : true,
        count: counts[name] || 0,
      };
    });

    return result;
  }, [annotations, images, imageIndex, classes]);

  // Build a repeated list: one card per annotation, allowing duplicates for the same class
  const repeatedDisplayClasses = useMemo(() => {
    if (!images || images.length === 0) return [];
    const currentImageName = images[imageIndex]?.split('/')?.pop();
    const anns = (currentImageName && annotations[currentImageName]) ? annotations[currentImageName] : [];

    if (!Array.isArray(anns) || anns.length === 0) return [];

    // Newest annotations first; also include original index for precise deletion
    return anns.slice().reverse().map((a, rIdx) => {
      const originalIndex = anns.length - 1 - rIdx;
      const base = classes.find(c => c?.name === a?.class) || {};
      return {
        name: a?.class || 'Unnamed',
        color: base.color || '#1f6feb',
        visible: typeof base.visible === 'boolean' ? base.visible : true,
        count: 1,
        annIndex: originalIndex,
      };
    });
  }, [annotations, images, imageIndex, classes]);

  // Get current class details
  const currentClass = useMemo(() => {
    return classes.find(cls => cls.name === selectedClass) || {};
  }, [selectedClass, classes]);

  return (
    <div style={styles.container}>
      {/* Bounding Box Info Strip - Only shown when Label Assistant is enabled */}
      {labelAssist && selectedClass && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: isLeftSidebarCollapsed ? '60px' : `${leftSidebarWidth}px`,
          right: isRightSidebarCollapsed ? '60px' : `${rightSidebarWidth}px`,
          height: '40px',
          backgroundColor: currentClass.color || (isDarkMode ? '#2d3748' : '#f7fafc'),
          color: getContrastColor(currentClass.color || (isDarkMode ? '#2d3748' : '#f7fafc')),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          borderBottom: `1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'}`,
          transition: 'all 0.2s ease',
          padding: '0 20px',
          fontWeight: '500',
          fontSize: '14px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              margin: 0,
              lineHeight: '1.2',
              fontSize: 'clamp(12px, 2vw, 18px)',
              fontWeight: '900',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              WebkitTextStroke: '0.5px #000',
              background: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 20px,
                ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'} 20px,
                ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'} 40px
              )`,
              color: '#000000',
              textShadow: '1px 1px 3px rgba(255,255,255,1), -1px -1px 3px rgba(255,255,255,1), 1px -1px 3px rgba(255,255,255,1), -1px 1px 3px rgba(255,255,255,1)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              padding: '0',
              margin: 0,
              boxSizing: 'border-box',
              position: 'relative'
            }}
            title={selectedClass}  // Show full class name on hover
          >
            <span className="scrolling-text">
              {`${selectedClass} `.repeat(200).trim()}
            </span>
          </div>
        </div>
      )}

      <LeftDrawer
        isLeftSidebarCollapsed={isLeftSidebarCollapsed}
        setIsLeftSidebarCollapsed={setIsLeftSidebarCollapsed}
        leftSidebarWidth={leftSidebarWidth}
        handleSaveSettings={handleSaveSettings}
        isDrawingBox={isDrawingBox}
        toggleDrawingMode={toggleDrawingMode}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        classes={classes}
        isValidationDrawerOpen={isValidationDrawerOpen}
        setIsValidationDrawerOpen={setIsValidationDrawerOpen}
        voiceAssist={voiceAssist}
        setVoiceAssist={setVoiceAssist}
        labelAssist={labelAssist}
        setLabelAssist={setLabelAssist}
        labelValidation={labelValidation}
        setLabelValidation={setLabelValidation}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
        activeTool={activeTool}
        onToolSelect={handleToolSelect}
        onMagicClassSelect={handleMagicClassSelect}
      />

      <div
        style={styles.mainCanvas}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <div style={styles.canvasBackground} />

        <div style={styles.canvasContainer}>
          <div style={styles.imageAndAnnotationWrapper}>
            {images.length > 0 && imageIndex < images.length ? (
              <img
                src={images[imageIndex]}
                alt="Annotatable"
                style={styles.imageStyle}
                ref={imageRef}
                onLoad={fitToScreen}
              />
            ) : (
              <p>Loading images or no images found for this project.</p>
            )}

            {/* Show drawn boxes with class-specific colors */}
            {annotations[images[imageIndex]?.split('/').pop()]?.map((box, idx) => {
              // Find the class to get its color, default to a visible color if not found
              const boxClass = classes.find(c => c?.name === box.class) || {};
              // Use the class color if available, otherwise fall back to theme-appropriate colors
              const borderColor = boxClass.color || (isDarkMode ? '#FF5252' : '#FF5252'); // Default to red if no color
              // Create a slightly transparent version of the border color for the background
              const bgColor = `${borderColor}33`; // 20% opacity
              
              const boxLeft = box.x_center * imageRef.current.naturalWidth - (box.width * imageRef.current.naturalWidth) / 2;
              const boxTop = box.y_center * imageRef.current.naturalHeight - (box.height * imageRef.current.naturalHeight) / 2;
              const boxWidth = box.width * imageRef.current.naturalWidth;
              const boxHeight = box.height * imageRef.current.naturalHeight;
              
              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: boxLeft,
                    top: boxTop,
                    width: boxWidth,
                    height: boxHeight,
                    boxSizing: 'border-box',
                    pointerEvents: 'none',
                    zIndex: 10
                  }}
                >
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0, // Position at top of the bounding box
                      left: 0, // Align with left of the bounding box
                      backgroundColor: borderColor, // Match bounding box color
                      color: '#ffffff', // White text for better contrast
                      fontSize: '14px', // Fixed font size
                      transform: `translateY(-100%) scale(${1/zoomLevel})`, // Move up and scale inversely with zoom
                      transformOrigin: 'left bottom', // Scale from bottom-left corner
                      fontWeight: 'bold',
                      padding: '4px 10px', // Slightly reduced padding
                      whiteSpace: 'nowrap',
                      overflow: 'visible',
                      textOverflow: 'ellipsis',
                      textAlign: 'left',
                      borderRadius: '4px 4px 0 0', // Rounded top corners only
                      textShadow: '1px 1px 2px rgba(0,0,0,0.9)', // Subtle shadow
                      pointerEvents: 'none',
                      zIndex: 12, // Ensure it's above the box
                      border: `2px solid ${borderColor}`,
                      borderBottom: 'none', // No bottom border to avoid overlap
                      minWidth: '60px',
                      boxShadow: '0 -2px 4px rgba(0,0,0,0.2)', // Shadow below the label
                      lineHeight: '1.2', // Better text vertical alignment
                    }}
                  >
                    {box.class || 'Unnamed'}
                  </div>
                  <div
                    data-bounding-box
                    style={{
                      position: 'absolute',
                      border: `2px solid ${borderColor}`,
                      width: '100%',
                      height: '100%',
                      boxSizing: 'border-box',
                      backgroundColor: (!isDrawingBox && (hoveredBox === idx || selectedBox === idx)) || (highlightedAnnIndex === idx) ? `${borderColor}33` : 'transparent',
                      boxShadow: `0 0 0 1px ${isDarkMode ? '#000' : '#fff'}`,
                      borderRadius: '2px',
                      transition: 'all 0.2s ease',
                      zIndex: 10,
                      cursor: isDrawingBox ? 'crosshair' : 'pointer',
                      pointerEvents: isDrawingBox ? 'none' : 'auto'
                    }}
                    onMouseEnter={() => !isDrawingBox && setHoveredBox(idx)}
                    onMouseLeave={() => !isDrawingBox && setHoveredBox(null)}
                    onClick={(e) => {
                      if (!isDrawingBox) {
                        e.stopPropagation();
                        setSelectedBox(selectedBox === idx ? null : idx);
                      }
                    }}
                  />
                  {labelValidation && box.class === selectedClass && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        pointerEvents: 'none',
                        zIndex: 9
                      }}
                    >
                      <img
                        src={images[imageIndex]}
                        alt="color-overlay"
                        style={{
                          position: 'absolute',
                          left: -boxLeft,
                          top: -boxTop,
                          width: imageRef.current?.naturalWidth || 'auto',
                          height: imageRef.current?.naturalHeight || 'auto',
                          filter: 'none'
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Temporary drawing box */}
            {isDrawingBox && boundingBox.startX !== 0 && (
              <div style={{
                position: 'absolute',
                border: `2px dashed ${isDarkMode ? '#fff' : '#000'}`,
                left: Math.min(boundingBox.startX, boundingBox.endX),
                top: Math.min(boundingBox.startY, boundingBox.endY),
                width: Math.abs(boundingBox.endX - boundingBox.startX),
                height: Math.abs(boundingBox.endY - boundingBox.startY),
              }} />
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div 
          className="bottom-toolbar"
          style={styles.bottomToolbar}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button 
            className="toolbar-button"
            style={styles.toolbarButton} 
            onClick={(e) => { 
              e.stopPropagation();
              setHandMode(p => !p); 
              setIsDrawingBox(false); 
            }}
          >
            <Hand size={20} />
          </button>
          <button 
            className="toolbar-button"
            style={styles.toolbarButton} 
            onClick={(e) => {
              e.stopPropagation();
              setZoomLevel(z => Math.min(z + 0.1, 5));
            }}
          >
            <ZoomIn size={20} />
          </button>
          <button 
            className="toolbar-button"
            style={styles.toolbarButton} 
            onClick={(e) => {
              e.stopPropagation();
              setZoomLevel(z => Math.max(z - 0.1, 0.1));
            }}
          >
            <ZoomOut size={20} />
          </button>
          <button 
            className="toolbar-button"
            style={styles.toolbarButton} 
            onClick={(e) => {
              e.stopPropagation();
              fitToScreen();
            }}
          >
            🖥️
          </button>
          <button 
            className="toolbar-button"
            style={styles.toolbarButton} 
            onClick={(e) => {
              e.stopPropagation();
              saveYOLOFile();
            }}
          >
            💾
          </button>
          <button 
            className="toolbar-button"
            style={styles.toolbarButton} 
            onClick={(e) => {
              e.stopPropagation();
              setImageIndex(prev => (images.length > 0 ? (prev - 1 + images.length) % images.length : 0));
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <button 
            className="toolbar-button"
            style={styles.toolbarButton} 
            onClick={(e) => {
              e.stopPropagation();
              setImageIndex(prev => (images.length > 0 ? (prev + 1) % images.length : 0));
            }}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Happy Emoji Overlay */}
      {showHappyEmoji && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '200px',
          zIndex: 1000,
          pointerEvents: 'none',
          animation: 'bounce 0.5s ease infinite alternate'
        }}>
          😊
        </div>
      )}

      <style jsx global>{`
        @keyframes bounce {
          from { transform: translate(-50%, -50%) scale(1); }
          to { transform: translate(-50%, -50%) scale(1.2); }
        }
        @keyframes scrollText {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .scrolling-text {
          display: inline-block;
          padding-left: 100%;
          white-space: nowrap;
          animation: scrollText 15s linear infinite;
          min-width: 100%;
          text-align: center;
          letter-spacing: 0;
          margin: 0 -0.2em;
        }
        @media (hover: hover) {
          .scrolling-text:hover {
            animation-play-state: paused;
          }
        }
      `}</style>

      <RightDrawer
        isRightSidebarCollapsed={isRightSidebarCollapsed}
        setIsRightSidebarCollapsed={setIsRightSidebarCollapsed}
        rightSidebarWidth={rightSidebarWidth}
        imageIndex={imageIndex}
        images={images}
        classes={repeatedDisplayClasses}
        boundingBox={boundingBox}
        isDarkMode={isDarkMode}
        onDeleteClass={handleDeleteClass}
        onClassItemClick={(annIdx) => setHighlightedAnnIndex(prev => prev === annIdx ? null : annIdx)}
        activeAnnIndex={highlightedAnnIndex}
        contrast={contrast}
        setContrast={setContrast}
        brightness={brightness}
        setBrightness={setBrightness}
      />
    </div>
  );
};

export default FigmaStyleAnnotationTool;
