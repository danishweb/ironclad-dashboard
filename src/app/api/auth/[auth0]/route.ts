import { handleAuth } from '@auth0/nextjs-auth0';

const authHandler = handleAuth();

export const GET = async (req: any, ctx: any) => {
  const params = await ctx.params;
  return authHandler(req, { params });
};
