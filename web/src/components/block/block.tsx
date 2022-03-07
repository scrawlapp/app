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
    handleChange: (event: ContentEditableEvent) => void,
    handleBlur: () => void
}

// the core component that renders a contentEditable block
export function Block(props: BlockProps): JSX.Element {

    const blockRef = React.useRef(props.html);

    return(
        <ContentEditable
            html={blockRef.current}
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            tagName={props.tag}
        />
    );
}