const Koa = require('koa');
const logger = require('koa-logger');
const koaBody = require('koa-body');
const { html2md } = require('mubu-html-to-md');
const fs = require('fs');
const router = require('@koa/router')();

const app = new Koa();

app.use(logger());
app.use(
  koaBody({
    multipart: true, // 允许客户端上传文件
  })
);

const html = ctx => {
  ctx.set('content-type', 'text/html');
  ctx.body = fs.readFileSync('index.html');
};
const uploadHandler = async (ctx, next) => {
  // 客户端上传的文件在 ctx.request.files
  // console.log('ctx', ctx.request.files);
  let data = fs.readFileSync(ctx?.request?.files['mubu-html']?.filepath) || '';
  let md = html2md(data) || '';
  ctx.set('content-type', 'text/markdown');
  ctx.body = { status: 200, md };
};
router.get('/', html);
router.post('/upload', uploadHandler);

app.use(router.routes());
app.listen(3000);
