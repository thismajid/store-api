import { Router , Request, Response } from 'express';

class IndexRoute {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/',(req: Request,res: Response)=>{
      res.send('ok')
    });
  }
}

export default IndexRoute;
