import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';

interface SuccessMessageProps {
  title?: string;
  message: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ title = 'Sucesso', message }) => {
  return (
    <Box sx={{ my: 2 }}>
      <Alert severity="success">
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
};
