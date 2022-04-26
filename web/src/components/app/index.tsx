import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Signup from '../signUp/';
import SignIn from '../signIn';
import {Home} from '../home/';
import Settings from '../settings';
import LandingPage from '../landingPage/';

function App(): JSX.Element {
  
  return (
    <Routes>
         <Route path='/' element={<LandingPage/>}/>
         <Route path='/signUp' element={<Signup/>}/>
         <Route path='/signIn' element={<SignIn/>}/>
         <Route path='/home' element={<Home/>}/>
         <Route path='/settings' element={<Settings/>}/>
    </Routes>
  );
}

export default App;