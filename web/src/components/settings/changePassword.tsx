import React, { useState } from 'react';
import "../../style/settings.css";
import { useForm } from "react-hook-form";
import {useNavigate} from "react-router-dom";

function ChangePassword (): JSX.Element {
   const {register, handleSubmit} = useForm();
   const navigate = useNavigate();
   let data1 = {};

   function onSubmit(data: any, e: any) {
      e.target.reset();
      data1 = {
         email: localStorage.getItem('email'),
         oldPassword: data.oldPassword,
         newPassword: data.newPassword
      }
      console.log(data1);
      if (data.newPassword != data.reNewPassword) {
         console.log("New Password doesn't match with re entered new password");
         return;
      }
      fetch('/api/user/password', {
         method: 'PUT',
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data1)
      })
      .then(res => {
         if(res.status !== 204){
            return res.json()
         }
      })
      .then((data) => {
         console.log(data);
      })
   }

   return (
      <div className='settingsForm'>
         <h1 className='settingName'>Update Password: </h1>
         <form className = "form sForm" onSubmit = {handleSubmit(onSubmit)}>
            <br/><br/>
            <input className = "formInput" {...register("oldPassword", {required: true})} type="password" name="oldPassword"  placeholder="current password"/>
            <br/><br/>
            <input className = "formInput" {...register("newPassword", {required: true})} type="password" name="newPassword" placeholder="new password"/>
            <br/><br/>
            <input className = "formInput" {...register("reNewPassword", {required: true})} type="password" name="reNewPassword" placeholder="new password"/>
            <br/><br/><br/>
            <button className = "formButton" type="submit"><strong>Change</strong></button> 
         </form>
      </div>
   )
}

export default ChangePassword;