import React, { useState } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, ListItemButton, Collapse, Box, Tooltip } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import SavingsIcon from '@mui/icons-material/Savings';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import GoalIcon from '@mui/icons-material/EmojiEvents';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpIcon from '@mui/icons-material/Help';

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.contrastText,
    },
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const [openSubMenu, setOpenSubMenu] = useState('');

  const handleSubMenuClick = (text) => {
    setOpenSubMenu(openSubMenu === text ? '' : text);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Accounts', icon: <AccountBalanceIcon />, path: '/accounts' },
    { text: 'Transactions', icon: <ReceiptIcon />, path: '/transactions' },
    { text: 'Budgets', icon: <AssessmentIcon />, path: '/budgets' },
    { text: 'Savings Goals', icon: <GoalIcon />, path: '/savings-goals' },
    { text: 'Investments', icon: <ShowChartIcon />, path: '/investments' },
    {
      text: 'Reports',
      icon: <AssessmentIcon />,
      subItems: [
        { text: 'Monthly Report', path: '/reports/monthly' },
        { text: 'Annual Summary', path: '/reports/annual' },
      ],
    },
    { text: 'Credit Cards', icon: <CreditCardIcon />, path: '/credit-cards' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Help & Support', icon: <HelpIcon />, path: '/help' },
  ];

  return (
    <List component="nav" sx={{ p: 2 }}>
      {menuItems.map((item) => (
        <Box key={item.text} sx={{ mb: 1 }}>
          <Tooltip title={isOpen ? '' : item.text} placement="right" arrow>
            <StyledListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path || (item.subItems && item.subItems.some(subItem => location.pathname === subItem.path))}
              onClick={item.subItems ? () => handleSubMenuClick(item.text) : undefined}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              {isOpen && <ListItemText primary={item.text} />}
              {item.subItems && isOpen && (openSubMenu === item.text ? <ExpandLess /> : <ExpandMore />)}
            </StyledListItemButton>
          </Tooltip>
          {item.subItems && (
            <Collapse in={openSubMenu === item.text && isOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.subItems.map((subItem) => (
                  <Tooltip key={subItem.text} title={isOpen ? '' : subItem.text} placement="right" arrow>
                    <StyledListItemButton
                      component={Link}
                      to={subItem.path}
                      selected={location.pathname === subItem.path}
                      sx={{ pl: 4 }}
                    >
                      {isOpen && <ListItemText primary={subItem.text} />}
                    </StyledListItemButton>
                  </Tooltip>
                ))}
              </List>
            </Collapse>
          )}
        </Box>
      ))}
    </List>
  );
};

export default Sidebar;