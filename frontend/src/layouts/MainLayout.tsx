import type { ReactNode } from 'react';
import BaseLayout from './BaseLayout';
import { Sidebar } from '@/components/Sidebar';
import Footer from '@/components/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <BaseLayout>
      <div className="main-container">
        <div style={{ display: 'flex', flex: 1, minHeight: '100vh' }}>
          <Sidebar />
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>{children}</div>
            <Footer />
          </main>
        </div>
      </div>
    </BaseLayout>
  );
};

export default MainLayout;
