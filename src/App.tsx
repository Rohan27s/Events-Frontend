import React from 'react';
import './App.css';
import Header from './Components/Header';
import Events from './pages/Events';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <div className="App">
      <Header />
      {/* <div className='toast'> */}

      <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          style={{ top:0, left: '50%', transform: 'translateX(-50%)', position:'fixed' ,zIndex: 9999 }}
        />
      {/* </div> */}
      <div className="main">
        <Events />
      </div>
    </div>
  );
}

export default App;
