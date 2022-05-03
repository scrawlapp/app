import React from 'react';
import '../../styles/auth.css';
import { useForm } from 'react-hook-form';
import PopUp from '../popUpWindow/popUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function SignUpForm(): JSX.Element{

   const {register, handleSubmit} = useForm();

   const [message, setMessage] = React.useState("");
   const [displayStyle, changeDisplay] = React.useState("none");
   const [passwordType, changeType] = React.useState("password");
   const [color, changeColor] = React.useState("#028a04");

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
      <button className='iconButton' onClick={showPassword} style={iconButtonStyle} type="button" ><FontAwesomeIcon className="icons" icon={faEye}/></button>
   );

   function showPassword () {
      changeType("text");
      changeEye(
         <button className='iconButton' onClick={hidePassword} style={iconButtonStyle} type="button" ><FontAwesomeIcon className="icons" icon={faEyeSlash}/></button>
      )
   }

   function hidePassword () {
      changeType("password");
      changeEye(
         <button className='iconButton' onClick={showPassword} style={iconButtonStyle} type="button" ><FontAwesomeIcon className="icons" icon={faEye}/>
         </button>
      )
   }

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
         if(data.message === "Created."){
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
               <br/>
               <input className = "formInput" {...register("firstName", {required: true})} name="firstName"  placeholder="first name" />
               <br/>
               <input className = "formInput" {...register("lastName", {required: true})} name="lastName"  placeholder="last name"/>
               <br/>
               <input className = "formInput" {...register("email", {required: true})} name="email"  placeholder="email"/>
               <br/>
               <input className = "formInput" {...register("password", {required: true})} type={passwordType} name="password" placeholder="password" style={passwordInputStyle}/>
               {passwordEye}
               <br/><br/>
               <button className = "formButton" type="submit"><strong>Sign Up</strong></button> 
            </form>
         </div>
         <PopUp message={message} display={displayStyle} changeDisplay={changeDisplay} color={color} />
      </div>
   );
}

export default SignUpForm;