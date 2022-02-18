import * as express from 'express';
import { PageService, errors } from '../service/';
import * as messages from './http_messages';

const pageRouter = express.Router();
const pageService = PageService.getInstance();

/**
 * @api {get} /api/page/all Get all pages
 * @apiGroup Page
 * @apiName Get all pages
 * @apiError (ServerError) {json} 500 Need to check server logs
 * @apiVersion 0.1.0
 * @apiDescription User needs to be authenticated to hit this endpoint.
 */
pageRouter.get('/all', async (req: express.Request, res: express.Response) => {

    try {
        const pages = await pageService.getPages(req.body.userId);
        res.status(200).json(pages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: messages.MESSAGE_500 });
    }
});

/**
 * @api {post} /api/page Create a page
 * @apiGroup Page
 * @apiName Create a page
 * @apiBody {string} name Mandatory, name of the page you want to create
 * @apiError (ClientError) {json} 400 PageNameBlank
 * @apiError (ServerError) {json} 500 Need to check server logs
 * @apiVersion 0.1.0
 * @apiDescription User needs to be authenticated to hit this endpoint.
 */
pageRouter.post('/', async (req: express.Request, res: express.Response) => {
    
    try {
        const { userId, name } = req.body;
        const pageId = await pageService.insertPage({ 
            id: '', owner: userId, name: name
        });
        res.status(201).json({ pageId: pageId });
    } catch (err) {
        if (err instanceof errors.ErrPageNameBlank) {
            res.status(400).json({ message: err.message });
            return;
        }
        console.log(err);
        res.status(500).json({ message: messages.MESSAGE_500 });
    }
});

/**
 * @api {put} /api/page Update page name
 * @apiGroup Page
 * @apiName Update page name
 * @apiBody {string} name Mandatory, new name of your page
 * @apiError (ClientError) {json} 400 PageNameBlank
 * @apiError (ServerError) {json} 500 Need to check server logs
 * @apiVersion 0.1.0
 * @apiDescription User needs to be authenticated to hit this endpoint.
 */
pageRouter.put('/', async (req: express.Request, res: express.Response) => {

    try {
        const { userId, name } = req.body;
        await pageService.updatePageName({
            id: '', owner: userId, name: name
        });
        res.status(204).json({ message: messages.MESSAGE_204 });
    } catch (err) {
        if (err instanceof errors.ErrPageNameBlank) {
            res.status(400).json({ message: err.message });
            return;
        }
        console.log(err);
        res.status(500).json({ message: messages.MESSAGE_500 });
    }
});

/**
 * @api {delete} /api/page Delete a page
 * @apiGroup Page
 * @apiName Delete a page
 * @apiBody {string} pageId Mandatory, id of the page you want to delete
 * @apiError (ServerError) {json} 500 Need to check server logs
 * @apiVersion 0.1.0
 * @apiDescription User needs to be authenticated to hit this endpoint.
 */
pageRouter.delete('/', async (req: express.Request, res: express.Response) => {

    try {
        const { pageId, userId } = req.body;
        await pageService.deletePage(pageId, userId);
        res.status(200).json({ message: messages.MESSAGE_200 });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: messages.MESSAGE_500 });
    }
});

export default pageRouter;
