import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Order from '../../Order/Order';
import axios from '../../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import Spinner from '../../UI/Spinner/Spinner';

const Orders = (props) => {
	const { onFetchedOrders, token, userId } = props;

	useEffect(() => {
		onFetchedOrders(token, userId);
	}, [onFetchedOrders, token, userId]);

	let orders = <Spinner />;
	if (!props.loading) {
		orders = props.orders.map((order) => (
			<Order
				key={order.id}
				ingredients={order.ingredients}
				price={+order.price}
			/>
		));
	}
	return <div>{orders}</div>;
};

const mapStateToProps = (state) => {
	return {
		token: state.auth.token,
		orders: state.order.orders,
		loading: state.order.loading,
		userId: state.auth.userId,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		onFetchedOrders: (token, userId) =>
			dispatch(actions.fetchOrders(token, userId)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(Orders, axios));
