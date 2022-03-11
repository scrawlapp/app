import React from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { Block } from '../block/block';

// describe the props to be passed into Page
export interface PageProps {

    pageId: string,
    pageName: string,
    updatePageName: (pageId: string, name: string) => void,
    deletePage: (pageId: string) => void
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

function insertAnEmptyBlock(pageId: string) {

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
            position: 0,
            src: null,
            href: null
        })
    })
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
} 


function updateBlock(block: any) {
    
    fetch(`/api/block/`, {
        method: 'PUT',
        body: JSON.stringify(block)
    })
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
}

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
            insertAnEmptyBlock(pageId);
            fetchAllBlocks(pageId, setBlocks);
            return;
        }
        if (data.length === 1) {
            data[0].html = 'click here to begin';
        }
        setBlocks(data);
        console.log(data);
    }).catch((err) => {
        console.log(err);
    });

    setBlocks([{
        id: '',
        pageId,
        tag: 'p',
        html: 'start here',
        position: 0,
        src: null,
        href: null
    }])

}

function deleteBlock(blockId: string) {

    fetch(`/api/block/`, {
        method: 'DELETE',
        body: JSON.stringify(blockId)
    })
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
}

export function Page(props: PageProps): JSX.Element {

    const [blocks, setBlocks] = React.useState<BlockStructure[]>([]);
    const pageNameRef = React.useRef(props.pageName);

    // we fetch all blocks only when pageId changes
    // or the Page component is mounted onto the DOM
    React.useEffect(() => {
        fetchAllBlocks(props.pageId, setBlocks);
    }, [props.pageId]);

    function handlePageNameChange(event: ContentEditableEvent) {

        if (event !== null) {
            pageNameRef.current = event.target.value;
            props.updatePageName(props.pageId, pageNameRef.current);
        }
    }

    return(
        <div>
            <button onClick={() => props.deletePage(props.pageId)}>delete this page</button>

            <ContentEditable
                html={pageNameRef.current}
                tagName='p'
                onChange={handlePageNameChange}
                onBlur={() => {}}
            ></ContentEditable>

            {blocks.map(block => (
                <Block 
                    id={block.id}
                    pageId={block.pageId}
                    html={block.html}
                    tag={block.tag}
                    position={block.position}
                    src={block.src}
                    href={block.href}
                    insertBlock={insertAnEmptyBlock}
                    updateBlock={updateBlock}
                    deleteBlock={deleteBlock}
                />)
            )}
        </div>
    )
}
