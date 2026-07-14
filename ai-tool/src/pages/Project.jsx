import React, { useState, useEffect } from 'react';

import {
  Search,
  Plus,
  LogOut,
  MoreHorizontal,
  Calendar,
  Eye,
  Users,
  Clock,
  Filter,
  Grid3X3,
  List,
  Star,
  Archive,
  Download,
  Share2,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusCard from '../components/StatusCard';
import ProjectCards from '../components/ProjectCards';
import { apiUrl } from '../api';


const Project = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'active', 'completed', 'archived'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'name', 'progress'
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);
  const navigate = useNavigate();
  const [viewType, setViewType] = useState('grid'); // toggle grid or list


  // Mock project data with enhanced details
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(apiUrl('/get-projects'));
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter and sort projects

  const handleDeleteProject = async (projectName) => {
    try {
      const encoded = encodeURIComponent(projectName);
      const response = await fetch(apiUrl(`/delete-project/${encoded}`), {
        method: 'DELETE',
      });
      if (response.ok) {
        setProjects(projects.filter((p) => p.projectName !== projectName));
      } else {
        console.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleLogout = () => {
    // Clear auth data (adjust to your auth setup)
    localStorage.removeItem('authToken'); // or sessionStorage.clear(), etc.

    // Navigate to landing page
    navigate('/'); // or '/landing' depending on your route
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ padding: '16px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Left Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'black',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sparkles style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'black', margin: 0 }}>Projects</h1>
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative' }}>
                <Search style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  color: '#9ca3af'
                }} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    paddingLeft: '40px',
                    paddingRight: '16px',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    width: '320px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    fontSize: '14px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'black';
                    e.target.style.boxShadow = '0 0 0 2px rgba(0, 0, 0, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    border: '1px solid',
                    borderColor: showFilters ? 'black' : '#e5e7eb',
                    backgroundColor: showFilters ? 'black' : 'white',
                    color: showFilters ? 'white' : 'black',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  <Filter style={{ width: '16px', height: '16px' }} />
                  <span>Filter</span>
                </button>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  <Calendar style={{ width: '16px', height: '16px' }} />
                  <span>Date Edited</span>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* View Toggle */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '4px'
              }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: viewMode === 'grid' ? 'black' : 'transparent',
                    color: viewMode === 'grid' ? 'white' : '#6b7280',
                    cursor: 'pointer'
                  }}
                >
                  <Grid3X3 style={{ width: '16px', height: '16px' }} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: viewMode === 'list' ? 'black' : 'transparent',
                    color: viewMode === 'list' ? 'white' : '#6b7280',
                    cursor: 'pointer'
                  }}
                >
                  <List style={{ width: '16px', height: '16px' }} />
                </button>
              </div>

              {/* User Avatar */}
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#e5e7eb',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>U</span>
              </div>

              {/* New Project Button */}


              {/* Button to trigger modal */}
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'black',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#374151';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'black';
                  e.target.style.transform = 'scale(1)';
                }}
                onClick={() => navigate('/CreateProject')}
              >
                <Plus style={{ width: '16px', height: '16px' }} />
                <span>New Project</span>
              </button>

              {/* Logout Button */}
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid #e5e7eb',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
                onClick={handleLogout}
              >
                <LogOut style={{ width: '16px', height: '16px' }} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
          

          {/* Filter Bar */}
          {showFilters && (
            <div style={{
              marginTop: '16px',
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Status:</span>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    style={{
                      padding: '4px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  >
                    <option value="all">All Projects</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      padding: '4px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  >
                    <option value="date">Last Modified</option>
                    <option value="name">Name</option>
                    <option value="progress">Progress</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main >
        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <StatusCard
            icon={<BarChart3 />}
            bgColor="#dbeafe"
            iconColor="#2563eb"
            value={projects.length}
            title="Total Projects"
            subtitle="All time"
          />
          <StatusCard
            icon={<CheckCircle2 />}
            bgColor="#dcfce7"
            iconColor="#16a34a"
            value={projects.filter(p => p.status === 'active').length}
            title="Active Projects"
            subtitle="Currently running"
          />
          <StatusCard
            icon={<Eye />}
            bgColor="#e0e7ff"
            iconColor="#7c3aed"
            value={projects.reduce((sum, p) => sum + p.images, 0).toLocaleString()}
            title="Total Images"
            subtitle="Processed"
          />
          <StatusCard
            icon={<Users />}
            bgColor="#fed7aa"
            iconColor="#ea580c"
            value={Math.max(...projects.map(p => p.collaborators))}
            title="Team Members"
            subtitle="Active collaborators"
          />
        </div>

        <div style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Your Projects</h2>
          {loading ? (
            <p>Loading projects...</p>
          ) : projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>No projects created yet.</p>
              <button 
                onClick={() => navigate('/create-project')}
                style={{
                  marginTop: '16px',
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Create Project
              </button>
            </div>
          ) : (
            <ProjectCards
              projects={projects.map(p => ({
                id: p.projectName, // Using projectName as a unique id
                title: p.projectName,
                description: p.description || 'No description',
                images: p.imageCount || 0,
                dateCreated: p.createdAt,
                status: p.status || 'active',
                progress: p.progress || 0, // Default value
                models: p.models || 0, // Default value
                accuracy: p.accuracy || 'N/A', // Default value
                dateModified: p.dateModified || p.createdAt, // Default value
                collaborators: p.collaborators || 1, // Default value
                color: p.color || 'from-blue-500 to-cyan-500' // Default value
              }))}
              viewType={viewType}
              hoveredProject={hoveredProject}
              setHoveredProject={setHoveredProject}
              onDelete={handleDeleteProject}
            />
          )}
        </div>

      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};


export default Project;
