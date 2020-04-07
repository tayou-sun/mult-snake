import express from "express";

class App {
  public app: any;

  constructor () {
    this.app = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router()
    router.get('/', (req: any, res: any) => {
      res.json({
        message: 'Hello World!'
      })
    })
    this.app.use('/', router)
  }
}

export default new App().app