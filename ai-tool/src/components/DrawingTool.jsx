import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SquareIcon from '@mui/icons-material/Square';
import SquareOutlinedIcon from '@mui/icons-material/SquareOutlined';

const DrawingTool = ({ isDrawing, onToggleDrawing, selectedClass, onSelectClass, classes }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 1, 
      p: 1, 
      border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
      borderRadius: 1,
      mb: 2,
      bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
    }}>
      <Tooltip title={isDrawing ? 'Stop Drawing' : 'Start Drawing'} arrow>
        <IconButton
          onClick={onToggleDrawing}
          color={isDrawing ? 'primary' : 'default'}
          variant={isDrawing ? 'contained' : 'outlined'}
          sx={{
            border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
            '&:hover': {
              bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
            }
          }}
        >
          {isDrawing ? <SquareIcon /> : <SquareOutlinedIcon />}
        </IconButton>
      </Tooltip>

      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
        {Object.entries(classes).map(([key, { name, color }]) => (
          <Box
            key={key}
            onClick={() => onSelectClass(key)}
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: selectedClass === key ? 600 : 400,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: selectedClass === key ? `${color}33` : 'transparent',
              border: `1px solid ${selectedClass === key ? color : 'transparent'}`,
              color: selectedClass === key ? 
                (isDarkMode ? '#fff' : '#000') : 
                (isDarkMode ? '#aaa' : '#666'),
              '&:hover': {
                bgcolor: `${color}22`,
                borderColor: color,
              },
            }}
          >
            <Box sx={{ 
              width: 12, 
              height: 12, 
              bgcolor: color, 
              borderRadius: '2px',
              border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`
            }} />
            {name}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DrawingTool;
