import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-fe5cc.firebaseio.com/'
})

export default instance;