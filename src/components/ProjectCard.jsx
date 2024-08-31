import FolderIcon from '@mui/icons-material/Folder';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Box, Button, Divider, Typography } from '@mui/material';
import React from 'react';

const ProjectCard = ({ user, commit, applications, programStatus, onToggleProgram }) => {
  const BlinkingDot = ({ color }) => (
    <Box display="flex" alignItems="center">
      <Box
        sx={{
          width: 10,
          height: 10,
          backgroundColor: color,
          borderRadius: '50%',
          marginRight: 1,
          animation: 'blink 1.5s infinite',
          '@keyframes blink': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0 },
            '100%': { opacity: 1 },
          }
        }}
      />
      <Typography variant="body2" sx={{ color }}>
        {programStatus === 'online' ? 'Online' : 'Offline'}
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        border: '1px solid #E0E0E0',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ marginRight: '16px' }}>
            <FolderIcon fontSize="large" sx={{ color: '#00b0ff' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: '600', color: '#333' }}>
              {user.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#757575' }}>
              {user.email}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ marginBottom: '8px' }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
            {commit}
          </Typography>
          <Typography variant="caption" sx={{ color: '#757575' }}>
            Miner Key
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem sx={{ marginX: '8px', height: '24px' }} />
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
            {applications}
          </Typography>
          <Typography variant="caption" sx={{ color: '#757575' }}>
            Jobs Completed
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem sx={{ marginX: '8px', height: '24px' }} />
        <Box sx={{ textAlign: 'left' }}>
          <BlinkingDot color={programStatus === 'online' ? 'green' : 'red'} />
          <Typography variant="caption" sx={{ color: '#757575' }}>
            Program Status
          </Typography>
        </Box>
        <Box sx={{ marginLeft: 'auto' }}>
          <Button
            variant="outlined"
            startIcon={<PowerSettingsNewIcon />}
            onClick={onToggleProgram}
            sx={{
              borderColor: programStatus === 'online' ? '#FF1744' : '#00C49F',
              color: programStatus === 'online' ? '#FF1744' : '#00C49F',
              textTransform: 'none',
              fontWeight: '500',
            }}
          >
            {programStatus === 'online' ? 'Stop Program' : 'Start Program'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectCard;
