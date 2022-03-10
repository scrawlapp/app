import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
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
    insertBlock: (pageId: string) => void
    updateBlock: (block: any) => void
    deleteBlock: (blockId: string) => void
}

// the core component that renders a contentEditable block.
export function Block(props: BlockProps): JSX.Element {

    const blockRef = React.useRef(props.html);

    function handleChange(event: ContentEditableEvent) {

        if (event !== null) {
            blockRef.current = event.target.value;
            console.log(blockRef.current);
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
            props.insertBlock(props.pageId);
        }

        if (event.key === 'Backspace' && blockRef.current === '') {
            props.deleteBlock(props.id);
        }
    }

    return(
        <ContentEditable
            html={blockRef.current}
            onChange={handleChange}
            onBlur={handleBlur}
            tagName={props.tag}
            onKeyDown={handleKeyDown}
        />
    );
}