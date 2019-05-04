import crary from '../../..';

export default (router: crary.ExpressRouter) => {
  // $ curl http://localhost:3000/api/hello
  router.get('/hello', (req, res) => {
    res.sendResult({ msg: 'hello' });
  });
};
