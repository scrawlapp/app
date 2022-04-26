import React from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { Block } from '../block/block';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import "../../style/page.css"

// describe the props to be passed into Page
export interface PageProps {

    pageId: string,
    pageName: string,
    updatePageName: (pageId: string, name: string) => void,
    deletePage: (pageId: string) => void
    shared: boolean,
    ability: string
}

// describe how the block looks like during network calls
export interface BlockStructure {

    id: string,
    pageId: string,
    tag: string,
    html: string,
    position: number,
    href: string | null,
    src: string | null,
}

// POST /api/block/
function insertAnEmptyBlock(pageId: string, position: number) {

    if (pageId.length < 32) {
        return;
    }

    fetch('/api/block/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pageId,
            tag: 'p',
            html: '',
            position,
            src: null,
            href: null
        })
    })
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
} 

// PUT /api/block/
function updateBlock(block: any) {
    
    fetch(`/api/block/`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(block)
    })
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
}

// GET /api/block/all/:pageId
function fetchAllBlocks(pageId: string, setBlocks: React.Dispatch<React.SetStateAction<BlockStructure[]>>) {

    fetch(`/api/block/all/${pageId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }).then(response => response.json())
    .then(data => {
        if (data.length === 0) {
            insertAnEmptyBlock(pageId, 0);
            fetchAllBlocks(pageId, setBlocks);
            return;
        }
        data.sort((a: BlockStructure, b: BlockStructure): number => {
            return a.position - b.position;
        });
        setBlocks(data);
    }).catch((err) => {
        console.log(err);
    });
}

// DELETE /api/block/
function deleteBlock(blockId: string) {

    fetch(`/api/block/`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: blockId})
    })
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
}

function isAnEmptyBlock(block: BlockStructure): boolean {

    return (
        block.tag === 'p'
        && block.html === ''
        && block.src === null
        && block.href === null
    )
}

// the Page component
export function Page(props: PageProps): JSX.Element {

    const [blocks, setBlocks] = React.useState<BlockStructure[]>([]);
    const pageNameRef = React.useRef(props.pageName);
    const [deletePageCue, deletePageCueCaller] = React.useState<number>(0);
    const pageButton = {
        marginLeft: "3%",
        marginBottom: "15px",
        marginTop: "10px"
    }

    // we fetch all blocks only when pageId changes
    // or the Page component is mounted onto the DOM
    React.useEffect(() => {
        fetchAllBlocks(props.pageId, setBlocks);
    }, [props.pageId]);

    React.useEffect(() => {
        setBlocks([]);
    }, [deletePageCue]);

    function handlePageNameChange(event: ContentEditableEvent) {

        if (props.shared && props.ability !== 'editor') {
            return;
        }
        if (event !== null) {
            pageNameRef.current = event.target.value;
        }
    }

    function handlePageNameBlur() {

        if (props.shared && props.ability !== 'editor') {
            return;
        }
        props.updatePageName(props.pageId, pageNameRef.current);
    }

    // const stylePageName = {
    //     textAlign: 'left',
    //     fontSize: '32px',
    //     fontWeight: 'bold',
    //     margin: '25px 25px'
    // }

    if (blocks.length === 0) {
        return(
            <div>
                <br/>
                <h1 className="noPageSelected">No page is selected,<br/>please select a page.</h1>
            </div>
        );
    }

    if (blocks.length === 1 && isAnEmptyBlock(blocks[blocks.length - 1])) {
        const blocksCopy = blocks;
        blocksCopy[blocksCopy.length - 1].html = 'click here to begin';
        setBlocks(blocksCopy);
    }

    return(
        <div>

            <ContentEditable
                html={props.pageName}
                tagName='p'
                onChange={handlePageNameChange}
                onBlur={handlePageNameBlur}
                className="pageTitle"
                // style={stylePageName}
            ></ContentEditable>

            
            <button onClick={() => {
                if (props.shared && props.ability !== 'editor') {
                    return;
                }
                props.deletePage(props.pageId);
                deletePageCueCaller(deletePageCue + 1);
            }} className="iconButton" style={pageButton}><FontAwesomeIcon className="icons" icon={faTrash} /></button>

            {blocks.map((block, index) => (
                <Block 
                    id={block.id}
                    pageId={props.pageId}
                    html={block.html}
                    tag={block.tag}
                    position={block.position}
                    src={block.src}
                    href={block.href}
                    insertBlock={insertAnEmptyBlock}
                    updateBlock={updateBlock}
                    deleteBlock={deleteBlock}
                    fetchAgain={() => {
                        fetchAllBlocks(props.pageId, setBlocks);
                    }}
                    haveFocus={index === blocks.length - 1}
                    canEdit={!props.shared || (props.shared && props.ability === 'editor')}
                />)
            )}


        </div>
    )
}
