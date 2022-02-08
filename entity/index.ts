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
