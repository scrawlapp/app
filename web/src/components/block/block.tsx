import ContentEditable, { ContentEditableEvent } from './contentEditable';
import { io } from "socket.io-client";
import React from 'react';

// describe how props look like for Block
export interface BlockProps {

    id: string
    pageId: string
    tag: string
    html: string
    position: number
    href: string | null
    src: string | null
    insertBlock: (pageId: string, position: number) => void
    updateBlock: (block: any) => void
    deleteBlock: (blockId: string) => void
    fetchAgain: () => void
    haveFocus: boolean
    canEdit: boolean
}

// attempt to establish connection with the server
const socket = io();

// while typing in contentEditable, the client receives updates from the server
// too. this causes the client write the updates from the start of the content editable
// element. to override this, we explicitly move the care to the end.
function moveCaretToEnd(innerRef: React.RefObject<HTMLElement>, content: string) {

    if (innerRef.current) {
        innerRef.current.innerHTML = content;
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(innerRef.current);
        range.collapse(false);
        if (selection !== null) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
        innerRef.current.focus();
        range.detach(); 
    }
}

// attachEvents will use the socket instance and define what should
// be done upon events such as "page diff".
function attachEvents(blockRef: React.MutableRefObject<string>,
                    innerRef: React.RefObject<HTMLElement>,
                    props: BlockProps) {

    socket.on('page diff', (update) => {
        if (update.blockId === props.id) {
            blockRef.current = update.newValue;
            moveCaretToEnd(innerRef, blockRef.current);
        }
    });
}

// handleChange comes in for any change in the block's content.
function handleChange(event: ContentEditableEvent, blockRef: React.MutableRefObject<string>, props: BlockProps) {

    if (event !== null) {
        blockRef.current = event.target.value;
        console.log(blockRef.current);
        socket.emit('page diff', {
            pageId: props.pageId,
            blockId: props.id,
            newValue: blockRef.current
        })
    }
}

// handleBlur comes in when the block goes out of focus.
function handleBlur(blockRef: React.MutableRefObject<string>, props: BlockProps) {
        
    const block = {...props};
    block.html = blockRef.current;
    props.updateBlock(block);
}

function handleKeyDown(event: React.KeyboardEvent, blockRef: React.MutableRefObject<string>, 
                        props: BlockProps, handleBlur: (blockRef: React.MutableRefObject<string>, props: BlockProps) => void) {

    if (event === null) {
        return;
    }

    if (event.key === 'Enter') {
        event.preventDefault();
        handleBlur(blockRef, props);
        props.insertBlock(props.pageId, props.position + 1);
        props.fetchAgain();
    }

    if (event.key === 'Backspace' && (blockRef.current === '' || blockRef.current === '<br>')) {
        props.deleteBlock(props.id);
    }
}

function bringFocusIfSpecified(innerRef: React.RefObject<HTMLElement>, props: BlockProps) {

    if (props.haveFocus && innerRef.current) {
        innerRef.current.focus();
    }
}

// the core component that renders a contentEditable block.
export function Block(props: BlockProps): JSX.Element {

    const blockRef = React.useRef(props.html);
    const ref = React.useRef<HTMLElement>(null);

    attachEvents(blockRef, ref, props);
    bringFocusIfSpecified(ref, props);
    
    return(
        <ContentEditable
            onChange={function (event: ContentEditableEvent) {
                handleChange(event, blockRef, props)
            }}
            onBlur={function () {
                handleBlur(blockRef, props)
            }}
            onKeyDown={function (event: React.KeyboardEvent<Element>) {
                handleKeyDown(event, blockRef, props, handleBlur)
            }}
            html={blockRef.current}
            tagName={props.tag}
            innerRef={ref}
            disabled={!props.canEdit}
        />
    );
}