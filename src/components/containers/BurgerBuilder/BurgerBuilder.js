import React, {Component} from 'react';
import {connect} from 'react-redux';
import Burger from '../../Burger/Burger';
import BuildControls from '../../Burger/BuildControls/BuildControls';
import Modal from '../../UI/Modal/Modal';
import OrderSummary from '../../Burger/OrderSummary/OrderSummary';
import axios from '../../../axios-orders';
import Spinner from '../../UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../../store/actions/actions';


class BurgerBuilder extends Component{
    state = {
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
        let burger = this.state.error? <p>Ingredients cant be loaded </p> : <Spinner />


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

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName }),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));