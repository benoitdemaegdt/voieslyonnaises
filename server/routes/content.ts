import { serverQueryContent } from '#content/server';
export default defineEventHandler(async event => {
  const content = await serverQueryContent(event).where({ _dir: 'voies-lyonnaises', _type: 'markdown' }).find();
  return { content };
});
