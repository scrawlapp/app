import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Signup from "../signUp/signUp";
import SignIn from "../signIn/signIn";

function App(): JSX.Element {
  return (
    <Routes>
         <Route path="/" element={<Signup/>}/>
         <Route path='/signIn' element={<SignIn/>}/>
    </Routes>
  );
}

export default App;
