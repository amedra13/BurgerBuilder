import React, {Component} from 'react';
import Burger from '../../Burger/Burger';
import BuildControls from '../../Burger/BuildControls/BuildControls';
import Modal from '../../UI/Modal/Modal';
import OrderSummary from '../../Burger/OrderSummary/OrderSummary';
import axios from '../../../axios-orders';
import Spinner from '../../UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}
class BurgerBuilder extends Component{
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        // axios.get('https://react-burger-fe5cc.firebaseio.com/Ingredients.json')
        //     .then(response => {
        //         this.setState({ingredients: response.data})
        //     })
        //     .catch(error =>{
        //         this.setState({error: true})
        //     })
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
        
        const queryParams= [];
        for(let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]) )
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');

        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
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

        let orderSummary = null;
        let burger = this.state.error? <p>Ingredients cant be loaded </p> : <Spinner />


        if(this.state.ingredients) {
            burger = (
                <>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                        ingredientAdded={this.addIngredientHandler} 
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable= {this.state.purchasable}
                        price={this.state.totalPrice}
                        ordered={this.purchaseHandler}/>
                </>
            )
            orderSummary =  <OrderSummary 
            purchaseContinued={this.purchaseContinueHandler}
            purchaseCanceled ={this.purchaseCanceledHandler}
            ingredients={this.state.ingredients} price={this.state.totalPrice}/>;

        }

        
        if(this.state.loading){
            orderSummary = <Spinner />
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

export default withErrorHandler(BurgerBuilder, axios);