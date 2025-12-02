import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './components/Home';
import EditorPage from './components/EditorPage';
import GettingStarted from './components/GettingStarted';
import Navbar from './components/Navbar';
import Login from './components/Login';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
    <div>
      <Toaster  position='top-center'></Toaster>
    </div>
    <Navbar />
    <Routes>
     <Route path='/login' element={ <Login /> } />
     <Route path='/' element={ <Home /> } />
     <Route path='/getting-started' element={ <GettingStarted /> } />
     <Route path='/editor/:roomId' element={ <EditorPage /> } />
    </Routes>
    </>
  );
}

export default App;
