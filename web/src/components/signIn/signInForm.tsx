import React from "react";
import "../../style/auth.css";
import { useForm } from "react-hook-form";
import {useNavigate} from "react-router-dom";
import PopUp from "../popUpWindow/popUp";


function SignInForm(): JSX.Element{
   const {register, handleSubmit} = useForm();
   let statusCode: boolean = false;
   const navigate = useNavigate();
   const [displayStyle, changeDisplay] = React.useState("none");
   const [popUpMessage, setMessage] = React.useState("");
   const color = "#e0490d";

   function onSubmit(data: any){
      localStorage.setItem('email', data.email);
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
         localStorage.setItem('firstName', data.firstName);
         localStorage.setItem('lastName', data.lastName);
         if (statusCode){
            navigate(`/home`);
         }
         else {
            console.log(data.message);
            setMessage(data.message);
            changeDisplay("inline-block");
         }
      })
   }


   return(
      <div>
         <div className="FormContainer">
            <form className = "form" onSubmit = {handleSubmit(onSubmit)}>
               <br/><br/><br/><br/>
               <input className = "formInput" id="emailInput" {...register("email", {required: true})} name="email"  placeholder="email"/>
               <br/><br/>
               <input className = "formInput" {...register("password", {required: true})} type="password" name="password" placeholder="password"/>
               <br/><br/>
               <button className = "formButton" type="submit"><strong>Sign In</strong></button> 
            </form>
         </div>
         <PopUp message={popUpMessage} display={displayStyle} changeDisplay={changeDisplay} color={color} />
      </div>
   );
}

export default SignInForm;