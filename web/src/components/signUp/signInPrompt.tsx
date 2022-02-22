import React from "react";
import "../../style/auth.css";
import {Link} from "react-router-dom";

function signInPrompt(): JSX.Element{

   return(
      <div className="PromptContainer">
         <h1 className="title">Scrawl</h1>
         <h1>Already a user? Start scrawling</h1>
         <Link className="auth_link" to="/SignIn"><strong>Sign In</strong></Link>
      </div>
   );
}

export default signInPrompt;