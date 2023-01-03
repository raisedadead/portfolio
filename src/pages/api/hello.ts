// Next.js Edge API Routes: https://nextjs.org/docs/api-routes/edge-api-routes

import type { NextRequest } from 'next/server';

export const apiResponse = async (req: NextRequest) => {
  return new Response(JSON.stringify({ name: 'Hello World' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export default apiResponse;
