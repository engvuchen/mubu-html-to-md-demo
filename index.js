const Koa = require('koa');
const fs = require('fs');
const logger = require('koa-logger');
const koaBody = require('koa-body');
const router = require('@koa/router')();

const app = new Koa();

// middlewares

app.use(logger());
app.use(
  koaBody({
    multipart: true, // 允许客户端上传文件
  })
);

const html = (ctx) => {
  console.log('ctx', ctx);
  // ctx.body = 'Hello World!!!';
  ctx.set('content-type', 'text/html');
  ctx.body = fs.readFileSync('index.html');
};
const uploadHandler = async (ctx, next) => {
  // 客户端上传的文件会在这个对象中存在 ctx.request.files
  // 读取这个文件, 然后存到 upload 文件夹, 实现简易的存储文件功能
  console.log('path', ctx.request.files.image.path);
  let data = fs.readFileSync(ctx.request.files.image.path);
  // fs.writeFileSync(
  //   path.join(__dirname, 'upload', ctx.request.files.image.name),
  //   data
  // );
  ctx.body = { status: 1 };
};
router.get('/', html);
router.post('/upload', uploadHandler);

app.use(router.routes());
app.listen(3000);
