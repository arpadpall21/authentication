import { Router, Request, Response } from 'express';

const appRouter = Router();

appRouter.use('/', (req: Request, res: Response) => {
  
  // if logged in
  res.send("Hello you are logged in!");
  
  // if not logged in redirect to login...
});

export default appRouter;
