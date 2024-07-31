// import Layout from './components/Layout'
// import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Routers  from './routers'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
// import { UserProvider } from './UserContext';
import store from './components/redux/store';
import { Provider } from 'react-redux';

function App() {
    
    return (
    <Provider store={store}>
        <Routers/>
    </Provider>
     
    )
}

export default App
