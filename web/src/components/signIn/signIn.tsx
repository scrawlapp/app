import React from 'react';
import SignInForm from './signInForm';
import SignUpPrompt from './signUpPrompt';
import '../../styles/auth.css';

function SignIn(): JSX.Element{

   return(
      <div className="container">
         <SignUpPrompt/>
         <SignInForm />
      </div>
   );
}

export default SignIn;