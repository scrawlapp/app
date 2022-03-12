import React from "react";
import "../../style/auth.css";
import { useForm } from "react-hook-form";



function SignUpForm(): JSX.Element{

   const {register, handleSubmit} = useForm();


   function onSubmit(data: any){
      fetch('/api/user/signup', {
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
         if(data.message == "Created."){
            console.log("Created");
         }
         else{
         }
      })
   }


   return(
      <div className="FormContainer">
         <form className="form" onSubmit = {handleSubmit(onSubmit)}>
         <br/><br/>
            <input className = "formInput" {...register("firstName", {required: true})} name="firstName"  placeholder="first name"/>
            <br/>
            <input className = "formInput" {...register("lastName", {required: true})} name="lastName"  placeholder="last name"/>
            <br/>
            <input className = "formInput" {...register("email", {required: true})} name="email"  placeholder="email"/>
            <br/>
            <input className = "formInput" {...register("password", {required: true})} name="password" placeholder="password"/>
            <br/>
            <button className = "formButton" type="submit"><strong>Sign Up</strong></button> 
         </form>
      </div>
   );
}

export default SignUpForm;