import React from "react";
import "../../style/auth.css";
import { useForm } from "react-hook-form";
import {useNavigate} from "react-router-dom";


function SignInForm(): JSX.Element{
   const {register, handleSubmit} = useForm();
   let statusCode: boolean = false;
   const navigate = useNavigate();


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
      .then(res => {
         if(res.status == 200) {
            statusCode = true;
         }
         return res.json();
      })
      .then((data) => {
         console.log(data);
         if (statusCode){
            navigate(`/home`);
         }
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