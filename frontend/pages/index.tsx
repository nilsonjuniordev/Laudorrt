// pages/index.tsx
import type { NextPage } from 'next';
import HomeBanner from '../src/components/HomeBanner';

const Home: NextPage = () => {
  return (
    <div className="content-container">
      <HomeBanner />
    </div>
  );
};

export default Home;
