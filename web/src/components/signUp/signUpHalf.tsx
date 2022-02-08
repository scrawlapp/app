import React from "react";
import "../../style/auth.css";

function signUpHalf(): JSX.Element{

   return(
      <div className="signUpPart">
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
            <button className = "formButton" type="submit">Sign Up</button> 
         </form>
      </div>
   );
}

export default signUpHalf;