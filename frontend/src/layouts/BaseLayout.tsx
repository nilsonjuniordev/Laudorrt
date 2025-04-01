import { ReactNode } from 'react';

interface BaseLayoutProps {
  children: ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return <div className="base-container">{children}</div>;
}
