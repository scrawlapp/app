import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Signup from "../signUp/signUp";

function App(): JSX.Element {
  return (
    <Routes>
         <Route path="/" element={<Signup/>}/>
    </Routes>
  );
}

export default App;
