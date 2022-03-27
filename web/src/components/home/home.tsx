import React from 'react';
import { Page } from '../page/page';
import '../../style/home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faGear, faRightFromBracket, faEllipsis } from '@fortawesome/free-solid-svg-icons';

export interface HomeProps {
    name: string
}

export interface PageStructure {
    id: string,
    owner: string,
    name: string
}

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

export function Home(props: HomeProps): JSX.Element {

    const [pagesList, setPagesList] = React.useState<PageStructure[]>([]);
    const [selectedPage, setSelectedPage] = React.useState<PageStructure>({
        id: '', name: '', owner: ''
    });
    const [newPageName, setNewPageName] = React.useState<string>('');

    React.useEffect(() => {
        fetchAllPages(setPagesList);
    }, []);

    function deletePage(pageId: string) {

        fetch('/api/page/', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pageId })
        }).then((_) => {
            setPagesList((pagesList) => pagesList.filter(page => page.id !== pageId));
        })
        .catch((err) => console.log(err));
    }
    
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
        }).then((response) => {
            console.log(response);
            const index = pagesList.findIndex(page => page.id === pageId);
            if (index > -1) {
                const newPagesList = pagesList;
                newPagesList[index].name = name;
                setPagesList(newPagesList);
            }
        })
        .catch((err) => console.log(err));
    }

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
        })
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    }

    

    return (
        <div className="grid-container" >

            <div className='userName'>
                <strong>Hi {localStorage.getItem('name') || ''}</strong>
            </div>

            <div className='navBar'>
                <button className='iconButton'><FontAwesomeIcon className="icons" icon={faUserGroup} /></button>
                <button className='iconButton'><FontAwesomeIcon className="icons" icon={faGear} /></button>
                <button className='iconButton'><FontAwesomeIcon className="icons" icon={faRightFromBracket} /></button>
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
                <h1 className='pageName'>{selectedPage.name}</h1>
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

