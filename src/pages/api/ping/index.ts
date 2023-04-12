export const config = {
  runtime: 'edge'
};

export const pingHandler = async () => {
  return new Response(JSON.stringify({ status: 'pong' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export default pingHandler;
