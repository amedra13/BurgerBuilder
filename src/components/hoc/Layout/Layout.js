import React, { useState } from 'react';
import { connect } from 'react-redux';
import classes from './Layout.module.css';
import Toolbar from '../../UI/Navigation/ToolBar/Toolbar';
import SideDrawer from '../../../components/UI/Navigation/SideDrawer/SideDrawer';

const Layout = (props) => {
	const [showSideDrawer, setShowSideDrawer] = useState(false);

	const sideDrawerCloseHandler = () => {
		setShowSideDrawer(false);
	};

	const sideDrawerToggleHandler = () => {
		setShowSideDrawer(!showSideDrawer);
	};

	return (
		<>
			<Toolbar
				isAuth={props.isAuthenticated}
				drawerToggleClicked={sideDrawerToggleHandler}
			/>
			<SideDrawer
				isAuth={props.isAuthenticated}
				open={showSideDrawer}
				closed={sideDrawerCloseHandler}
			/>
			<main className={classes.Content}>{props.children}</main>
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.token !== null,
	};
};
export default connect(mapStateToProps)(Layout);
