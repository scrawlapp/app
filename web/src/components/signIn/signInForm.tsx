import React from "react";
import "../../style/auth.css";
import { useForm } from "react-hook-form";

function SignInForm(): JSX.Element{
   const {register, handleSubmit} = useForm();


   function onSubmit(data: any){
      console.log("here");
      fetch('/api/user/login', {
         method: 'POST',
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(data => {
         console.log(data);
      })
   }


   return(
      <div className="FormContainer">
         <form className = "form" onSubmit = {handleSubmit(onSubmit)}>
            <br/><br/><br/><br/>
            <input className = "formInput" id="emailInput" {...register("email", {required: true})} name="email"  placeholder="email"/>
            <br/><br/>
            <input className = "formInput" {...register("password", {required: true})} name="password" placeholder="password"/>
            <br/><br/>
            <button className = "formButton" type="submit"><strong>Sign In</strong></button> 
         </form>
      </div>
   );
}

export default SignInForm;