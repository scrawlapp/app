import React from 'react';
import { Block, HeadingBlock, ContentEditableEvent } from '../block/block';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { BlockStructure, 
    insertAnEmptyBlock, 
    updateBlock, 
    fetchAllBlocks, 
    deleteBlock } from './api';
import '../../styles/page.css';

// describe the props to be passed into Page
export interface PageProps {

    pageId: string
    pageName: string
    updatePageName: (pageId: string, name: string) => void
    deletePage: (pageId: string) => void
    shared: boolean
    ability: string
}

const stylePageButton = {
    marginLeft: "3%",
    marginBottom: "15px",
    marginTop: "10px"
}

// check if block has no content
function isAnEmptyBlock(block: BlockStructure): boolean {

    return (
        block.tag === 'p'
        && block.html === ''
        && block.src === null
        && block.href === null
    )
}

// fire when the page name changes
function handlePageNameChange(event: ContentEditableEvent, 
    props: PageProps, pageNameRef: React.MutableRefObject<string>) {

    if (props.shared && props.ability !== 'editor') {
        return;
    }
    if (event !== null) {
        pageNameRef.current = event.target.value;
    }
}

// fire when the page name block goes out of focus
function handlePageNameBlur(props: PageProps, 
    pageNameRef: React.MutableRefObject<string>): 
    React.FocusEventHandler<HTMLDivElement> | undefined {

    if (props.shared && props.ability !== 'editor') {
        return;
    }
    props.updatePageName(props.pageId, pageNameRef.current);
}

// the Page component
export function Page(props: PageProps): JSX.Element {

    const [blocks, setBlocks] = React.useState<BlockStructure[]>([]);
    const pageNameRef = React.useRef(props.pageName);
    const [deletePageCue, deletePageCueCaller] = React.useState<number>(0);
    
    // we fetch all blocks only when pageId changes
    // or the Page component is mounted onto the DOM
    React.useEffect(() => {
        fetchAllBlocks(props.pageId, setBlocks);
    }, [props.pageId]);

    // when page is deleted, blocks need to be emptied
    React.useEffect(() => {
        setBlocks([]);
    }, [deletePageCue]);

    // case where no page is selected
    if (blocks.length === 0) {
        return(
            <div>
                <br/>
                <h1 className="noPageSelected">No page is selected,<br/>please select a page.</h1>
            </div>
        );
    }

    // case where a page does not have any blocks made by user
    if (blocks.length === 1 && isAnEmptyBlock(blocks[blocks.length - 1])) {
        const blocksCopy = blocks;
        blocksCopy[blocksCopy.length - 1].html = 'click here to begin';
        setBlocks(blocksCopy);
    }

    // return heading + delete button + collection of blocks
    return(
        <div>
            <HeadingBlock
                onChange={ function (event: ContentEditableEvent) {
                    handlePageNameChange(event, props, pageNameRef)
                }}
                onBlur={function (): React.FocusEventHandler<HTMLDivElement> | undefined {
                    handlePageNameBlur(props, pageNameRef);
                    return;
                }}
                tagName='p'
                className="pageTitle"
                html={props.pageName}
            />

            <button 
                onClick={() => {
                    if (props.shared && props.ability !== 'editor') {
                        return;
                    }
                    props.deletePage(props.pageId);
                    deletePageCueCaller(deletePageCue + 1);
                }} 
                className="iconButton" 
                style={stylePageButton}>
                    <FontAwesomeIcon className="icons" icon={faTrash}/>
                </button>

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
