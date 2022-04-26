import React from 'react';
import '../../styles/settings.css';
import { useForm } from 'react-hook-form';
import {useNavigate} from 'react-router-dom';

function ChangeName (): JSX.Element {
   const {register: register2, handleSubmit: handleSubmit2} = useForm();
   const navigate = useNavigate();
   let firstNameData = {};
   let lastNameData = {};

   function changeName(data: any, e: any) {
      e.target.reset();
      if (data.firstName != localStorage.getItem('firstName')) {
         firstNameData = {
            email: localStorage.getItem('email'),
            firstName: data.firstName
         }
         fetch('/api/user/firstName', {
            method: 'PUT',
            headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(firstNameData)
         })
         .then(res => {
            if(res.status !== 204){
               return res.json()
            }
            else {
               localStorage.setItem("firstName", data.firstName);
            }
         })
         .then((data) => {
            console.log(data);
         })
      }
      if (data.lastName != localStorage.getItem('lastName')) {
         lastNameData = {
            email: localStorage.getItem('email'),
            lastName: data.lastName
         }
         fetch('/api/user/lastName', {
            method: 'PUT',
            headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(lastNameData)
         })
         .then(res => {
               if(res.status !== 204){
                  return res.json()
               }
               else {
                  localStorage.setItem("lastName", data.lastName);
               }
            }
         )
         .then((data) => {
            console.log(data);

         })
      }
   }

   return (
      <div className='settingsForm'>
         <h1 className='settingName'>Update Name: </h1>
         <form className = "form sForm" id='sForm' onSubmit = {handleSubmit2(changeName)}>
            <br/><br/><br/>
            <input className = "formInput" {...register2("firstName", {required: true})} defaultValue="" name="firstName"  placeholder="first name"/>
            <br/><br/><br/>
            <input className = "formInput" {...register2("lastName", {required: true})} defaultValue="" name="lastName" placeholder="last name"/>
            <br/><br/><br/><br/>
            <button className = "formButton" type="submit"><strong>Change</strong></button> 
         </form>
      </div>
   )
}

export default ChangeName;