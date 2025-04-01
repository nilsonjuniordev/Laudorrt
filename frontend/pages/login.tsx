import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Container, Box, Typography, TextField, Button, Paper, Alert, Stack } from '@mui/material';

const API_URL = '/api';

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ email: '', senha: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Verificar se já está autenticado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/admin');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const loginData = {
      email: credentials.email.trim().toLowerCase(),
      senha: credentials.senha,
    };

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      // Salvar token e dados do usuário
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      // Redirecionar para a página inicial
      router.push('/admin');
    } catch (error: any) {
      console.error('Erro completo:', error);
      setError(error.message || 'Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Laudos RRT</title>
      </Head>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container component="main" maxWidth="xs">
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
              Login
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
              <Stack spacing={2}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  value={credentials.email}
                  onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                  autoFocus
                  inputProps={{
                    autoCapitalize: 'none',
                    autoCorrect: 'off',
                  }}
                />
                <TextField
                  required
                  fullWidth
                  label="Senha"
                  type="password"
                  value={credentials.senha}
                  onChange={e => setCredentials({ ...credentials, senha: e.target.value })}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>

                <Typography variant="body2" color="text.secondary" align="center">
                  Email: admin@admin.com
                  <br />
                  Senha: admin123
                </Typography>
              </Stack>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
