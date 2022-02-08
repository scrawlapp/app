import React from "react";
import SignUpHalf from "./signUpHalf";
import SignInHalf from "./signInHalf";
import "../../style/auth.css";

function signUp(): JSX.Element{

   return(
      <div className="container">
         <SignUpHalf/>
         <SignInHalf/>
      </div>
   );
}

export default signUp;