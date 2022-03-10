import React from "react";
import SignUpForm from "./signUpForm";
import SignInPrompt from "./signInPrompt";
import "../../style/auth.css";

function SignUp(): JSX.Element{

   return(
      <div className="container">
         <SignUpForm/>
         <SignInPrompt/>
      </div>
   );
}

export default SignUp;