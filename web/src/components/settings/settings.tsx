import React from 'react';
import "../../style/settings.css";

function Settings (): JSX.Element {
   return (
      <div className="settingsContainer">
         <div className='heading'>
                <strong>
                Settings
                </strong>
         </div>
         <div className='settings'>
                <button className='settingList'>Update Password</button>
                <button className='settingList'>Update Name</button>
                <button className='settingList'>Theme</button>
            </div>

            <div className='settingsForm'>
                <h1 className='settingName'>Update Password: </h1>
                <form className = "form" id='sForm'>
                   <br/><br/><br/><br/>
                   <input className = "formInput" name="password"  placeholder="password"/>
                   <br/><br/>
                   <input className = "formInput" name="newPassword" placeholder="new password"/>
                   <br/><br/>
                   <input className = "formInput" name="reNewPassword" placeholder="new password"/>
                   <br/><br/>
                   <button className = "formButton" type="submit"><strong>Submit</strong></button> 
                </form>
            </div>
      </div>
   );
} 

export default Settings;