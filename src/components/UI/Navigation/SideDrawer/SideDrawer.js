import React from 'react';
import Logo from '../../../Logo/Logo';
import Navigation from '../NavigationItems/NavigationItems';
import classes from './SideDrawer.module.css';
import Backdrop from '../../Backdrop/Backdrop';


const sideDrawer = (props) => {
    let attachedClasses = [classes.SideDrawer, classes.Close];
    if(props.open){
        attachedClasses = [classes.SideDrawer, classes.Open];
    }
    
    return(
        <>
        <Backdrop show={props.open} clicked={props.closed}/>
        <div className ={attachedClasses.join(' ')} onClick={props.closed}>
           <div className={classes.Logo}>
                <Logo />
           </div>
            <nav>
                <Navigation isAuthenticated={props.isAuth}/>
            </nav>

        </div>
        </>
        
    );
}

export default sideDrawer;