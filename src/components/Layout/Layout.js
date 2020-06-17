import React from 'react';
import classes from './Layout.module.css';

const Layout = (props) => (
    <>
        <div className={classes.Content}> Toolbar, SideBar, BackDrop</div>
        <main>
            {props.children}
        </main>

    </>  
 );


export default Layout;