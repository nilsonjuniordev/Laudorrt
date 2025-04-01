// pages/_app.tsx
import type { AppProps } from 'next/app';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Head from 'next/head';
import theme from '../src/theme';
import '../styles/global.css';
import MainLayout from '../src/layouts/MainLayout';
import AdminLayout from '../src/layouts/AdminLayout';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  const getLayout = (page: React.ReactElement) => {
    if (isAdminRoute) {
      return <AdminLayout>{page}</AdminLayout>;
    }
    return <MainLayout>{page}</MainLayout>;
  };

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500&family=Italiana&display=swap"
          rel="stylesheet"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </>
  );
}
