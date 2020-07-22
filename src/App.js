import React ,{Component} from 'react';
import Layout from './components/hoc/Layout/Layout'
import BurgerBuilder from './components/containers/BurgerBuilder/BurgerBuilder';
import Checkout from './components/containers/Checkout/Checkout';
import Orders from './components/containers/Orders/Orders';
import Auth from './components/containers/Auth/Auth';
import { Route , Switch} from 'react-router-dom';

class App extends Component{


  render() {

    return (
      <div>
        <Layout>
          <Switch>
            <Route path='/checkout' component={Checkout} />
            <Route path='/orders' component={Orders} />
            <Route path='/auth' component={Auth} />
            <Route path='/' exact component={BurgerBuilder}/>
          </Switch>
        </Layout>
      </div>
    );
  } 
    

}

export default App;
