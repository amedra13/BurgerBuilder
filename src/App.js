import React, { useEffect, Suspense } from 'react';
import { connect } from 'react-redux';

import Layout from './components/hoc/Layout/Layout';
import BurgerBuilder from './components/containers/BurgerBuilder/BurgerBuilder';
import Logout from './components/containers/Auth/Logout/logout';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import * as actions from './store/actions/index';

const Checkout = React.lazy(() => {
	return import('./components/containers/Checkout/Checkout');
});
const Orders = React.lazy(() => {
	return import('./components/containers/Orders/Orders');
});
const Auth = React.lazy(() => {
	return import('./components/containers/Auth/Auth');
});

const App = (props) => {
	const { onTryAutoSignUp } = props;

	useEffect(() => {
		onTryAutoSignUp();
	}, [onTryAutoSignUp]);

	let routes = (
		<Switch>
			<Route path="/auth" render={(props) => <Auth {...props} />} />
			<Route path="/" exact component={BurgerBuilder} />
			<Redirect to="/" />
		</Switch>
	);

	if (props.isAuthenticated) {
		routes = (
			<Switch>
				<Route path="/checkout" render={(props) => <Checkout {...props} />} />
				<Route path="/orders" render={(props) => <Orders {...props} />} />
				<Route path="/auth" render={(props) => <Auth {...props} />} />
				<Route path="/logout" component={Logout} />
				<Route path="/" exact component={BurgerBuilder} />
				<Redirect to="/" />
			</Switch>
		);
	}

	return (
		<div>
			<Layout>
				<Suspense fallback={<p>Loading....</p>}>{routes}</Suspense>
			</Layout>
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
