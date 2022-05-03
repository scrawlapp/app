import React from 'react';
import { Page } from '../page/';
import PopUpForm from '../popUpWindow/popUpForm';
import PopUp from "../popUpWindow/popUp";
import '../../styles/home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faGear, faRightFromBracket, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import {
    PageStructure,
    SharedPageStructure,
    SelectedPageStructure,
    fetchAllPages,
    fetchAllSharedPages,
    getMoodAndUpdateUI
} from './api';
import {useNavigate} from "react-router-dom";

// address of the mood detecting server
const { REACT_APP_MOOD_ADDRESS } = process.env;

// getClassName helps you produce dynamic class names based on
// what the selected page is.
function getClassName(pageId: string, selectedPageId: string): string {
    return (pageId === selectedPageId) ? 'selectedPage' : 'pageList'
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
    const [displayMood, changeMoodDisplay] = React.useState("none");
    const [mood, setMood] = React.useState("");

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
         .catch((err) => {
            console.log(err);
        });
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
         .catch((err) => {
             console.log(err);
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

    function share() {
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
                <button className='miscalleneousButton' onClick={async () => { await getMoodAndUpdateUI(selectedPage.id,
                                                                                REACT_APP_MOOD_ADDRESS || '', setMood, changeMoodDisplay) }}>Get Mood</button>
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
            <PopUp message={mood} display={displayMood} changeDisplay={changeMoodDisplay} color={color} />

        </div>
    );
}

