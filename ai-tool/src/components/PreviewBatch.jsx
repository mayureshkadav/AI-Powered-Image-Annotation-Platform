import React, { useState } from 'react';

const PreviewBatch = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [batchName] = useState('Uploaded on 07/27/25 at 11:22 pm');

  // Sample data for demonstration
  const sampleImages = [
    { 
      name: 'Mayuresh_30_05_2025_Dataset_HR.jpg', 
      size: '2.4 MB', 
      type: 'JPG',
      url: 'https://via.placeholder.com/300x200/cccccc/808080?text=Preview+1',
      isAnnotated: true
    },
    { 
      name: 'Mayuresh_30_05_2025_Dataset_HR.jpg', 
      size: '2.1 MB', 
      type: 'JPG',
      url: 'https://via.placeholder.com/300x200/cccccc/808080?text=Preview+2',
      isAnnotated: false
    },
    { 
      name: 'Mayuresh_30_05_2025_Dataset_HR.jpg', 
      size: '1.8 MB', 
      type: 'JPG',
      url: 'https://via.placeholder.com/300x200/cccccc/808080?text=Preview+3',
      isAnnotated: true
    },
    { 
      name: 'Mayuresh_30_05_2025_Dataset_HR.jpg', 
      size: '2.2 MB', 
      type: 'JPG',
      url: 'https://via.placeholder.com/300x200/cccccc/808080?text=Preview+4',
      isAnnotated: false
    },
    { 
      name: 'Mayuresh_30_05_2025_Dataset_HR.jpg', 
      size: '1.9 MB', 
      type: 'JPG',
      url: 'https://via.placeholder.com/300x200/cccccc/808080?text=Preview+5',
      isAnnotated: true
    },
    { 
      name: 'Mayuresh_30_05_2025_Dataset_HR.jpg', 
      size: '2.0 MB', 
      type: 'JPG',
      url: 'https://via.placeholder.com/300x200/cccccc/808080?text=Preview+6',
      isAnnotated: false
    },
  ];

  const filteredImages = activeTab === 'all' 
    ? sampleImages 
    : sampleImages.filter(img => 
        activeTab === 'annotated' ? img.isAnnotated : !img.isAnnotated
      );

  const styles = {
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: '#ffffff',
      color: '#1a1a1a',
      lineHeight: '1.6'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.75rem',
      marginBottom: '2rem',
      paddingBottom: '1rem',
      borderBottom: '2px solid #e5e5e5',
      flexWrap: 'wrap'
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    backButton: {
      backgroundColor: '#000',
      color: '#fff',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontWeight: '500',
      fontSize: '0.9rem',
      transition: 'opacity 0.2s',
      '&:hover': {
        opacity: 0.9
      }
    },
    headerIcon: {
      fontSize: '1.5rem'
    },
    headerTitle: {
      fontSize: '1.75rem',
      fontWeight: '600',
      color: '#000000',
      margin: '0'
    },
    previewContainer: {
      border: '2px solid #e5e5e5',
      borderRadius: '12px',
      padding: '2rem',
      background: '#fafafa',
      marginBottom: '2rem'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    formLabel: {
      display: 'block',
      fontWeight: '600',
      color: '#000000',
      marginBottom: '0.5rem',
      fontSize: '0.95rem'
    },
    formInput: {
      width: '100%',
      maxWidth: '600px',
      padding: '0.75rem 1rem',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '1rem',
      background: '#f5f5f5',
      cursor: 'not-allowed'
    },
    tabs: {
      display: 'flex',
      borderBottom: '2px solid #e5e5e5',
      marginBottom: '2rem'
    },
    tab: {
      padding: '0.75rem 1.5rem',
      background: 'transparent',
      border: 'none',
      fontSize: '1rem',
      fontWeight: '500',
      color: '#666666',
      cursor: 'pointer',
      borderBottom: '3px solid transparent',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    tabActive: {
      color: '#000000',
      borderBottomColor: '#000000',
      fontWeight: '600'
    },
    tabBadge: {
      background: '#000000',
      color: '#ffffff',
      fontSize: '0.75rem',
      padding: '0.2rem 0.5rem',
      borderRadius: '12px',
      fontWeight: '600'
    },
    contentArea: {
      background: '#ffffff',
      border: '2px solid #e5e5e5',
      borderRadius: '12px',
      padding: '2rem',
      minHeight: '400px',
      marginBottom: '2rem'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: '1.5rem',
      marginTop: '2rem'
    },
    imageCard: {
      background: '#ffffff',
      border: '2px solid #e5e5e5',
      borderRadius: '8px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    imageCardHover: {
      borderColor: '#000000',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    imagePlaceholder: {
      width: '100%',
      height: '120px',
      background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      color: '#999999'
    },
    imageInfo: {
      padding: '1rem'
    },
    imageName: {
      fontSize: '0.85rem',
      fontWeight: '600',
      color: '#000000',
      marginBottom: '0.25rem',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    imageMeta: {
      fontSize: '0.75rem',
      color: '#666666'
    },
    actionBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '1rem',
      padding: '1.5rem 0',
      borderTop: '2px solid #e5e5e5'
    },
    stats: {
      fontSize: '0.9rem',
      color: '#666666'
    },
    annotationBadge: {
      position: 'absolute',
      top: '0.75rem',
      right: '1rem',
      backgroundColor: '#e6f7ff',
      color: '#1890ff',
      padding: '0.15rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem 1rem',
      color: '#666',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      border: '1px dashed #e0e0e0',
      gridColumn: '1 / -1'
    },
    badge: {
      display: 'inline-block',
      backgroundColor: '#f0f0f0',
      color: '#555',
      padding: '0.25rem 0.75rem',
      borderRadius: '12px',
      fontSize: '0.8rem',
      fontWeight: '500',
      marginLeft: '0.5rem'
    }
  };

  const ImageCard = ({ img, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        style={{
          ...styles.imageCard,
          ...(isHovered ? styles.imageCardHover : {}),
          animationDelay: `${index * 0.05}s`
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img 
          src={img.url} 
          alt={img.name} 
          style={{ width: '100%', height: '120px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200/f0f0f0/999999?text=No+Preview';
          }}
        />
        <div style={styles.imageInfo}>
          <div style={styles.imageName} title={img.name}>
            {img.name}
          </div>
          {img.isAnnotated && (
            <span style={styles.annotationBadge}>Annotated</span>
          )}
          <div style={styles.imageMeta}>
            <span>{img.size}</span>
            <span>{img.type}</span>
          </div>
        </div>
      </div>
    );
  };

  const Tab = ({ id, label, count }) => (
    <button 
      style={{
        ...styles.tab,
        ...(activeTab === id ? styles.tabActive : {})
      }}
      onClick={() => setActiveTab(id)}
    >
      {label}
      <span style={styles.tabBadge}>
        {count}
      </span>
    </button>
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <span style={styles.headerIcon}>👁️</span>
          <h1 style={styles.headerTitle}>Preview</h1>
        </div>
        <button 
          style={styles.backButton}
          onClick={() => window.history.back()}
        >
          ← Back
        </button>
      </header>

      <div style={styles.previewContainer}>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Batch Name:</label>
          <div style={styles.formInput}>
            {batchName}
          </div>
        </div>
      </div>

      <div style={styles.tabs}>
        <Tab 
          id="all" 
          label="All Images" 
          count={sampleImages.length} 
        />
        <Tab 
          id="annotated" 
          label="Annotated" 
          count={sampleImages.filter(img => img.isAnnotated).length} 
        />
        <Tab 
          id="non-annotated" 
          label="Non-Annotated" 
          count={sampleImages.filter(img => !img.isAnnotated).length} 
        />
      </div>

      <div style={styles.contentArea}>
        {filteredImages.length > 0 ? (
          <div style={styles.gridContainer}>
            {filteredImages.map((img, index) => (
              <ImageCard key={index} img={img} index={index} />
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p>No {activeTab === 'all' ? 'images' : activeTab} available in this batch.</p>
          </div>
        )}
      </div>

      <div style={styles.actionBar}>
        <div style={styles.stats}>
          {filteredImages.length} images in preview
        </div>
      </div>
    </div>
  );
};

export default PreviewBatch;