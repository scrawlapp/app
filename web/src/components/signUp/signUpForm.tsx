import React from "react";
import "../../style/auth.css";

function signUpForm(): JSX.Element{

   return(
      <div className="FormContainer">
         <form className="form">
         <br/><br/>
            <input className = "formInput" name="email"  placeholder="first name"/>
            <br/>
            <input className = "formInput" name="email"  placeholder="last name"/>
            <br/>
            <input className = "formInput" name="email"  placeholder="email"/>
            <br/>
            <input className = "formInput" name="password" placeholder="password"/>
            <br/>
            <button className = "formButton" type="submit"><strong>Sign Up</strong></button> 
         </form>
      </div>
   );
}

export default signUpForm;