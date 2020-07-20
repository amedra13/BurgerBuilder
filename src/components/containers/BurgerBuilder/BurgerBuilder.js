import React, {Component} from 'react';
import {connect} from 'react-redux';
import Burger from '../../Burger/Burger';
import BuildControls from '../../Burger/BuildControls/BuildControls';
import Modal from '../../UI/Modal/Modal';
import axios from '../../../axios-orders';
import OrderSummary from '../../Burger/OrderSummary/OrderSummary';
import Spinner from '../../UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as burgerBuilderActions from '../../../store/actions/index'


class BurgerBuilder extends Component{
    state = {
        loading: false,
    }

    componentDidMount() {
        this.props.onInitIngredients();
    }

    updatePurchaseState (ingredients) {

        const sum = Object.values(ingredients).reduce( (sum, cur) => sum + cur, 0);

        return sum > 0;
        
    }

    purchaseHandler =() => {
        this.setState({purchasing: true})
    }

    purchaseCancel = () => {
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
    }

    purchaseCanceledHandler = () => {
        this.setState({purchasing: false})
    }

    render(){
        let disabledInfo = {
            ...this.props.ings
        }

        for(let key in disabledInfo){
            disabledInfo[key]  = (disabledInfo[key] <= 0);
        }

        let orderSummary = null;
        let burger = this.props.error? <p>Ingredients cant be loaded </p> : <Spinner />


        if(this.props.ings) {
            burger = (
                <>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls 
                        ingredientAdded={this.props.onIngredientAdded} 
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchasable= {this.updatePurchaseState(this.props.ings)}
                        price={this.props.price}
                        ordered={this.purchaseHandler}/>
                </>
            )
            orderSummary =  <OrderSummary 
            purchaseContinued={this.purchaseContinueHandler}
            purchaseCanceled ={this.purchaseCanceledHandler}
            ingredients={this.props.ings} price={this.props.price}/>;

        }

        return (
            <>
                
                <Modal show ={this.state.purchasing} modalClosed={this.purchaseCancel}>
                    {orderSummary}
                </Modal>
                {burger}
            </>

        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice,
        error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));