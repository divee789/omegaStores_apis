import dotenv from 'dotenv';
dotenv.config();

import express, {
  Express,
  Request,
  Response,
  NextFunction,
} from 'express';
import path from 'path';
import logger from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import indexRouter from './api/routes/index';
import errorHandle from './api/middlewares/errorHandlers';

class AppModule {
  public app: Express;

  constructor() {
    this.app = express();
    this.app.set('views', path.join(__dirname, '../views'));
    this.app.set('view engine', 'ejs');

    this.app.use(cors());
    this.app.options('*', cors());

    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(logger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(express.static(path.join(__dirname, '../public')));
    this.loadRoutes();
    this.handleErrors();
  }

  private loadRoutes() {
    this.app.use('/', indexRouter);
  }

  private handleErrors() {
    this.app.use(errorHandle);
    // handle 404 errors
    this.app.use((req, res, _next): void => {
      res.status(404).json({
        status: false,
        message: 'resource not found',
        data: null,
        path: req.url,
      });
    });
    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error =
          req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
      },
    );
  }
}

const { app } = new AppModule();

export default app;
