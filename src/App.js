import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import asyncComponent from './components/hoc/asyncComponent/asyncComponent';
import Layout from './components/hoc/Layout/Layout';
import BurgerBuilder from './components/containers/BurgerBuilder/BurgerBuilder';
import Logout from './components/containers/Auth/Logout/logout';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import * as actions from './store/actions/index';

const asyncCheckout = asyncComponent(() => {
	return import('./components/containers/Checkout/Checkout');
});
const asyncOrders = asyncComponent(() => {
	return import('./components/containers/Orders/Orders');
});
const asyncAuth = asyncComponent(() => {
	return import('./components/containers/Auth/Auth');
});

const App = (props) => {
	useEffect(() => {
		props.onTryAutoSignUp();
	}, [props]);

	let routes = (
		<Switch>
			<Route path="/auth" component={asyncAuth} />
			<Route path="/" exact component={BurgerBuilder} />
			<Redirect to="/" />
		</Switch>
	);

	if (props.isAuthenticated) {
		routes = (
			<Switch>
				<Route path="/checkout" component={asyncCheckout} />
				<Route path="/orders" component={asyncOrders} />
				<Route path="/auth" component={asyncAuth} />
				<Route path="/logout" component={Logout} />
				<Route path="/" exact component={BurgerBuilder} />
				<Redirect to="/" />
			</Switch>
		);
	}

	return (
		<div>
			<Layout>{routes}</Layout>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.token !== null,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onTryAutoSignUp: () => dispatch(actions.authCheckState()),
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
