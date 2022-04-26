import React from 'react';
import SignUpForm from './signUpForm';
import SignInPrompt from './signInPrompt';
import '../../styles/auth.css';

function SignUp(): JSX.Element{

   return(
      <div className="container">
         <SignUpForm/>
         <SignInPrompt/>
      </div>
   );
}

export default SignUp;