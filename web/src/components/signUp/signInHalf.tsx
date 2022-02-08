import React from "react";
import "../../style/auth.css";

function signInHalf(): JSX.Element{

   return(
      <div className="signInPart">
         <h1 className="title">Scrawl</h1>
         <h1>Already a user? Start scrawling</h1>
         <button type="submit">Sign In</button>
      </div>
   );
}

export default signInHalf;