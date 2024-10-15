import Routers from "./routers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./components/redux/store";
import { Provider } from "react-redux";
import { AppContextProvider } from './components/AppContext';

function App() {
  return (
    // Context Providers Wrapping the App
    <Provider store={store}> {/* Redux Provider */}
      <AppContextProvider> {/* Custom Context */}
        <Routers /> {/* App Routing */}
        {/* ToastContainer should be placed within providers to ensure it works across the app */}
        <ToastContainer 
          position="top-right" 
          autoClose={5000} 
          hideProgressBar={false} 
          newestOnTop={false} 
          closeOnClick 
          rtl={false} 
          pauseOnFocusLoss 
          draggable 
          pauseOnHover 
        />
      </AppContextProvider>
    </Provider>
  );
}

export default App;
