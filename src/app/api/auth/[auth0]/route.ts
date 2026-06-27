import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

const authHandler = handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      scope: 'openid profile email'
    },
  }),
});

export const GET = async (req: any, ctx: any) => {
  const params = await ctx.params;
  return authHandler(req, { params });
};
