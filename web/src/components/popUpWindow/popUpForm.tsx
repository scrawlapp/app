import React, { useState } from 'react';
import "../../styles/popUp.css";
import { useForm } from "react-hook-form";
import PopUp from "../popUpWindow/popUp";

function PopUpForm (props: any): JSX.Element {
   const {register, handleSubmit} = useForm();
   const [displayStyle, changeDisplay] = React.useState("none");
   const [popUpMessage, setMessage] = React.useState("");
   const color = "#e0490d";

   let data1 = {}

   let popUpStyle = {
      display: props.display
   }

   let DoneButtonStyle = {
      left: "35px"
   }

   let AddButtonStyle = {
      right: "35px"
   }

   function Done () {
      props.changeDisplay("none");
   }

   function onSubmit(data: any, e: any) {
      data1 = {
         pageId: props.pageId,
         email: data.email,
         ability: data.ability
      }

      console.log(data1);

      fetch('/api/ability/', {
         method: 'POST',
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data1)
      })
      .then(res => res.json())
      .then(data => {
         if (data.message == "Created.") {
            e.target.reset();
         }
         else {
            setMessage(data.message);
            changeDisplay("inline-block");
         } 
      })
   }

   return (
      <div className='popUpBackground' style={popUpStyle}>
         <form className='popUpForm' onSubmit = {handleSubmit(onSubmit)}>
            <br/><br/>
            <input className = "formInput popUpInput" {...register("email", {required: true})} name="email"  placeholder="email" />
            <br/><br/>
            <h4>Authorization</h4> 
            <br/>
            <input className = "formInput popUpInput" type="radio" {...register("ability", {required: true})} name="ability" value="editor"/> <span className='radioText'>Editor</span>
            <input className = "formInput popUpInput" type="radio" {...register("ability", {required: true})} name="ability"  value="viewer"/>  <span className='radioText'>Viewer</span>
            <button className='popUpFormButton' style={AddButtonStyle} type="submit">Add User</button>
            <button className='popUpFormButton' style={DoneButtonStyle} onClick={Done}>Exit</button>
         </form>
         <PopUp message={popUpMessage} display={displayStyle} changeDisplay={changeDisplay} color={color} />
      </div>
   )
}

export default PopUpForm;