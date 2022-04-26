import React from 'react';
import { Page } from '../page/page';
import PopUpForm from '../popUpWindow/popUpForm';
import PopUp from "../popUpWindow/popUp";
import '../../style/home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faGear, faRightFromBracket, faEllipsis, faLariSign } from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from "react-router-dom";

// describe how the Page looks like in memory
export interface PageStructure {
    id: string,
    owner: string,
    name: string
}

export interface SharedPageStructure {
    id: string,
    name: string,
    ability: string
}

export interface SelectedPageStructure {
    id: string,
    name: string,
    shared: boolean,
    ability: string
}

const { REACT_APP_MOOD_ADDRESS } = process.env;

function getClassName(pageId: string, selectedPageId: string): string {
    return (pageId === selectedPageId) ? 'selectedPage' : 'pageList'
}

// GET /api/page/all/
// takes in the state updater function to add data
function fetchAllPages(setPagesList: React.Dispatch<React.SetStateAction<PageStructure[]>>) {

    fetch('/api/page/all', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((data) => setPagesList(data))
    .catch((err) => console.log(err));
}

// GET /api/ability/pages/
// takes in the state updater function to add data
function fetchAllSharedPages(setSharedPagesList: React.Dispatch<React.SetStateAction<SharedPageStructure[]>>) {

    fetch('/api/ability/pages', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((data) => setSharedPagesList(data))
    .catch((err) => console.log(err));
}


// the Home component
export function Home(): JSX.Element {

    const [pagesList, setPagesList] = React.useState<PageStructure[]>([]);
    const [selectedPage, setSelectedPage] = React.useState<SelectedPageStructure>({
        id: '', name: '', shared: false, ability: '',
    });
    const [sharedPagesList, setSharedPagesList] = React.useState<SharedPageStructure[]>([]);
    const [newPageName, setNewPageName] = React.useState<string>('');
    const [pageFetchCue, pageFetchCueCaller] = React.useState<number>(0);

    const navigate = useNavigate();
    const [displayStyle, changeDisplay] = React.useState("none");
    const [display, setDisplay] = React.useState("none");
    const [mood, changeMood] = React.useState("");

    let miscalleneousStyle = {
        display: displayStyle
    }

    let color = "#2A52BE";

    // fetch only once, when the component is mounted onto the DOM
    // and when pageFetchCue changes.
    React.useEffect(() => {
        fetchAllPages(setPagesList);
        fetchAllSharedPages(setSharedPagesList);
    }, [pageFetchCue]);




    async function getMood(pageId: string) {
        try {
            const response = await fetch(`/api/block/all/${pageId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json();
            let text = '';
            for (let i = 0; i < data.length; ++i) {
                text += data[i].html;
            }
            const moodResponse = await fetch(`${REACT_APP_MOOD_ADDRESS}/api`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "userInput": text
                })
            });
            const moodData = await moodResponse.json();
            console.log(moodData);
            changeMood(moodData);
            setDisplay("inline-block");
        } catch (err) {
            console.log(err);
        }
    }

    // DELETE /api/page/
    function deletePage(pageId: string) {
        fetch('/api/page/', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pageId })
        }).then((_) => {
            pageFetchCueCaller(pageFetchCue + 1);
        })
        .catch((err) => console.log(err));
    }
    
    // PUT /api/page/
    function updatePageName(pageId: string, name: string) {
    
        fetch('/api/page/', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pageId, name
            })
        }).then((_) => {
            setSelectedPage((oldPage) => {
                return {
                    id: pageId,
                    name: name,
                    shared: oldPage.shared,
                    ability: oldPage.ability
                }
            });
            pageFetchCueCaller(pageFetchCue + 1);
        })
        .catch((err) => console.log(err));
    }

    // POST /api/page/
    function insertPage(pageName: string) {

        if (pageName === '') {
            return;
        }
        
        fetch('/api/page/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: pageName
            })
        }).then((_) => {
            pageFetchCueCaller(pageFetchCue + 1);
        })
        .catch((err) => console.log(err));
    }

    function logOut() {
        fetch('/api/user/logout', {
            method: 'POST',
            headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
         })
         .then(res => {
            if(res.status !== 200){
               return res.json()
            }
            else {
                navigate(`/`);
            }
         })
         .then((data) => {
            console.log(data);
         })
    }

    function deleteAccount() {

        fetch('/api/user', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.status !== 200){
               return res.json()
            }
            else {
                navigate(`/`);
            }
         })
         .then((data) => {
            console.log(data);
         });
    }

    function showMiscalleneous() {
        if(displayStyle == "none"){
            changeDisplay("inline-block");
        }
        else if (displayStyle == "inline-block"){
            changeDisplay("none");
        }
    }

    function share () {
        setDisplay("inline-block");
    }


    return (
        <div className="grid-container" >

            <div className='userName'>
                <strong>Hi {localStorage.getItem('firstName') || ''}</strong>
            </div>

            <div className='navBar'>
                <button className='iconButton' onClick={share}><FontAwesomeIcon className="icons" icon={faUserGroup} /></button>
                <button className='iconButton' onClick={() => navigate(`/settings`)}><FontAwesomeIcon className="icons" icon={faGear} /></button>
                <button className='iconButton' onClick={logOut}><FontAwesomeIcon className="icons" icon={faRightFromBracket} /></button>
                <button className='iconButton' onClick={showMiscalleneous}><FontAwesomeIcon className="icons" icon={faEllipsis} /></button>
            </div>

            <div className="miscalleneous" style={miscalleneousStyle}>
                <button className='miscalleneousButton' onClick={deleteAccount}>Delete Account</button>
                <button className='miscalleneousButton' onClick={async () => { await getMood(selectedPage.id) }}>Get Mood</button>
            </div>

            <div className='sideNavBar'>
                <br/>
                <h3 className='pageType'>Your Pages</h3>
                {pagesList.map((page) => (
                    <button className={getClassName(page.id, selectedPage.id)} onClick={() => setSelectedPage({
                        id: page.id,
                        name: page.name,
                        shared: false,
                        ability: ''
                    })}>{page.name}</button>
                ))}<br/><br/>
                <h3 className='pageType'>Shared Pages</h3>
                {sharedPagesList.map((page) => (
                    <button className={getClassName(page.id, selectedPage.id)} onClick={() => setSelectedPage({
                        id: page.id,
                        name: page.name,
                        shared: true,
                        ability: page.ability
                    })}>{page.name}</button>
                ))} <br/><br/><hr/><br/>
                <input className='formInput addPageInput' type='text' placeholder='page name' onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setNewPageName(event.target.value);
                }}></input><br/><br/>
                <button className='formButton addPageButton' onClick={() => insertPage(newPageName)}>Add Page</button>
            </div>

            <div className='page'>
                <Page
                    pageId={selectedPage.id}
                    pageName={selectedPage.name}
                    shared={selectedPage.shared}
                    ability={selectedPage.ability}
                    updatePageName={updatePageName}
                    deletePage={deletePage}
                />
            </div>
            <PopUpForm display={display} changeDisplay={setDisplay} pageId={selectedPage.id}/>
            <PopUp message={mood} display={display} changeDisplay={setDisplay} color={color} />

        </div>
    );
}

