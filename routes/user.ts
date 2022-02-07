import * as express from 'express';
import * as messages from './http_messages';
import { UserService, errors } from '../service/';
import { ErrInvalidJWT } from '../service/errors';

const userRouter = express.Router();
const userService = UserService.getInstance();

// returns cookie config depending on environment
function getCookieConfig(): express.CookieOptions {

    if (process.env.NODE_ENV === 'production') {
        return {
            maxAge: 86400000, // 1 day in ms
            httpOnly: true, // prevent attackers from stealing JWT
            secure: true
        }
    }
    return {
        maxAge: 86400000, // 1 day in ms
        httpOnly: false,
        secure: false
    }
}

/**
 * @api {post} /api/user/signup Signup
 * @apiGroup User
 * @apiName Signup
 * @apiBody {string} firstName Mandatory 
 * @apiBody {string} lastName  Mandatory 
 * @apiBody {string} email     Mandatory 
 * @apiBody {string} password  Mandatory (format: Min. 8 chars, atleast 1 number, 1 lowercase character, 1 uppercase character, 1 special character)
 * @apiError (ClientError) {json} 400 InvalidEmailFormat or InvalidPasswordFormat or InvalidPasswordFormat
 * @apiError (ServerError) {json} 500 Need to check server logs
 * @apiVersion 0.1.0
 */
userRouter.post('/signup', async (req: express.Request, res: express.Response) => {
    
    try {
        await userService.signup(req.body);
        res.status(201).json({ message: messages.MESSAGE_201 });
    } catch (err) {
        if (err instanceof errors.ErrInvalidEmailFormat
            || err instanceof errors.ErrInvalidPasswordFormat
            || err instanceof errors.ErrEmailExists) {
                res.status(400).json({ message: err.message });
                return;
        }
        console.log(err);
        res.status(500).json({ message: messages.MESSAGE_500 });
    }
});

/**
 * @api {post} /api/user/login Login
 * @apiGroup User
 * @apiName Login
 * @apiBody {string} email     Mandatory 
 * @apiBody {string} password  Mandatory
 * @apiError (ClientError) {json} 400 InvalidEmailPassword
 * @apiError (ServerError) {json} 500 Need to check server logs
 * @apiSuccess {string} firstName First name of the user.
 * @apiSuccess {string} lastName Lastt name of the user.
 * @apiVersion 0.1.0
 * @apiDescription HTTP-only cookie is set.
 */
userRouter.post('/login', async (req: express.Request, res: express.Response) => {
    
    try {
        const { email, password } = req.body;
        const response = await userService.login(email, password);
        res.cookie('token', response.token, getCookieConfig());
        res.status(200).json({
            firstName: response.firstName,
            lastName: response.lastName
        });
    } catch (err) {
        if (err instanceof errors.ErrInvalidEmailPassword) {
            res.status(400).json({ message: err.message });
            return;
        }
        console.log(err);
        res.status(500).json({ message: messages.MESSAGE_500 });
    }
});

/**
 * @api {post} /api/user/logout Logout
 * @apiGroup User
 * @apiName Logout
 * @apiError (ServerError) {json} 500 Need to check server logs
 * @apiVersion 0.1.0
 * @apiDescription The HTTP-only cookie set during login will be used.
 */
userRouter.post('/logout', async (req: express.Request, res: express.Response) => {
    
    try {
        await userService.logout(req.cookies['token']);
        res.clearCookie('token');
        res.status(200).json({ message: messages.MESSAGE_200 });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: messages.MESSAGE_500 });
    }
});

async function verifyTokenMiddleware(req: express.Request, res: express.Response, 
    next: express.NextFunction) {
        try {
            const token = req.cookies['token'];
            const { userId } = await userService.verifyAndDecodeJWT(token);
            req.body.userId = userId;
            next();
        } catch (err) {
            if (err instanceof ErrInvalidJWT) {
                res.status(400).json({ message: err.message });
            }
            console.log(err);
            res.status(500).json({ message: messages.MESSAGE_500 });
        }
}

userRouter.use('/', verifyTokenMiddleware);

/**
 * @api {put} /api/user/firstName Update first name
 * @apiGroup User
 * @apiName Update first name
 * @apiBody {string} email      Mandatory 
 * @apiBody {string} firstName  Mandatory, the new first name 
 * @apiError (ClientError) {json} 400 ErrUpdateUserField
 * @apiError (ServerError) {json} 500 Need to check server logs
 * @apiVersion 0.1.0
 * @apiDescription This will only update the database. In order to reflect
 * the changes in the user interface, a refresh or view update might be needed.
 * User needs to be authenticated to hit this endpoint.
 */
userRouter.put('/firstName', async (req: express.Request, res: express.Response) => {
    
    try {
        const { email, firstName } = req.body;
        await userService.updateFirstName(email, firstName);
        res.status(204).json({ message: messages.MESSAGE_204 });
    } catch (err) {
        if (err instanceof errors.ErrUpdateUserField) {
            res.status(400).json({ message: err.message });
            return;
        }
        console.log(err);
        res.status(500).json({ message: messages.MESSAGE_500 });
    }
});

/**
 * @api {put} /api/user/lastName Update last name
 * @apiGroup User
 * @apiName Update last name
 * @apiBody {string} email      Mandatory 
 * @apiBody {string} lastName  Mandatory, the new last name
 * @apiError (ClientError) {json} 400 ErrUpdateUserField 
 * @apiError (ServerError) {json} 500 Need to check server logs
 * @apiVersion 0.1.0
 * @apiDescription This will only update the database. In order to reflect
 * the changes in the user interface, a refresh or view update might be needed.
 * User needs to be authenticated to hit this endpoint.
 */
userRouter.put('/lastName', async (req: express.Request, res: express.Response) => {
    
    try {
        const { email, lastName } = req.body;
        await userService.updateLastName(email, lastName);
        res.status(204).json({ message: messages.MESSAGE_204 });
    } catch (err) {
        if (err instanceof errors.ErrUpdateUserField) {
            res.status(400).json({ message: err.message });
            return;
        }
        console.log(err);
        res.status(500).json({ message: messages.MESSAGE_500 });
    }
});

/**
 * @api {put} /api/user/password Update password
 * @apiGroup User
 * @apiName Update password
 * @apiBody {string} email        Mandatory 
 * @apiBody {string} oldPassword  Mandatory, the password you have
 * @apiBody {string} newPassword  Mandatory, the password you want
 * @apiError (ClientError) {json} 400 ErrUpdateUserField
 * @apiError (ServerError) {json} 500 Need to check server logs
 * @apiVersion 0.1.0
 * @apiDescription User needs to be authenticated to hit this endpoint.
 */
userRouter.put('/password', async (req: express.Request, res: express.Response) => {
    
    try {
        const { email, oldPassword, newPassword } = req.body;
        await userService.updatePassword(email, oldPassword, newPassword);
        res.status(204).json({ message: messages.MESSAGE_204 });
    } catch (err) {
        if (err instanceof errors.ErrUpdateUserField) {
            res.status(400).json({ message: err.message });
            return;
        }
        console.log(err);
        res.status(500).json({ message: messages.MESSAGE_500 });
    }
});

/**
 * @api {delete} /api/user/password Delete account
 * @apiGroup User
 * @apiName Delete account
 * @apiError (ServerError) {json} 500 Need to check server logs
 * @apiVersion 0.1.0
 * @apiDescription This happens through the usage of HTTP-only cookie.
 */
userRouter.delete('/', async (req: express.Request, res: express.Response) => {
    
    try {
        await userService.deleteUser(req.body.userId);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: messages.MESSAGE_500 });
    }
});

export {
    userRouter,
    verifyTokenMiddleware
};
