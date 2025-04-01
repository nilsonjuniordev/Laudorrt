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

    // Se não tiver máscara, apenas passa o valor adiante
    if (!mask) {
      if (onChange) {
        onChange(e);
      }
      return;
    }

    // Aplica máscara apenas para campos específicos
    const digits = newValue.replace(/\D/g, '');

    switch (mask) {
      case 'cep':
        newValue = digits.slice(0, 8).replace(/(\d{5})(\d{0,3})/, '$1-$2');
        break;
      case 'telefone':
        newValue = digits.slice(0, 11).replace(/(\d{2})(\d{0,5})(\d{0,4})/, '($1) $2-$3');
        break;
      case 'cpf':
        newValue = digits.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        break;
      case 'cnpj':
        newValue = digits
          .slice(0, 14)
          .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        break;
      default:
        newValue = digits;
    }

    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          name: e.target.name,
          value: newValue,
        },
      });
    }
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      value={value || ''}
      onChange={handleChange}
      inputProps={{
        maxLength:
          mask === 'cep'
            ? 9
            : mask === 'telefone'
              ? 15
              : mask === 'cpf'
                ? 14
                : mask === 'cnpj'
                  ? 18
                  : undefined,
      }}
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
