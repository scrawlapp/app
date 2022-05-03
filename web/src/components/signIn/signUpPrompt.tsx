import React from 'react';
import '../../styles/auth.css';
import {Link} from 'react-router-dom';

function SignUpPrompt(): JSX.Element{

   return(
      <div className="PromptContainer">
         <h1 className="title" id="title">Scrawl</h1>
         <h1 className="h1">Not a user?<br/>Sign Up to start scrawling</h1>
         <Link className="auth_link" to="/SignUp"><strong>Sign Up</strong></Link>
      </div>
   );
}

export default SignUpPrompt;