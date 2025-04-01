import React from 'react';
import { TextField } from '@mui/material';

type Props = {
  mask?: 'cep' | 'telefone' | 'cpf' | 'cnpj';
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  [key: string]: any;
};

export const FormField = ({ mask, value = '', onChange, ...props }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let newValue = e.target.value;

    if (mask) {
      const digits = newValue.replace(/\D/g, '');

      switch (mask) {
        case 'cep':
          if (digits.length <= 8) {
            newValue = digits.replace(/^(\d{5})(\d{0,3})/, '$1-$2').trim();
          }
          break;
        case 'telefone':
          if (digits.length <= 11) {
            newValue = digits.replace(/^(\d{2})(\d{0,5})(\d{0,4})/, '($1) $2-$3').trim();
          }
          break;
        case 'cpf':
          if (digits.length <= 11) {
            newValue = digits.replace(/^(\d{3})(\d{0,3})(\d{0,3})(\d{0,2})/, '$1.$2.$3-$4').trim();
          }
          break;
        case 'cnpj':
          if (digits.length <= 14) {
            newValue = digits
              .replace(/^(\d{2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/, '$1.$2.$3/$4-$5')
              .trim();
          }
          break;
      }
    }

    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          value: newValue,
        },
      });
    }
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      value={value}
      onChange={handleChange}
      {...props}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '& fieldset': {
            borderColor: '#CBB271',
          },
          '&:hover fieldset': {
            borderColor: '#CBB271',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#CBB271',
          },
        },
        '& .MuiInputLabel-root': {
          color: '#fff',
        },
        '& .MuiOutlinedInput-input': {
          color: '#fff',
        },
        ...props.sx,
      }}
    />
  );
};
