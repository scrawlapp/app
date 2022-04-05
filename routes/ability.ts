import * as express from 'express';
import { AbilityService, errors } from '../service/';
import * as messages from './http_messages';

const abilityRouter = express.Router();
const abilityService = AbilityService.getInstance();

/**
 * @api {get} /api/ability/pages/ Get all shared pages
 * @apiGroup Ability
 * @apiName Get all shared pages
 * @apiError (ServerError) {json} 500 Need to check server logs
 * @apiVersion 0.1.0
 * @apiDescription User needs to be authenticated to hit this endpoint.
 */
abilityRouter.get('/pages/', async (req: express.Request, res: express.Response) => {

    try {
        const pages = await abilityService.getAllSharedPages(req.body.userId);
        res.status(200).json(pages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: messages.MESSAGE_500 });
    }
});

/**
 * @api {post} /api/ability/ Insert an ability
 * @apiGroup Ability
 * @apiName Insert an ability
 * @apiBody {string} pageId Mandatory
 * @apiBody {string} email Mandatory
 * @apiBody {string} ability Mandatory
 * @apiError (ServerError) {json} 500 Need to check server logs
 * @apiVersion 0.1.0
 * @apiDescription User needs to be authenticated to hit this endpoint.
 */
abilityRouter.post('/', async (req: express.Request, res: express.Response) => {

    try {
        const { pageId, email, ability } = req.body;
        await abilityService.insertAbility(pageId, email, ability);
        res.status(201).json({ message: messages.MESSAGE_201 });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: messages.MESSAGE_500 });
    }
});

/**
 * @api {delete} /api/ability/ Delete an ability
 * @apiGroup Ability
 * @apiName Delete an ability
 * @apiBody {string} pageId Mandatory
 * @apiBody {string} userIdToDelete Mandatory
 * @apiError (ServerError) {json} 500 Need to check server logs
 * @apiVersion 0.1.0
 * @apiDescription User needs to be authenticated to hit this endpoint.
 */
abilityRouter.delete('/', async (req: express.Request, res: express.Response) => {

    try {
        const { pageId, userIdToDelete } = req.body;
        await abilityService.deleteAbility(pageId, userIdToDelete);
        res.status(200).json({ message: messages.MESSAGE_200 });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: messages.MESSAGE_500 });
    }
});

export default abilityRouter;
