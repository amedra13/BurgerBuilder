import React ,{Component} from 'react';
import {connect} from 'react-redux';
import Layout from './components/hoc/Layout/Layout'
import BurgerBuilder from './components/containers/BurgerBuilder/BurgerBuilder';
import Checkout from './components/containers/Checkout/Checkout';
import Orders from './components/containers/Orders/Orders';
import Auth from './components/containers/Auth/Auth';
import Logout from './components/containers/Auth/Logout/logout';
import { Route , Switch, withRouter, Redirect} from 'react-router-dom';
import * as actions from './store/actions/index';

class App extends Component{

  componentDidMount() {
    this.props.onTryAutoSignUp()
  }


  render() {

    let routes = (
      <Switch>
        <Route path='/auth' component={Auth} />
        <Route path='/' exact component={BurgerBuilder}/>
        <Redirect to='/' />
      </Switch>
    )

    if(this.props.isAuthenticated){
      routes = (
        <Switch>
          <Route path='/checkout' component={Checkout} />
          <Route path='/orders' component={Orders} />
          <Route path='/auth' component={Auth} />
          <Route path='/logout' component={Logout} />
          <Route path='/' exact component={BurgerBuilder}/>
          <Redirect to='/' />
        </Switch>
      )
    }

    return (
      <div>
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  } 
    

}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignUp: () => dispatch(actions.authCheckState())
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));
