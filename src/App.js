import React ,{Component} from 'react';
import Layout from './components/hoc/Layout/Layout'
import BurgerBuilder from './components/containers/BurgerBuilder/BurgerBuilder';
import Checkout from './components/containers/Checkout/Checkout';
class App extends Component{


  render() {

    return (
      <div>
        <Layout>
          <BurgerBuilder /> 
          <Checkout />
        </Layout>
      </div>
    );
  } 
    

}

export default App;
