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

   return (
      <div className='popUpBackground' style={popUpStyle}>
         <div className='popUpCard'>
            <h3 className='popUpMessage' style={h3Color}>{props.message}</h3>
            <button className='popUpButton' onClick={ok}>Ok</button>
         </div>
      </div>
   )
}

export default PopUp;