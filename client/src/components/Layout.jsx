import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Drawer, IconButton, useMediaQuery, Toolbar } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const drawerWidth = 240;
const collapsedDrawerWidth = 64; 

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%',
  background: theme.palette.background.default,
  width: '1519px',
}));

const ContentWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexGrow: 1,
  minHeight: 'calc(100vh - 64px)',
  overflow: 'hidden',
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open, isMobile }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    overflow: 'hidden',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: isMobile ? 0 : `-${collapsedDrawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(!isMobile);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Root>
      <CssBaseline />
      <Header open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />
      <ContentWrapper>
        <Drawer
          sx={{
            width: open ? drawerWidth : collapsedDrawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: open ? drawerWidth : collapsedDrawerWidth,
              boxSizing: 'border-box',
              backgroundColor: theme.palette.background.default,
              borderRight: `1px solid ${theme.palette.divider}`,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
          variant={isMobile ? 'temporary' : 'persistent'}
          anchor="left"
          open={isMobile ? open : true}
          onClose={handleDrawerClose}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
          <Sidebar isOpen={open} />
        </Drawer>
        <Main open={open} isMobile={isMobile}>
          <Toolbar />
          <Box sx={{ 
            height: '100%',
            padding: { xs: 1, sm: 1, md: 4 },
            display: 'flex',
            flexDirection: 'column',
          }}> 
            {children}
          </Box>
        </Main>
      </ContentWrapper>
      <Footer />
    </Root>
  );
}

export default Layout;