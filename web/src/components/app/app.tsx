import React, {useState} from 'react';
import { Routes, Route} from 'react-router-dom';
import Signup from '../signUp/signUp';
import SignIn from '../signIn/signIn';
import {Home} from '../home/home';
import Settings from '../settings/settings';
import LandingPage from '../landingPage/landingPage';

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