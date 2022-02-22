import React from "react";
import "../../style/auth.css";

function signInForm(): JSX.Element{

   return(
      <div className="FormContainer">
         <form className="form">
         <br/><br/><br/><br/>
            <input className = "formInput" id="emailInput" name="email"  placeholder="email"/>
            <br/><br/>
            <input className = "formInput" name="password" placeholder="password"/>
            <br/><br/>
            <button className = "formButton" type="submit"><strong>Sign In</strong></button> 
         </form>
      </div>
   );
}

export default signInForm;