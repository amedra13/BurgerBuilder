import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

	const ings = useSelector((state) => state.burgerBuilder.ingredients);
	const price = useSelector((state) => state.burgerBuilder.totalPrice);
	const error = useSelector((state) => state.burgerBuilder.error);
	const isAuthenticated = useSelector((state) => state.auth.token !== null);

	const dispatch = useDispatch();
	const onIngredientAdded = (ingName) =>
		dispatch(actions.addIngredient(ingName));
	const onIngredientRemoved = (ingName) =>
		dispatch(actions.removeIngredient(ingName));
	const onInitIngredients = useCallback(
		() => dispatch(actions.initIngredients()),
		[dispatch]
	);
	const onInitPurchase = () => dispatch(actions.purchaseInit());
	const onSetAuthRedirectPath = (path) =>
		dispatch(actions.setAuthRedirectPath(path));

	useEffect(() => {
		onInitIngredients();
	}, [onInitIngredients]);

	const updatePurchaseState = (ingredients) => {
		const sum = Object.values(ingredients).reduce((sum, cur) => sum + cur, 0);

		return sum > 0;
	};

	const purchaseHandler = () => {
		if (isAuthenticated) {
			setPurchasing(true);
		} else {
			onSetAuthRedirectPath('/checkout');
			props.history.push('/auth');
		}
	};

	const purchaseCancel = () => {
		setPurchasing(false);
	};

	const purchaseContinueHandler = () => {
		onInitPurchase();
		props.history.push('/checkout');
	};

	const purchaseCanceledHandler = () => {
		setPurchasing(false);
	};

	let disabledInfo = {
		...ings,
	};

	for (let key in disabledInfo) {
		disabledInfo[key] = disabledInfo[key] <= 0;
	}

	let orderSummary = null;
	let burger = error ? <p>Ingredients cant be loaded </p> : <Spinner />;

	if (ings) {
		burger = (
			<>
				<Burger ingredients={ings} />
				<BuildControls
					ingredientAdded={onIngredientAdded}
					ingredientRemoved={onIngredientRemoved}
					disabled={disabledInfo}
					purchasable={updatePurchaseState(ings)}
					price={price}
					isAuth={isAuthenticated}
					ordered={purchaseHandler}
				/>
			</>
		);
		orderSummary = (
			<OrderSummary
				purchaseContinued={purchaseContinueHandler}
				purchaseCanceled={purchaseCanceledHandler}
				ingredients={ings}
				price={price}
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

export default withErrorHandler(BurgerBuilder, axios);
