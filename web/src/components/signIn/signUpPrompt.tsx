import React from "react";
import "../../style/auth.css";
import {Link} from "react-router-dom";

function signUpPrompt(): JSX.Element{

   return(
      <div className="PromptContainer">
         <h1 className="title" id="title">Scrawl</h1>
         <h1>Not a user?<br/>Sign Up to start scrawling</h1>
         <Link className="auth_link" to="/"><strong>Sign Up</strong></Link>
      </div>
   );
}

export default signUpPrompt;