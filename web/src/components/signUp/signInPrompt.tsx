import React from "react";
import "../../style/auth.css";

function signInPrompt(): JSX.Element{

   return(
      <div className="signInPart">
         <h1 className="title">Scrawl</h1>
         <h1>Already a user? Start scrawling</h1>
         <button type="submit"><strong>Sign In</strong></button>
      </div>
   );
}

export default signInPrompt;