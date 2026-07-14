import React, { useEffect, useState, useMemo } from 'react';
import { apiUrl } from '../api';

const MagicModal = ({ open = false, isDarkMode = false, onClose = () => {}, classes = [], onSelectClass = () => {} }) => {
  const [modelClasses, setModelClasses] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [error, setError] = useState('');

  // Fetch available models
  useEffect(() => {
    let isMounted = true;
    const fetchModels = async () => {
      if (!open) return;
      setLoadingModels(true);
      try {
        const resp = await fetch(apiUrl('/available-models'));
        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(data?.error || resp.statusText);
        }
        if (isMounted && data.models && data.models.length > 0) {
          setAvailableModels(data.models);
          setSelectedModel(data.default || data.models[0]);
        }
      } catch (e) {
        if (isMounted) setError(e.message || 'Failed to load models');
      } finally {
        if (isMounted) setLoadingModels(false);
      }
    };
    fetchModels();
    return () => { isMounted = false; };
  }, [open]);

  // Fetch classes for selected model
  useEffect(() => {
    let isMounted = true;
    const fetchModelClasses = async () => {
      if (!open || !selectedModel) return;
      setLoading(true);
      setError('');
      try {
        const resp = await fetch(apiUrl(`/model-classes${selectedModel ? `?model=${encodeURIComponent(selectedModel)}` : ''}`));
        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(data?.error || resp.statusText);
        }
        if (isMounted) setModelClasses(Array.isArray(data.classes) ? data.classes : []);
      } catch (e) {
        if (isMounted) setError(e.message || 'Failed to load model classes');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchModelClasses();
    return () => { isMounted = false; };
  }, [open, selectedModel]);

  // Handle model selection change
  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  // Build display list: prefer model classes; attach colors from provided classes when names match
  const displayItems = useMemo(() => {
    const src = (modelClasses && modelClasses.length > 0) ? modelClasses : [];
    if (src.length === 0) return [];
    return src.map((name) => {
      const match = classes.find(c => (c?.name || '').toLowerCase() === String(name).toLowerCase());
      return { name, color: match?.color };
    });
  }, [modelClasses, classes]);
  if (!open) return null;

  const styles = {
    overlay: {
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
    modal: {
      width: 'min(480px, 90vw)',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#e5e7eb' : '#111827',
      borderRadius: '12px',
      border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
      boxShadow: isDarkMode ? '0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.15)',
      overflow: 'hidden',
      maxHeight: '80vh',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      fontWeight: 600,
      borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
      fontSize: '16px',
      background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)'
    },
    body: {
      padding: '16px',
      fontSize: '14px',
      color: isDarkMode ? '#d1d5db' : '#374151',
      overflowY: 'auto',
      flex: 1
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontWeight: 500,
      fontSize: '14px',
      color: isDarkMode ? '#e5e7eb' : '#374151'
    },
    select: {
      width: '100%',
      padding: '8px 12px',
      borderRadius: '6px',
      border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#f3f4f6' : '#111827',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      ':focus': {
        borderColor: isDarkMode ? '#60a5fa' : '#3b82f6',
        boxShadow: `0 0 0 2px ${isDarkMode ? 'rgba(96, 165, 250, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
      },
      ':disabled': {
        opacity: 0.7,
        cursor: 'not-allowed'
      }
    },
    section: {
      marginTop: '16px',
      borderTop: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
      paddingTop: '16px'
    },
    sectionTitle: {
      fontSize: '14px',
      fontWeight: 500,
      marginBottom: '12px',
      color: isDarkMode ? '#e5e7eb' : '#374151'
    },
    closeBtn: {
      border: 'none',
      background: 'transparent',
      color: isDarkMode ? '#9ca3af' : '#6b7280',
      cursor: 'pointer',
      fontSize: '24px',
      lineHeight: 1,
      padding: '4px 8px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ':hover': {
        background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
      }
    },
    classList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      marginTop: '12px',
      maxHeight: '300px',
      overflowY: 'auto',
      paddingRight: '4px',
      '::-webkit-scrollbar': {
        width: '6px',
      },
      '::-webkit-scrollbar-track': {
        background: isDarkMode ? '#374151' : '#f1f1f1',
        borderRadius: '3px',
      },
      '::-webkit-scrollbar-thumb': {
        background: isDarkMode ? '#6b7280' : '#9ca3af',
        borderRadius: '3px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: isDarkMode ? '#9ca3af' : '#6b7280',
      }
    },
    classItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px 12px',
      borderRadius: '8px',
      background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      userSelect: 'none',
      ':hover': {
        background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
      }
    },
    colorBadge: (color) => ({
      width: '16px',
      height: '16px',
      borderRadius: '4px',
      backgroundColor: color,
      marginRight: '12px',
      flexShrink: 0,
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`
    }),
    className: {
      flex: 1,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: '14px'
    },
    emptyState: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: isDarkMode ? '#9ca3af' : '#6b7280',
      fontStyle: 'italic',
      textAlign: 'center',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <span>AI Annotation</span>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div style={styles.body}>
          {/* Model Selection Dropdown */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Select Model:</label>
            <select 
              style={styles.select}
              value={selectedModel}
              onChange={handleModelChange}
              disabled={loading || loadingModels || availableModels.length === 0}
            >
              {loadingModels ? (
                <option>Loading models...</option>
              ) : availableModels.length > 0 ? (
                availableModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))
              ) : (
                <option>No models available</option>
              )}
            </select>
          </div>

          {/* Class List */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Available Classes:</div>
            {loading ? (
              <div style={styles.emptyState}>Loading classes for {selectedModel}…</div>
            ) : error ? (
              <div style={styles.emptyState}>Error: {error}</div>
            ) : displayItems.length > 0 ? (
              <div style={styles.classList}>
                {displayItems.map((item, index) => (
                  <div
                    key={index}
                    style={styles.classItem}
                    onClick={() => onSelectClass(item.name, selectedModel)}
                    title={`Auto-annotate ${item.name}`}
                  >
                    <div style={styles.colorBadge(item.color || '#666')} />
                    <span style={styles.className}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>No classes found in the selected model.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagicModal;
