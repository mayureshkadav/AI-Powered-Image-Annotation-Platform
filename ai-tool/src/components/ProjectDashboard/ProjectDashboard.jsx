import React, { useState } from 'react';
import StatCard from './StatCard';
import ProjectCard from './ProjectCard';
import Header from './Header';
import FilterTabs from './FilterTabs';

const ProjectDashboard = () => {
  // State for active tab and search term
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample project data
  const projects = [
    {
      id: 1,
      title: 'Image Classification Project',
      status: 'assigned',
      uploadDate: '2 days ago',
      assignee: 'You',
      images: 120,
      timeEstimate: '4-6 hrs',
      progress: 0,
      completed: 0,
      remaining: 120
    },
    {
      id: 2,
      title: 'Object Detection Dataset',
      status: 'inProgress',
      uploadDate: '1 week ago',
      assignee: 'Team Alpha',
      images: 500,
      timeEstimate: '12-15 hrs',
      progress: 65,
      completed: 325,
      remaining: 175
    },
    {
      id: 3,
      title: 'Medical Imaging Analysis',
      status: 'completed',
      uploadDate: '3 weeks ago',
      completedDate: '2 days ago',
      assignee: 'Team Beta',
      images: 800,
      timeEstimate: '20-25 hrs',
      progress: 100,
      completed: 800,
      remaining: 0
    },
    {
      id: 4,
      title: 'Satellite Image Processing',
      status: 'assigned',
      uploadDate: '1 day ago',
      assignee: 'You',
      images: 350,
      timeEstimate: '8-10 hrs',
      progress: 0,
      completed: 0,
      remaining: 350
    }
  ];

  // Filter projects based on active tab and search term
  const filteredProjects = projects.filter(project => {
    // Filter by tab
    const tabMatch = activeTab === 'all' || project.status === activeTab;
    
    // Filter by search term
    const searchMatch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      project.assignee?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return tabMatch && searchMatch;
  });

  // Calculate stats
  const stats = {
    all: projects.length,
    assigned: projects.filter(p => p.status === 'assigned').length,
    inProgress: projects.filter(p => p.status === 'inProgress').length,
    completed: projects.filter(p => p.status === 'completed').length
  };

  // Styles object
  const styles = {
    dashboard: {
      padding: '2rem',
      backgroundColor: '#f9fafb',
      minHeight: '100vh'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#111827'
    },
    searchContainer: {
      width: '300px'
    },
    searchWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      padding: '0.5rem',
      transition: 'border-color 0.2s'
    },
    searchIcon: {
      width: '1.25rem',
      height: '1.25rem',
      color: '#9ca3af',
      marginRight: '0.5rem',
      transition: 'color 0.2s'
    },
    searchInput: {
      flex: 1,
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      fontSize: '0.875rem'
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    },
    statCard: {
      padding: '1.5rem',
      borderRadius: '0.75rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: '1px solid transparent'
    },
    statCardActive: {
      backgroundColor: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e5e7eb'
    },
    statCardInactive: {
      backgroundColor: 'white'
    },
    statValue: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '0.25rem'
    },
    statLabel: {
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    filterTabs: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '1.5rem',
      flexWrap: 'wrap'
    },
    tabButton: {
      padding: '0.5rem 1rem',
      borderRadius: '9999px',
      border: 'none',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    activeTab: {
      backgroundColor: '#1f2937',
      color: 'white'
    },
    inactiveTab: {
      backgroundColor: 'white',
      color: '#6b7280'
    },
    projectGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '1.5rem'
    },
    projectCard: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s',
      border: '1px solid #e5e7eb'
    },
    projectCardHover: {
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transform: 'translateY(-2px)'
    },
    projectHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem'
    },
    projectTitleArea: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    checkbox: {
      width: '1.25rem',
      height: '1.25rem',
      borderRadius: '0.25rem',
      border: '2px solid #d1d5db',
      cursor: 'pointer'
    },
    projectTitle: {
      margin: 0,
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#111827'
    },
    moreBtn: {
      color: '#9ca3af',
      cursor: 'pointer',
      transition: 'color 0.2s'
    },
    projectDetails: {
      marginBottom: '1.5rem'
    },
    detailRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '0.5rem'
    },
    detailIcon: {
      width: '1rem',
      height: '1rem',
      color: '#9ca3af'
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      marginTop: '1rem'
    },
    progressSection: {
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid #e5e7eb'
    },
    progressHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.5rem',
      fontSize: '0.875rem'
    },
    progressLabel: {
      color: '#6b7280'
    },
    progressValue: {
      fontWeight: '600',
      color: '#111827'
    },
    progressBar: {
      height: '0.5rem',
      backgroundColor: '#e5e7eb',
      borderRadius: '9999px',
      overflow: 'hidden',
      marginBottom: '0.5rem'
    },
    progressFill: {
      height: '100%',
      transition: 'width 0.3s'
    },
    progressStats: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.75rem',
      color: '#6b7280'
    },
    projectFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    assignedStatus: {
      backgroundColor: '#fef3c7',
      color: '#92400e'
    },
    inProgressStatus: {
      backgroundColor: '#dbeafe',
      color: '#1e40af'
    },
    completedStatus: {
      backgroundColor: '#d1fae5',
      color: '#065f46'
    },
    actionButtons: {
      display: 'flex',
      gap: '0.5rem'
    },
    previewBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
      backgroundColor: 'transparent',
      color: '#6b7280',
      fontSize: '0.875rem',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    startBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.5rem',
      border: 'none',
      backgroundColor: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
      color: 'white',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 2px 4px rgba(31, 41, 55, 0.2)'
    },
    icon: {
      width: '1rem',
      height: '1rem'
    }
  };

  return (
    <div style={styles.dashboard}>
      <Header 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        styles={styles} 
      />
      
      <div style={styles.statsContainer}>
        <StatCard 
          label="All Projects" 
          value={stats.all} 
          isActive={activeTab === 'all'} 
          onClick={() => setActiveTab('all')} 
          styles={styles} 
        />
        <StatCard 
          label="Assigned" 
          value={stats.assigned} 
          isActive={activeTab === 'assigned'} 
          onClick={() => setActiveTab('assigned')} 
          styles={styles} 
        />
        <StatCard 
          label="In Progress" 
          value={stats.inProgress} 
          isActive={activeTab === 'inProgress'} 
          onClick={() => setActiveTab('inProgress')} 
          styles={styles} 
        />
        <StatCard 
          label="Completed" 
          value={stats.completed} 
          isActive={activeTab === 'completed'} 
          onClick={() => setActiveTab('completed')} 
          styles={styles} 
        />
      </div>
      
      <FilterTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        styles={styles} 
      />
      
      <div style={styles.projectGrid}>
        {filteredProjects.map(project => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            styles={styles} 
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectDashboard;
