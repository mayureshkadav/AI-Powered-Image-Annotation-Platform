// src/components/ProjectCards.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Trash2, Download, MoreHorizontal } from 'react-feather';


const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-700';
    case 'paused': return 'bg-yellow-100 text-yellow-700';
    case 'completed': return 'bg-blue-100 text-blue-700';
    case 'archived': return 'bg-gray-200 text-gray-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'active': return <span>▶️</span>;
    case 'paused': return <span>⏸️</span>;
    case 'completed': return <span>✅</span>;
    case 'archived': return <span>📦</span>;
    default: return <span>❔</span>;
  }
};

const ProjectCards = ({ projects, viewType, hoveredProject, setHoveredProject, onDelete }) => {
  const navigate = useNavigate();
  return (
    <>
      {viewType === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {projects.map((project) => (
            <div
              key={project.id}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: '0.3s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'black', margin: 0 }}>
                    {project.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{project.description}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Progress</span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{project.progress}%</span>
                </div>
                <div style={{ backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px' }}>
                  <div style={{
                    width: `${project.progress}%`,
                    height: '8px',
                    borderRadius: '9999px',
                    background: getGradient(project.color),
                    transition: 'all 0.5s'
                  }} />
                </div>
              </div>

              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '16px',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{project.images}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Images</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{project.models}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Models</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{project.accuracy}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Accuracy</div>
                </div>
              </div>

              {/* Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid #f3f4f6',
                paddingTop: '16px'
              }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <Clock size={12} color="#9ca3af" />
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>{project.dateModified}</span>
                </div>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <Users size={12} color="#9ca3af" />
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>{project.collaborators}</span>
                </div>
              </div>

              {/* Actions */}
              {hoveredProject === project.id && (
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '16px'
                }}>
                  <button style={buttonStyle} onClick={() => navigate(`/annotate_dash/${project.title}`)}>Open Project</button>
                  <IconBtn icon={<Trash2 size={16} />} onClick={() => onDelete(project.id)} />
                  <IconBtn icon={<Download size={16} />} />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* List View Here — you can add same mapping logic */
        <div>List view coming soon</div>
      )}
    </>
  );
};

const getGradient = (colorKey) => {
  switch (colorKey) {
    case 'from-blue-500 to-cyan-500': return 'linear-gradient(135deg, #3b82f6, #06b6d4)';
    case 'from-emerald-500 to-teal-500': return 'linear-gradient(135deg, #10b981, #14b8a6)';
    case 'from-purple-500 to-pink-500': return 'linear-gradient(135deg, #8b5cf6, #ec4899)';
    case 'from-orange-500 to-red-500': return 'linear-gradient(135deg, #f97316, #ef4444)';
    case 'from-green-500 to-emerald-500': return 'linear-gradient(135deg, #22c55e, #10b981)';
    default: return 'linear-gradient(135deg, #eab308, #f97316)';
  }
};

const buttonStyle = {
  flex: 1,
  backgroundColor: 'black',
  color: 'white',
  padding: '8px 12px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '500',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s'
};

const IconBtn = ({ icon, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '32px',
      height: '32px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }}
  >
    {icon}
  </button>
);

export default ProjectCards;
