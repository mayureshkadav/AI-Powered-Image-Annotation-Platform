import React from 'react';
import { useNavigate } from 'react-router-dom';

// Icons as SVG components
const AlertIcon = ({ styles }) => (
  <svg style={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const ClockFilledIcon = ({ styles }) => (
  <svg style={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon = ({ styles }) => (
  <svg style={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CalendarIcon = ({ styles }) => (
  <svg style={styles.detailIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = ({ styles }) => (
  <svg style={styles.detailIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const ImageIcon = ({ styles }) => (
  <svg style={styles.detailIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = ({ styles }) => (
  <svg style={styles.detailIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EyeIcon = ({ styles }) => (
  <svg style={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const PlayIcon = ({ styles }) => (
  <svg style={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a2 2 0 002 2h2a2 2 0 002-2v-4M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1" />
  </svg>
);

const MoreIcon = ({ styles }) => (
  <svg style={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
  </svg>
);

const CheckCircleIcon = ({ styles }) => (
  <svg style={styles.detailIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const getStatusIcon = (status, styles) => {
  switch (status) {
    case 'assigned': return <AlertIcon styles={styles} />;
    case 'inProgress': return <ClockFilledIcon styles={styles} />;
    case 'completed': return <CheckIcon styles={styles} />;
    default: return null;
  }
};

const ProjectCard = ({ project, styles }) => {
  const navigate = useNavigate();
  
  const handleAnnotationClick = () => {
    navigate('/annotate_dash');
  };
  
  return (
    <div 
      style={styles.projectCard}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, styles.projectCardHover);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, styles.projectCard);
      }}
    >
      <div style={styles.projectHeader}>
        <h3 style={styles.projectTitle}>{project.title}</h3>
        <button style={styles.moreBtn}>
          <MoreIcon styles={styles} />
        </button>
      </div>
      
      <div style={styles.projectBody}>
        <div style={styles.detailRow}>
          <CalendarIcon styles={styles} />
          Uploaded {project.uploadDate}
        </div>
      
      {project.assignee && (
        <div style={styles.detailRow}>
          <UsersIcon styles={styles} />
          {project.assignee}
        </div>
      )}

      {project.status === 'completed' && project.completedDate && (
        <div style={styles.detailRow}>
          <CheckCircleIcon styles={styles} />
          Completed {project.completedDate}
        </div>
      )}

      <div style={styles.detailsGrid}>
        <div style={styles.detailRow}>
          <ImageIcon styles={styles} />
          {project.images} images
        </div>
        <div style={styles.detailRow}>
          <ClockIcon styles={styles} />
          {project.timeEstimate}
        </div>
      </div>

      {(project.status === 'inProgress' || project.status === 'completed') && (
        <div style={styles.progressSection}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>Progress</span>
            <span style={styles.progressValue}>{project.progress}%</span>
          </div>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${project.progress}%`,
                background: project.status === 'completed' 
                  ? 'linear-gradient(to right, #10b981, #059669)'
                  : 'linear-gradient(to right, #1f2937, #374151)'
              }}
            />
          </div>
          <div style={styles.progressStats}>
            <span>{project.completed} done</span>
            <span>{project.remaining} remaining</span>
          </div>
        </div>
      )}
    </div>

    <div style={styles.projectFooter}>
      <span style={{
        ...styles.statusBadge,
        ...(project.status === 'assigned' ? styles.assignedStatus :
            project.status === 'inProgress' ? styles.inProgressStatus :
            styles.completedStatus)
      }}>
        {getStatusIcon(project.status, styles)}
        {project.status === 'inProgress' ? 'In Progress' : 
         project.status.charAt(0).toUpperCase() + project.status.slice(1)}
      </span>

      <div style={styles.actionButtons}>
        <button 
          style={styles.previewBtn}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f3f4f6';
            e.target.style.color = '#1f2937';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#6b7280';
          }}
        >
          <EyeIcon styles={styles} />
          Preview
        </button>
        <button 
          style={{
            ...styles.startBtn,
            ...(project.status === 'completed' && {
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
            })
          }}
          onClick={handleAnnotationClick}
          onMouseEnter={(e) => {
            if (project.status === 'completed') {
              e.target.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
              e.target.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)';
            } else {
              e.target.style.background = 'linear-gradient(135deg, #111827 0%, #1f2937 100%)';
              e.target.style.boxShadow = '0 4px 8px rgba(31, 41, 55, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (project.status === 'completed') {
              e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
              e.target.style.boxShadow = '0 2px 4px rgba(16, 185, 129, 0.2)';
            } else {
              e.target.style.background = 'linear-gradient(135deg, #1f2937 0%, #374151 100%)';
              e.target.style.boxShadow = '0 2px 4px rgba(31, 41, 55, 0.2)';
            }
          }}
        >
          <PlayIcon styles={styles} />
          {project.status === 'completed' ? 'View Details' : 
           project.status === 'inProgress' ? 'Continue' : 'Start'} 
          {project.status === 'completed' ? '' : ' Annotation'}
        </button>
      </div>
    </div>
  </div>
);
};

export default ProjectCard;
