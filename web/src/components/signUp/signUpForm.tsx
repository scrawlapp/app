import React from "react";
import "../../style/auth.css";
import { useForm } from "react-hook-form";
import PopUp from "../popUpWindow/popUp";


function SignUpForm(): JSX.Element{

   const {register, handleSubmit} = useForm();

   const [message, setMessage] = React.useState("");
   const [displayStyle, changeDisplay] = React.useState("none");
   const [color, changeColor] = React.useState("#028a04");

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
            setMessage("User Sign Up Successful");
            changeColor("#028a04");
            changeDisplay("inline-block");
         }
         else{
            setMessage(data.message);
            changeColor("#e0490d");
            changeDisplay("inline-block");
         }
      })
   }


   return(
      <div>
         <div className="FormContainer">
            <form className="form" onSubmit = {handleSubmit(onSubmit)}>
               <br/><br/>
               <input className = "formInput" {...register("firstName", {required: true})} name="firstName"  placeholder="first name" />
               <br/>
               <input className = "formInput" {...register("lastName", {required: true})} name="lastName"  placeholder="last name"/>
               <br/>
               <input className = "formInput" {...register("email", {required: true})} name="email"  placeholder="email"/>
               <br/>
               <input className = "formInput" {...register("password", {required: true})} type="password" name="password" placeholder="password"/>
               <br/>
               <button className = "formButton" type="submit"><strong>Sign Up</strong></button> 
            </form>
         </div>
         <PopUp message={message} display={displayStyle} changeDisplay={changeDisplay} color={color} />
      </div>
   );
}

export default SignUpForm;