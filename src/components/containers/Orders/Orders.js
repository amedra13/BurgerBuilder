import React, { Component } from 'react'
import {connect} from 'react-redux';
import Order from '../../Order/Order';
import axios from '../../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import Spinner from '../../UI/Spinner/Spinner';

class Orders extends Component {

    state = {
        loading: true
    }

    componentDidMount() {
        this.props.onFetchedOrders(this.props.token);
    }
    render() {
        let orders = <Spinner />;
        if(!this.props.loading){

            orders = this.props.orders.map(order => (
                <Order 
                    key={order.id}
                    ingredients={order.ingredients}
                    price={+order.price}/>
            ))

        }
        return (
            <div>
                {orders}
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        orders: state.order.orders,
        loading: state.order.loading
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onFetchedOrders: (token) => dispatch(actions.fetchOrders(token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));