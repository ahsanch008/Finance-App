import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, ListItemButton, Collapse } from '@mui/material';
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
  '&.Mui-selected': {
    backgroundColor: theme.palette.action.selected,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
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
      path: '/dashboard',
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
    <List>
      {menuItems.map((item) => (
        <React.Fragment key={item.text}>
          <StyledListItemButton
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={item.subItems ? handleClick : undefined}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
            {item.subItems && (open ? <ExpandLess /> : <ExpandMore />)}
          </StyledListItemButton>
          {item.subItems && (
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.subItems.map((subItem) => (
                  <StyledListItemButton
                    key={subItem.text}
                    component={Link}
                    to={subItem.path}
                    selected={location.pathname === subItem.path}
                    sx={{ pl: 4 }}
                  >
                    <ListItemText primary={subItem.text} />
                  </StyledListItemButton>
                ))}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

export default Sidebar;