import React from 'react';
import { Page } from '../page/page';
import "../../style/home.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faGear, faRightFromBracket, faEllipsis } from '@fortawesome/free-solid-svg-icons'

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
            }
        }).then((response) => {
            console.log(response);
            const index = pagesList.findIndex(page => page.id === pageId);
            if (index > -1) {
                setPagesList((pagesList) => pagesList.splice(index, 1));
            }
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
                pageName
            })
        })
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    }

    

    return (
        <div className="grid-container" >

            {/* <input type='text' onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setNewPageName(event.target.value);
            }}></input>

            <button onClick={() => insertPage(newPageName)}>insert a new page</button>

            {pagesList.map((page) => (
                <button onClick={() => setSelectedPage(page)}></button>
            ))}
            <p>Hey {props.name}</p>
            {
                () => {
                    if (selectedPage.id !== '') {
                        return (<Page 
                            pageId={selectedPage.id}
                            pageName={selectedPage.name}
                            updatePageName={updatePageName}
                            deletePage={deletePage}
                        />);
                    }
                }
            } */}
            <div className='userName'>
                <strong>
                Hi Ronak
                </strong>
            </div>

            <div className='navBar'>
                <button className='iconButton'><FontAwesomeIcon className="icons" icon={faUserGroup} /></button>
                <button className='iconButton'><FontAwesomeIcon className="icons" icon={faGear} /></button>
                <button className='iconButton'><FontAwesomeIcon className="icons" icon={faRightFromBracket} /></button>
                <button className='iconButton'><FontAwesomeIcon className="icons" icon={faEllipsis} /></button>
            </div>

            <div className='sideNavBar'>
                <button className='pageList'>your page 1</button>
                <button className='pageList'>your page 2</button>
                <button className='pageList'>your page 3</button>
                <button className='pageList'>your page 4</button>
                <button className='pageList'>your page 5</button>
                <button className='pageList'>your page 6</button>
            </div>

            <div className='page'>
                <h1 className='pageName'>your page 4</h1>
                <p className='content'>content of page 4...</p>
            </div>

        </div>
    );
}

