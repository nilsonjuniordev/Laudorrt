import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';

const HomeBanner = () => {
  const images = ['/images/bg1-1.jpg', '/images/bg2-2.jpg', '/images/bg3-3.jpg'];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000); // Muda a imagem a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: -1,
      }}
    >
      {images.map((image, index) => (
        <Box
          key={image}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: index === currentImageIndex ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        >
          <Image
            src={image}
            alt={`Background ${index + 1}`}
            layout="fill"
            objectFit="cover"
            priority={index === 0}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default HomeBanner;
