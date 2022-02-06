import * as cache from '../cache';
import * as entity from '../entity';
import * as database from '../database';
import * as errors from './errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export class UserService {

    private static instance: UserService;
    private constructor() {}

     // follows the singleton pattern
     public static getInstance(): UserService {

        if (!UserService.instance) {
            UserService.instance = new UserService();
        }

        return UserService.instance;
    }

    public async signup(user: entity.User) {

        try {
            if (!this.isValidEmail(user.email)) {
                throw new errors.ErrInvalidEmailFormat;
            }
    
            if (!this.isValidPassword(user.password)) {
                throw new errors.ErrInvalidPasswordFormat;
            }

            const u = await database.getUser(user.email);
            if (u.id !== '') {
                throw new errors.ErrEmailExists;
            }

            user.password = await bcrypt.hash(user.password, 10) // number of rounds
            await database.insertUser(user);
        } catch (err) {
            throw err;
        }
    }

    // returns a JWT if credentials are valid
    public async login(email: string, password: string): Promise<string> {

        try {

            const user = await database.getUser(email);
            if (user.id === '') {
                throw new errors.ErrInvalidEmailPassword;
            }

            const isGood = await bcrypt.compare(password, user.password);
            
            if (!isGood) {
                throw new errors.ErrInvalidEmailPassword;
            }

            return this.createJWT(user.id);
        } catch (err) {

            throw err;
        }
    }

    // blacklists JWT
    public async logout(token: string) {

        try {
            const cacheClient = cache.getClient();
            await cacheClient.SET(token, 'true');
        } catch (err) {
            throw err;
        }
    }

    // returns an object containing the user's id
    public async verifyAndDecodeJWT(token: string): Promise<any> {

        try {
            const cacheClient = cache.getClient();
            const cached = await cacheClient.GET(token);

            if (cached !== 'true') {
                throw errors.ErrInvalidJWT;
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || '')
            return decoded;
        } catch(err) {
            throw err;
        }
    }

    public async updateFirstName(email: string, firstName: string) {

        try {
            const user = await database.getUser(email);
            await database.updateFirstName(user.id, firstName);
        } catch (err) {
            throw err;
        }
    }

    public async updateLastName(email: string, lastName: string) {

        try {
            const user = await database.getUser(email);
            if (user.id === '') {
                throw new Error('Unable to validate.');
            }
            await database.updateLastName(user.id, lastName);
        } catch (err) {
            throw err;
        }
    }

    public async updatePassword(email: string, oldPassword: string, newPassword: string) {

        try {
            const user = await database.getUser(email);
            if (user.id === '') {
                throw new Error('Unable to validate.');
            }

            const isGood = await bcrypt.compare(oldPassword, user.password);
            if (!isGood) {
                throw new Error('Unable to validate.');
            }

            newPassword = await bcrypt.hash(newPassword, 10);
            await database.updatePassword(user.id, newPassword);
        } catch (err) {
            throw err;
        }
    }

    private createJWT(userId: string): string {
        
        const TOKEN_AGE = '1d';
        const token = jwt.sign({ userId }, process.env.JWT_SECRET || '', { expiresIn: TOKEN_AGE });
        return token;
    }

    private isValidEmail(email: string): boolean {

        const regexEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        return regexEmail.test(email);
    }

    private isValidPassword(password: string): boolean {

        const minLength = 8
        let length = 0
    
        let hasNumber = false
        let hasUppercase = false
        let hasLowercase = false
        let hasSpecial = false
    
        for (let i = 0; i < password.length; ++i) {

            const c = password[i];

            if (c >= '0' && c <= '9') {
                hasNumber = true;
            } else if (c >= 'a' && c <= 'z') {
                hasLowercase = true;
            } else if (c >= 'A' && c <= 'Z') {
                hasUppercase = true;
            } else if (c >= ' ' && c <= '~') {
                hasSpecial = true;
            } else {
                return false;
            }
            ++length;
        }
    
        return length >= minLength && hasNumber && hasLowercase && hasUppercase && hasSpecial
    }
}



