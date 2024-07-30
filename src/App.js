// import Layout from './components/Layout'
// import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Routers  from './routers'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { UserProvider } from './UserContext';

function App() {
    
    return (
    <UserProvider>
 <Routers/>
    </UserProvider>
     
    )
}

export default App
