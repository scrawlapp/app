// describe how the block looks like during network calls
export interface BlockStructure {

    id: string
    pageId: string
    tag: string
    html: string
    position: number
    href: string | null
    src: string | null
}

const headers =  {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

// POST /api/block/
export function insertAnEmptyBlock(pageId: string, position: number) {

    if (pageId.length < 32) {
        return;
    }

    fetch('/api/block/', {
        method: 'POST',
        headers: headers,
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
export function updateBlock(block: any) {
    
    fetch(`/api/block/`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(block)
    })
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
}

// GET /api/block/all/:pageId
export function fetchAllBlocks(pageId: string, setBlocks: React.Dispatch<React.SetStateAction<BlockStructure[]>>) {

    fetch(`/api/block/all/${pageId}`, {
        method: 'GET',
        headers: headers,
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
export function deleteBlock(blockId: string) {

    fetch(`/api/block/`, {
        method: 'DELETE',
        headers: headers,
        body: JSON.stringify({id: blockId})
    })
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
}
