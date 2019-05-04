import http from 'http';
import crary from '..';
import routes from './routes';

const app = crary.express.createApp({
  log4js_config: {
    appenders: {
      console: {
        type: 'console',
      },
    },
    categories: {
      default: {
        appenders: ['console'],
        level: 'info',
      },
    },
  },
  project_root: __dirname,
  routers: routes,
  session_secret: 'secret',
  session_ttl: 360,
});

const server = http.createServer(app);

server.listen(3000, () => {
  console.log('Server started');
});
