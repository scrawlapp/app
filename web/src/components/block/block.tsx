import { ContentEditableEvent } from 'react-contenteditable';
import ContentEditable from './contentEditable';
import { io } from "socket.io-client";
import React from 'react';

// describe how props look like for Block
export interface BlockProps {

    id: string,
    pageId: string,
    tag: string,
    html: string,
    position: number,
    href: string | null,
    src: string | null,
    insertBlock: (pageId: string, position: number) => void
    updateBlock: (block: any) => void
    deleteBlock: (blockId: string) => void
    fetchAgain: () => void
    haveFocus: boolean
}

const socket = io();

// the core component that renders a contentEditable block.
export function Block(props: BlockProps): JSX.Element {

    const blockRef = React.useRef(props.html);
    const ref = React.useRef<HTMLElement>(null);
    const [updateBlock, updateBlockCue] = React.useState<number>(0);

    socket.on('page diff', (update) => {
        blockRef.current = update.newValue;
    });

    function handleChange(event: ContentEditableEvent) {

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
    
    function handleBlur() {
        
        const block = {...props};
        block.html = blockRef.current;
        props.updateBlock(block);
    }

    function handleKeyDown(event: React.KeyboardEvent) {

        if (event === null) {
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            handleBlur();
            props.insertBlock(props.pageId, props.position + 1);
            props.fetchAgain();
        }

        if (event.key === 'Backspace' && (blockRef.current === '' || blockRef.current === '<br>')) {
            props.deleteBlock(props.id);
        }
    }

    if (props.haveFocus && ref.current) {
        ref.current.focus();
    }

    return(
        <ContentEditable
            html={blockRef.current}
            onChange={handleChange}
            onBlur={handleBlur}
            tagName={props.tag}
            onKeyDown={handleKeyDown}
            innerRef={ref}
        />
    );
}