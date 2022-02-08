import * as express from 'express';
import { userRouter, verifyTokenMiddleware } from './user';
import pageRouter from './page';

const router: express.Router = express.Router();
router.use('/user', userRouter);
router.use(verifyTokenMiddleware);
router.use('/page', pageRouter);
export default router;
