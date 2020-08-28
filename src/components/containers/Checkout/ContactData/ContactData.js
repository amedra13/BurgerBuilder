import React, { useState } from 'react';
import { connect } from 'react-redux';
import classes from './ContactData.module.css';
import Button from '../../../UI/Button/Button';
import axios from '../../../../axios-orders';
import Spinner from '../../../UI/Spinner/Spinner';
import Input from '../../../UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../../store/actions/index';
import { updateObject, checkValidity } from '../../../../shared/utility';

const ContactData = (props) => {
	const [formIsValid, setFormIsValid] = useState(false);
	const [orderForm, setOrderForm] = useState({
		name: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Your Name',
			},
			value: '',
			validation: {
				required: true,
			},
			valid: false,
			touched: false,
		},
		street: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Street',
			},
			value: '',
			validation: {
				required: true,
			},
			valid: false,
			touched: false,
		},
		zipCode: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'ZIPCODE',
			},
			value: '',
			validation: {
				required: true,
				minLength: 5,
				maxLength: 5,
			},
			valid: false,
			touched: false,
		},
		country: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Country',
			},
			value: '',
			validation: {
				required: true,
			},
			valid: false,
			touched: false,
		},
		email: {
			elementType: 'input',
			elementConfig: {
				type: 'email',
				placeholder: 'Your E-Mail',
			},
			value: '',
			validation: {
				required: true,
			},
			valid: false,
			touched: false,
		},
		deliveryMethod: {
			elementType: 'select',
			elementConfig: {
				options: [
					{ value: 'fastest', displayValue: 'Fastest' },
					{ value: 'cheapest', displayValue: 'Cheapest' },
				],
			},
			validation: {},
			value: 'fastest',
			valid: true,
		},
	});

	const orderHandler = (event) => {
		event.preventDefault();

		const formData = {};
		for (let formElementIdentifier in orderForm) {
			formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
		}
		const order = {
			ingredients: props.ings,
			price: props.price.toFixed(2),
			orderData: formData,
			userId: props.userId,
		};

		props.onOrderBurger(order, props.token);
	};

	const inputChangedHandler = (event, inputIdentifyer) => {
		const updatedFormElement = updateObject(orderForm[inputIdentifyer], {
			value: event.target.value,
			valid: checkValidity(
				event.target.value,
				orderForm[inputIdentifyer].validation
			),
			touch: true,
		});
		const updatedOrderForm = updateObject(orderForm, {
			[inputIdentifyer]: updatedFormElement,
		});

		updatedOrderForm[inputIdentifyer] = updatedFormElement;
		let formisValid = true;
		for (let inputIdentifier in updatedOrderForm) {
			formisValid = updatedOrderForm[inputIdentifier].valid && formisValid;
		}
		setOrderForm(updatedOrderForm);
		setFormIsValid(formIsValid);
	};

	const formElementArray = [];
	for (let key in orderForm) {
		formElementArray.push({
			id: key,
			config: orderForm[key],
		});
	}

	let form = (
		<form onSubmit={orderHandler}>
			{formElementArray.map((formElement) => (
				<Input
					key={formElement.id}
					elementType={formElement.config.elementType}
					elementConfig={formElement.config.elementConfig}
					value={formElement.config.value}
					invalid={!formElement.config.valid}
					shouldValidate={formElement.config.validation}
					touched={formElement.config.touched}
					changed={(event) => inputChangedHandler(event, formElement.id)}
				/>
			))}
			<Button btnType="Success" disabled={!formIsValid} clicked={orderHandler}>
				ORDER
			</Button>
		</form>
	);

	if (props.loading) {
		form = <Spinner />;
	}

	return (
		<div className={classes.ContactData}>
			<h4>Enter your Contact Data</h4>
			{form}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		loading: state.order.loading,
		token: state.auth.token,
		userId: state.auth.userId,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onOrderBurger: (orderData, token) =>
			dispatch(actions.purchaseBurger(orderData, token)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(ContactData, axios));
