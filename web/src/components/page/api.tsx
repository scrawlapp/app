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

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

// POST /api/block/
export async function insertAnEmptyBlock(pageId: string, position: number) {

    if (pageId.length < 32) {
        return;
    }

    try {
        await fetch('/api/block', {
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
        });
    } catch (err) {
        console.log(err);
    }
} 

// PUT /api/block/
export async function updateBlock(block: any) {
    
    try {
        await fetch(`/api/block/`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(block)
        });
    } catch (err) {
        console.log(err);
    }
}

// GET /api/block/all/:pageId
export async function fetchAllBlocks(pageId: string, 
        setBlocks: React.Dispatch<React.SetStateAction<BlockStructure[]>>) {

    try {
        const response = await fetch(`/api/block/all/${pageId}`, {
            method: 'GET',
            headers: headers
        })
        const data = await response.json();
        if (data.length === 0) {
            insertAnEmptyBlock(pageId, 0);
            fetchAllBlocks(pageId, setBlocks);
            return;
        }
        data.sort((a: BlockStructure, b: BlockStructure): number => {
            return a.position - b.position;
        });
    } catch (err) {
        console.log(err);
    }
}

// DELETE /api/block/
export async function deleteBlock(blockId: string) {

    try {
        await fetch(`/api/block/`, {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify({id: blockId})
        })
    } catch (err) {
        console.log(err);
    }
}
