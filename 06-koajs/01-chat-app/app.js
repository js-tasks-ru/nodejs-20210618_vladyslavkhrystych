const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = [];

router.get('/subscribe', async (ctx) => {
  const delayOnSubscribe = new Promise((resolve) => {
    subscribers.push(resolve);
  });

  const message = await delayOnSubscribe;
  ctx.response.body = message;
});

router.post('/publish', async (ctx) => {
  if (!ctx.request.body.message) {
    return;
  }

  subscribers.forEach((subscriber) => {
    subscriber(ctx.request.body.message);
  });
  ctx.status = 200;
  subscribers = [];
});

app.use(router.routes());

module.exports = app;
