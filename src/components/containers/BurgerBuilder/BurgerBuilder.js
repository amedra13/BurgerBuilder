import React, {Component} from 'react';
import Burger from '../../Burger/Burger';
import BuildControls from '../../Burger/BuildControls/BuildControls';
import Modal from '../../UI/Modal/Modal';
import OrderSummary from '../../Burger/OrderSummary/OrderSummary';
import axios from '../../../axios-orders';
import Spinner from '../../UI/Spinner/Spinner';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}
class BurgerBuilder extends Component{
    state = {
        ingredients:{
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0

        },
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false
    }

    updatePurchaseState (ingredients) {

        const sum = Object.values(ingredients).reduce( (sum, cur) => sum + cur, 0);

        this.setState({purchasable: sum > 0})
        
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type]= updatedCount;

        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
        this.updatePurchaseState(updatedIngredients);

    }

    removeIngredientHandler =(type) => {
        if(this.state.ingredients[type] ===0){
            return;
        }
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount -1;
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type]= updatedCount;

        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;

        this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
        this.updatePurchaseState(updatedIngredients);

    }

    purchaseHandler =() => {
        this.setState({purchasing: true})
    }

    purchaseCancel = () => {
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () => {
        
        this.setState({loading: true})

        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice.toFixed(2),
            customer: {
                name: 'Andres Medrano',
                address: {
                    street: '242 brewster ave',
                    zipCode: '342134',
                    country: 'USA'
                },
                email: 'test@email.com'
            },

            deliveryMethod: 'fastest'

        }


        axios.post('/orders.json', order)
            .then(response =>{
                this.setState({loading: false, purchasing: false})
            })
            .catch(error =>{
                this.setState({loading: false, purchasing: false})
            });
    }

    purchaseCanceledHandler = () => {
        this.setState({purchasing: false})
    }

    render(){
        let disabledInfo = {
            ...this.state.ingredients
        }

        for(let key in disabledInfo){
            disabledInfo[key]  = (disabledInfo[key] <= 0);
        }

        let orderSummary =  <OrderSummary 
            purchaseContinued={this.purchaseContinueHandler}
            purchaseCanceled ={this.purchaseCanceledHandler}
            ingredients={this.state.ingredients} price={this.state.totalPrice}/>;

        if(this.state.loading){
            orderSummary = <Spinner />
        }


        return (
            <>
                
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls 
                    ingredientAdded={this.addIngredientHandler} 
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    purchasable= {this.state.purchasable}
                    price={this.state.totalPrice}
                    ordered={this.purchaseHandler}/>
                <Modal show ={this.state.purchasing} modalClosed={this.purchaseCancel}>
                    {orderSummary}
                </Modal>
            </>

        );
    }
}

export default BurgerBuilder;