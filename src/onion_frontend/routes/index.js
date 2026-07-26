import createApiRoutes from './api.js';
import createPageRoutes from './pages.js';

export default () => async (ctx, next) => {
  await createApiRoutes()(ctx, async () => createPageRoutes()(ctx, next));
};
