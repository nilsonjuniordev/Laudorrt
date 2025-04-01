import React, { useState } from 'react';
import { Box, ImageList, ImageListItem, Typography, Modal, IconButton } from '@mui/material';
import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface ProjetoProps {
  images: Array<{
    img: string;
    title: string;
  }>;
}

export const getStaticProps: GetStaticProps = async () => {
  const imagesDirectory = path.join(process.cwd(), 'public/images/projetos');

  // Criar pasta se não existir
  try {
    if (!fs.existsSync(imagesDirectory)) {
      fs.mkdirSync(imagesDirectory, { recursive: true });
    }

    const imageFiles = fs.readdirSync(imagesDirectory);

    const images = imageFiles
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
      })
      .map(file => ({
        img: `/images/projetos/${file}`,
        title: path
          .parse(file)
          .name.split('-')
          .join(' ')
          .replace(/\b\w/g, l => l.toUpperCase()),
      }));

    return {
      props: {
        images,
      },
    };
  } catch (error) {
    console.error('Erro ao ler diretório de imagens:', error);
    return {
      props: {
        images: [],
      },
    };
  }
};

const Projetos: React.FC<ProjetoProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleOpen = (index: number) => setSelectedImage(index);
  const handleClose = () => setSelectedImage(null);

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
    }
  };

  if (images.length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
          padding: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" color="white">
          Nenhuma imagem encontrada
        </Typography>
        <Typography variant="body1" color="white">
          Adicione suas imagens na pasta: /public/images/projetos
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          overflow: 'auto',
          mt: 10,
          backgroundColor: 'transparent',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(161, 111, 111, 0.3)',
            '&:hover': {
              background: 'rgba(161, 111, 111, 0.5)',
            },
          },
        }}
      >
        <ImageList
          variant="masonry"
          gap={3}
          sx={{
            columnCount: {
              xs: '1 !important',
              sm: '2 !important',
              md: '3 !important',
              lg: '4 !important',
            },
            '-moz-column-count': {
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
            },
            '-webkit-column-count': {
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
            },
          }}
        >
          {images.map((item, index) => (
            <ImageListItem
              key={item.img}
              onClick={() => handleOpen(index)}
              sx={{
                overflow: 'hidden',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.01)',
                  transition: 'transform 0.3s ease-in-out',
                  '& .overlay': {
                    opacity: 1,
                  },
                },
              }}
            >
              <img
                src={item.img}
                alt={item.title}
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '0px',
                }}
              />
              <Box
                className="overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(161, 111, 111, 0.5)',
                  backdropFilter: 'blur(3px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease-in-out',
                  color: 'white',
                  fontFamily: 'Montserrat',
                  fontSize: '1.2rem',
                  fontWeight: 300,
                  letterSpacing: '0.1em',
                  textAlign: 'center',
                  padding: 2,
                }}
              >
                {item.title}
              </Box>
            </ImageListItem>
          ))}
        </ImageList>
      </Box>

      {/* Lightbox Modal */}
      <Modal
        open={selectedImage !== null}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(5px)',
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            outline: 'none',
          }}
        >
          {selectedImage !== null && (
            <>
              <img
                src={images[selectedImage].img}
                alt={images[selectedImage].title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '90vh',
                  objectFit: 'contain',
                }}
              />
              <IconButton
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  top: -40,
                  right: -40,
                  color: 'white',
                }}
              >
                <CloseIcon />
              </IconButton>
              <IconButton
                onClick={handlePrevious}
                sx={{
                  position: 'absolute',
                  left: -60,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  backgroundColor: 'rgba(161, 111, 111, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(161, 111, 111, 0.5)',
                  },
                }}
              >
                <NavigateBeforeIcon />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  right: -60,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  backgroundColor: 'rgba(161, 111, 111, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(161, 111, 111, 0.5)',
                  },
                }}
              >
                <NavigateNextIcon />
              </IconButton>
              <Typography
                variant="h6"
                sx={{
                  position: 'absolute',
                  bottom: -40,
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  color: 'white',
                }}
              >
                {images[selectedImage].title}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default Projetos;
