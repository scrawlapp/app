// Structure of a User in the application
export interface User {

    id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

// Structure of a Page in the application
export interface Page {

    id: string,
    owner: string,
    name: string
}

// Structure of a Block in the application
export interface Block {

    id: string,
    pageId: string,
    tag: string,
    html: string,
    position: number,
    href: string | null,
    src: string | null
}

// Structure of what the user is capable of doing with a page in the application
export interface Ability {

    pageId: string,
    userId: string,
    ability: string
}
