import { Router } from 'express';
import { Request, Response } from '../misc/types/requestResponseTypes';
import { verifySessionToken, verifySessionAndCsrfTokens } from '../misc/authHelpers/middlewares';

const appRouter = Router();

appRouter.use('/protectedCsrfRoute', verifySessionAndCsrfTokens, (req, res) => {
  res.send('Hello! Csrf protected route response');


});

appRouter.use('/', verifySessionToken, (req: Request, res: Response) => {
  res.send('Hello you are logged in!');


});

export default appRouter;
