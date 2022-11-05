import type { NextRequest } from 'next/server';

export const config = {
  runtime: 'experimental-edge'
};

export const helloEndpoint = async function (req: NextRequest) {
  return new Response(JSON.stringify({ name: 'John Doe' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export default helloEndpoint;
