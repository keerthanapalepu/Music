import React from 'react';
import {List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import { AiFillHeart, AiOutlineDownload, AiFillHome } from 'react-icons/ai';
import { HiShoppingCart } from "react-icons/hi";
import useStyles from './styles';

const sidebarItems = [
  {
    label: 'Home',
    icon: AiFillHome,
    action: 'Home'
  },
  {
    label: 'Downloads',
    icon: AiOutlineDownload,
    action: 'Downloads'
  },
  {
    label: 'Favourite',
    icon: AiFillHeart,
    action: 'Favourite'
  },
  {
    label: 'Cart',
    icon: HiShoppingCart,
    action: 'Cart'
  },
];

function SideBar({ handleButtonClick }) {
  const classes = useStyles();

  return (
    <div className={classes.divroot}>
      <List component="nav" aria-label="Main navigation">
        {sidebarItems.map((item) => (
          <ListItem button key={item.label} className={classes.listItem} onClick={() => handleButtonClick(item.action)}>
            <ListItemIcon className={classes.listItemIcon}>
              {React.createElement(item.icon)}
            </ListItemIcon>
            <ListItemText primary={item.label} className={classes.listItemText} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default SideBar;
