import * as express from 'express';
import{ userRouter, verifyTokenMiddleware } from './user';

const router: express.Router = express.Router();
router.use('/user', userRouter);
router.use(verifyTokenMiddleware);
export default router;
