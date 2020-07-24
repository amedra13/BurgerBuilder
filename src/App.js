import React ,{Component} from 'react';
import {connect} from 'react-redux';
import Layout from './components/hoc/Layout/Layout'
import BurgerBuilder from './components/containers/BurgerBuilder/BurgerBuilder';
import Checkout from './components/containers/Checkout/Checkout';
import Orders from './components/containers/Orders/Orders';
import Auth from './components/containers/Auth/Auth';
import Logout from './components/containers/Auth/Logout/logout';
import { Route , Switch} from 'react-router-dom';
import * as actions from './store/actions/index';

class App extends Component{

  componentDidMount() {
    this.props.onTryAutoSignUp()
  }

  render() {

    return (
      <div>
        <Layout>
          <Switch>
            <Route path='/checkout' component={Checkout} />
            <Route path='/orders' component={Orders} />
            <Route path='/auth' component={Auth} />
            <Route path='/logout' component={Logout} />
            <Route path='/' exact component={BurgerBuilder}/>
          </Switch>
        </Layout>
      </div>
    );
  } 
    

}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignUp: () => dispatch(actions.authCheckState())
  }
}

export default connect(null,mapDispatchToProps)(App);
