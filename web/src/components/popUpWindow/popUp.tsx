import React, { useState } from 'react';
import "../../style/popUp.css";

function PopUp (props: any): JSX.Element {



   let popUpStyle = {
      display: props.display
   }

   let h3Color = {
      color: props.color
   }

   function ok () {
      console.log(popUpStyle);
      props.changeDisplay("none");
   }
   if (props.message == "anger") {
      return (
         <div className='popUpBackground' style={popUpStyle}>
            <div className='popUpCard'>
               <h3 className='popUpMessage' style={h3Color}>{props.message}<br/>😠</h3>
               <button className='popUpButton' onClick={ok}>Ok</button>
            </div>
         </div>
      )
   }
   else if (props.message == "love") {
      return (
         <div className='popUpBackground' style={popUpStyle}>
            <div className='popUpCard'>
               <h3 className='popUpMessage' style={h3Color}>{props.message}<br/>💖</h3>
               <button className='popUpButton' onClick={ok}>Ok</button>
            </div>
         </div>
      )
   }
   else if (props.message == "sadness") {
      return (
         <div className='popUpBackground' style={popUpStyle}>
            <div className='popUpCard'>
               <h3 className='popUpMessage' style={h3Color}>{props.message}<br/>😔</h3>
               <button className='popUpButton' onClick={ok}>Ok</button>
            </div>
         </div>
      )
   }
   else if (props.message == "joy") {
      return (
         <div className='popUpBackground' style={popUpStyle}>
            <div className='popUpCard'>
               <h3 className='popUpMessage' style={h3Color}>{props.message}<br/>😄</h3>
               <button className='popUpButton' onClick={ok}>Ok</button>
            </div>
         </div>
      )
   }
   else if (props.message == "fear") {
      return (
         <div className='popUpBackground' style={popUpStyle}>
            <div className='popUpCard'>
               <h3 className='popUpMessage' style={h3Color}>{props.message}<br/>😨</h3>
               <button className='popUpButton' onClick={ok}>Ok</button>
            </div>
         </div>
      )
   }
   else if (props.message == "surprise") {
      return (
         <div className='popUpBackground' style={popUpStyle}>
            <div className='popUpCard'>
               <h3 className='popUpMessage' style={h3Color}>{props.message}<br/>😲</h3>
               <button className='popUpButton' onClick={ok}>Ok</button>
            </div>
         </div>
      )
   }
   else { 
      return (
         <div className='popUpBackground' style={popUpStyle}>
            <div className='popUpCard'>
               <h3 className='popUpMessage' style={h3Color}>{props.message}</h3>
               <button className='popUpButton' onClick={ok}>Ok</button>
            </div>
         </div>
      )
   }
}

export default PopUp;