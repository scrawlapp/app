import React from 'react';
import { Page } from '../page/page';
import '../../style/home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faGear, faRightFromBracket, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from "react-router-dom";

// describe how the Page looks like in memory
export interface PageStructure {
    id: string,
    owner: string,
    name: string
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

// the Home component
export function Home(): JSX.Element {

    const [pagesList, setPagesList] = React.useState<PageStructure[]>([]);
    const [selectedPage, setSelectedPage] = React.useState<PageStructure>({
        id: '', name: '', owner: ''
    });
    const [newPageName, setNewPageName] = React.useState<string>('');
    const [pageFetchCue, pageFetchCueCaller] = React.useState<number>(0);

    const navigate = useNavigate();

    // fetch only once, when the component is mounted onto the DOM
    // and when pageFetchCue changes.
    React.useEffect(() => {
        fetchAllPages(setPagesList);
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
            setSelectedPage({
                id: pageId,
                name: name,
                owner: selectedPage.owner
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
    
    return (
        <div className="grid-container" >

            <div className='userName'>
                <strong>Hi {localStorage.getItem('firstName') || ''}</strong>
            </div>

            <div className='navBar'>
                <button className='iconButton'><FontAwesomeIcon className="icons" icon={faUserGroup} /></button>
                <button className='iconButton' onClick={() => navigate(`/settings`)}><FontAwesomeIcon className="icons" icon={faGear} /></button>
                <button className='iconButton' onClick={logOut}><FontAwesomeIcon className="icons" icon={faRightFromBracket} /></button>
                <button className='iconButton'><FontAwesomeIcon className="icons" icon={faEllipsis} /></button>
            </div>

            <div className='sideNavBar'>
                {pagesList.map((page) => (
                    <button className='pageList' onClick={() => setSelectedPage(page)}>{page.name}</button>
                ))}
                <input type='text' onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setNewPageName(event.target.value);
                }}></input>
                <button onClick={() => insertPage(newPageName)}>insert a new page</button>
            </div>

            <div className='page'>
                <Page
                    pageId={selectedPage.id}
                    pageName={selectedPage.name}
                    updatePageName={updatePageName}
                    deletePage={deletePage}
                />
            </div>

        </div>
    );
}

