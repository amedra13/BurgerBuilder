import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Burger from '../../Burger/Burger';
import BuildControls from '../../Burger/BuildControls/BuildControls';
import Modal from '../../UI/Modal/Modal';
import axios from '../../../axios-orders';
import OrderSummary from '../../Burger/OrderSummary/OrderSummary';
import Spinner from '../../UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';

const BurgerBuilder = (props) => {
	const [purchasing, setPurchasing] = useState(false);
	const { onInitIngredients } = props;

	useEffect(() => {
		onInitIngredients();
	}, [onInitIngredients]);

	const updatePurchaseState = (ingredients) => {
		const sum = Object.values(ingredients).reduce((sum, cur) => sum + cur, 0);

		return sum > 0;
	};

	const purchaseHandler = () => {
		if (props.isAuthenticated) {
			setPurchasing(true);
		} else {
			props.onSetAuthRedirectPath('/checkout');
			props.history.push('/auth');
		}
	};

	const purchaseCancel = () => {
		setPurchasing(false);
	};

	const purchaseContinueHandler = () => {
		props.onInitPurchase();
		props.history.push('/checkout');
	};

	const purchaseCanceledHandler = () => {
		setPurchasing(false);
	};

	let disabledInfo = {
		...props.ings,
	};

	for (let key in disabledInfo) {
		disabledInfo[key] = disabledInfo[key] <= 0;
	}

	let orderSummary = null;
	let burger = props.error ? <p>Ingredients cant be loaded </p> : <Spinner />;

	if (props.ings) {
		burger = (
			<>
				<Burger ingredients={props.ings} />
				<BuildControls
					ingredientAdded={props.onIngredientAdded}
					ingredientRemoved={props.onIngredientRemoved}
					disabled={disabledInfo}
					purchasable={updatePurchaseState(props.ings)}
					price={props.price}
					isAuth={props.isAuthenticated}
					ordered={purchaseHandler}
				/>
			</>
		);
		orderSummary = (
			<OrderSummary
				purchaseContinued={purchaseContinueHandler}
				purchaseCanceled={purchaseCanceledHandler}
				ingredients={props.ings}
				price={props.price}
			/>
		);
	}

	return (
		<>
			<Modal show={purchasing} modalClosed={purchaseCancel}>
				{orderSummary}
			</Modal>
			{burger}
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error,
		isAuthenticated: state.auth.token !== null,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
		onIngredientRemoved: (ingName) =>
			dispatch(actions.removeIngredient(ingName)),
		onInitIngredients: () => dispatch(actions.initIngredients()),
		onInitPurchase: () => dispatch(actions.purchaseInit()),
		onSetAuthRedirectPath: (path) =>
			dispatch(actions.setAuthRedirectPath(path)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
