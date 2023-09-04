import { ToastContainer } from 'react-toastify';
import './App.css';
import Login from './Components/login/login';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <ToastContainer/>

      <Login />
    </div>
  );
}

export default App;
