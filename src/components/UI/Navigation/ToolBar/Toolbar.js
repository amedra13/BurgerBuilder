import React from 'react';
import classes from'./Toolbar.module.css';
import Logo from '../../../Logo/Logo';
import Navigation from '../NavigationItems/NavigationItems'


const toolbar = (props) => (
    <header className={classes.Toolbar}>
        <div>Menu</div>
        <div className={classes.Logo}>
            <Logo />
        </div>
        <nav className={classes.DesktopOnly}>
            <Navigation />
        </nav>
    </header>
);

export default toolbar;