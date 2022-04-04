import * as express from 'express';
import { userRouter, verifyTokenMiddleware } from './user';
import pageRouter from './page';
import blockRouter from './block';
import abilityRouter from './ability';

const router: express.Router = express.Router();
router.use('/user', userRouter);
router.use(verifyTokenMiddleware);
router.use('/page', pageRouter);
router.use('/block', blockRouter);
router.use('/ability', abilityRouter);
export default router;
