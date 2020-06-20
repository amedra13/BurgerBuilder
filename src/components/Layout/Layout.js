import React from 'react';
import classes from './Layout.module.css';
import Toolbar from '../UI/Navigation/ToolBar/Toolbar';
import SideDrawer from '../UI/Navigation/SideDrawer/SideDrawer';

const Layout = (props) => (
    <>
        <Toolbar />
        <SideDrawer />
        <main className={classes.Content}>
            {props.children}
        </main>

    </>  
 );


export default Layout;