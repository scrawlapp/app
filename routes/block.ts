import * as express from 'express';
import { BlockService, errors } from '../service/';
import * as messages from './http_messages';

const blockRouter = express.Router();
const blockService = BlockService.getInstance();

/**
 * @api {get} /api/block/all/:pageId Get all blocks
 * @apiGroup Block
 * @apiName Get all blocks
 * @apiParam {string} pageId id of page for which blocks are needed
 * @apiError (ServerError) {json} 500 Need to check server logs
 * @apiVersion 0.1.0
 * @apiDescription User needs to be authenticated to hit this endpoint.
 */
blockRouter.get('/all/:pageId', async (req: express.Request, res: express.Response) => {

    try {
        const blocks = await blockService.getAllBlocks(req.params['pageId']);
        res.status(200).json(blocks);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: messages.MESSAGE_500 });
    }
});

/**
 * @api {post} /api/block/ Insert a block
 * @apiGroup Block
 * @apiName Insert a block
 * @apiBody {string} pageId Mandatory
 * @apiBody {string} tag Mandatory
 * @apiBody {string} html Mandatory
 * @apiBody {number} position Mandatory
 * @apiBody {string} src Mandatory can be null
 * @apiBody {string} href Mandatory can be null
 * @apiError (ServerError) {json} 500 Need to check server logs
 * @apiVersion 0.1.0
 * @apiDescription User needs to be authenticated to hit this endpoint.
 */
blockRouter.post('/', async (req: express.Request, res: express.Response) => {

    try {
        const id = await blockService.insertBlock(req.body);
        res.status(201).json({ id: id });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: messages.MESSAGE_500 });
    }
});

/**
 * @api {put} /api/block/ Update a block
 * @apiGroup Block
 * @apiName Update a block
 * @apiBody {string} id Mandatory
 * @apiBody {string} pageId Mandatory
 * @apiBody {string} tag Mandatory
 * @apiBody {string} html Mandatory
 * @apiBody {number} position Mandatory
 * @apiBody {string} src Mandatory can be null
 * @apiBody {string} href Mandatory can be null
 * @apiError (ServerError) {json} 500 Need to check server logs
 * @apiVersion 0.1.0
 * @apiDescription User needs to be authenticated to hit this endpoint.
 */
blockRouter.put('/', async (req: express.Request, res: express.Response) => {

    try {
        await blockService.updateBlock(req.body);
        res.status(204).json({ message: messages.MESSAGE_204 });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: messages.MESSAGE_500 });
    }
});

/**
 * @api {delete} /api/block/ Delete a block
 * @apiGroup Block
 * @apiName Delete a block
 * @apiBody {string} id Mandatory id of the block
 * @apiError (ServerError) {json} 500 Need to check server logs
 * @apiVersion 0.1.0
 * @apiDescription User needs to be authenticated to hit this endpoint.
 */
blockRouter.delete('/', async (req: express.Request, res: express.Response) => {

    try {
        await blockService.deleteBlock(req.body.id);
        res.status(200).json({ message: messages.MESSAGE_200 });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: messages.MESSAGE_500 });
    }
});
