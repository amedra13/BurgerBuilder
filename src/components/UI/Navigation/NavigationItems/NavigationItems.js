import React from 'react';
import classes from './NavigationItems.module.css';
import NavItem from './NavItem/NavItem';

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <NavItem link ='/' exact> Burger Builder</NavItem>
        <NavItem link ='/orders'>Orders</NavItem>
        <NavItem link ='/auth'>Authenticate</NavItem>
    </ul>
);

export default navigationItems;