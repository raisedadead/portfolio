import type { NextRequest } from 'next/server';

export const config = {
  runtime: 'experimental-edge'
};

export const helloEndpoint = async function (req: NextRequest) {
  console.log(req);
  return new Response(JSON.stringify({ name: 'Hello World' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export default helloEndpoint;
