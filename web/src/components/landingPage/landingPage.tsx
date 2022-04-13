import React from 'react';
import ReactDOM from 'react-dom';
import '../../style/landingPage.css';

function LandingPage(){
  return(
    <section>
      <article className='title'>
    Scrawl
  </article> 
      
  <article className='tag'>
      Simple. Performant. Flexible.
    </article>

    <article className='desc'>
        Scrawl lets you treat a document as a collection of blocks to hold anything.
Combine text + data. Ditch your stack of doc + sheet.
      </article>

      <article className='points'>
          <p>Supports Markdown ✅</p>
          <p>Use it solo ✅</p>
          <p>Collaborate with others ✅</p>
          <p>Open source  ✅</p>
        </article>

        <article className='ghl'>
            <p>Find us </p>
            <p>on GitHub</p>
            </article>

        <article className='gs'>
            <p>Get started🚀</p>
            </article>
    </section>
  )
}

export default LandingPage;