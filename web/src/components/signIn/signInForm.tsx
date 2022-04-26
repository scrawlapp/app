import React from "react";
import '../../styles/auth.css';
import { useForm } from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import PopUp from '../popUpWindow/popUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function SignInForm(): JSX.Element{
   const {register, handleSubmit} = useForm();
   let statusCode: boolean = false;
   const navigate = useNavigate();
   const [displayStyle, changeDisplay] = React.useState("none");
   const [popUpMessage, setMessage] = React.useState("");
   const color = "#e0490d";
   const [passwordType, changeType] = React.useState("password");

   const passwordInputStyle = {
      width: "225px"
   }
   
   const iconButtonStyle = {
      marginTop: "18px",
      marginLeft: "15px",
      boxShadow: "none",
      border: "none",
      height: "30px",
      width: "30px"
   }



   const [passwordEye, changeEye] = React.useState(
      <button className='iconButton' onClick={showPassword} style={iconButtonStyle} ><FontAwesomeIcon className="icons" icon={faEye}/></button>
   );

   function showPassword () {
      changeType("text");
      changeEye(
         <button className='iconButton' onClick={hidePassword} style={iconButtonStyle} ><FontAwesomeIcon className="icons" icon={faEyeSlash}/></button>
      )
   }

   function hidePassword () {
      changeType("password");
      changeEye(
         <button className='iconButton' onClick={showPassword} style={iconButtonStyle}><FontAwesomeIcon className="icons" icon={faEye}/>
         </button>
      )
   }

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
               <input className = "formInput" {...register("password", {required: true})} type={passwordType} name="password" placeholder="password" style={passwordInputStyle}/>
               {passwordEye}
               <br/><br/><br/>
               <button className = "formButton" type="submit"><strong>Sign In</strong></button> 
            </form>
         </div>
         <PopUp message={popUpMessage} display={displayStyle} changeDisplay={changeDisplay} color={color} />
      </div>
   );
}

export default SignInForm;