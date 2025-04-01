import React from 'react';
import { Card, CardContent, Typography, Box, Icon } from '@mui/material';

interface AdminCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

export const AdminCard: React.FC<AdminCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card sx={{ height: '100%', backgroundColor: 'background.paper' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ color: 'text.primary' }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${color}20`,
            }}
          >
            <Icon sx={{ color }}>AA{icon}</Icon>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
