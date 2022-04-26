// describe how the Page looks like in memory
export interface PageStructure {
    id: string,
    owner: string,
    name: string
}

// describe how the shared page looks like in memory
export interface SharedPageStructure {
    id: string,
    name: string,
    ability: string
}

// describe how the selected page looks like in memory
export interface SelectedPageStructure {
    id: string,
    name: string,
    shared: boolean,
    ability: string
}

// GET /api/page/all/
// takes in the state updater function to add data
export function fetchAllPages(setPagesList: React.Dispatch<React.SetStateAction<PageStructure[]>>) {

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

// GET /api/ability/pages/
// takes in the state updater function to add data
export function fetchAllSharedPages(setSharedPagesList: React.Dispatch<React.SetStateAction<SharedPageStructure[]>>) {

    fetch('/api/ability/pages', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((data) => setSharedPagesList(data))
    .catch((err) => console.log(err));
}

export async function getMoodAndUpdateUI(pageId: string, moodAddress: string,
    setMood: React.Dispatch<React.SetStateAction<string>>,
    setDisplay: React.Dispatch<React.SetStateAction<string>>) {
    try {
        const response = await fetch(`/api/block/all/${pageId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json();
        let text = '';
        for (let i = 0; i < data.length; ++i) {
            text += data[i].html;
        }
        const moodResponse = await fetch(`${moodAddress}/api`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userInput": text
            })
        });
        const moodData = await moodResponse.json();
        console.log(moodData);
        setMood(moodData);
        setDisplay("inline-block");
    } catch (err) {
        console.log(err);
    }
}

