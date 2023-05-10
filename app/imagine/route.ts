import { NextApiHandler, NextApiRequest } from 'next';
import { Midjourney } from '../../mj-api';
import { ResponseError } from '../../interfaces';
import { NextRequest } from 'next/server';

const client = new Midjourney(
  <string>process.env.SERVER_ID,
  <string>process.env.CHANNEL_ID,
  <string>process.env.SALAI_TOKEN
);

client.maxWait = 600;
export const POST = async (req: NextRequest) => {
  const { prompt } = await req.json();
  console.log('imagine.handler', prompt);
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    start(controller) {
      console.log('imagine.start', prompt);
      client
        .Imagine(prompt, (uri: string, progress: string) => {
          console.log('imagine.loading', uri);
          controller.enqueue(encoder.encode(JSON.stringify({ uri, progress })));
        })
        .then((msg) => {
          console.log('imagine.done', msg);
          controller.enqueue(encoder.encode(JSON.stringify(msg)));
          controller.close();
        })
        .catch((err: ResponseError) => {
          console.log('imagine.error', err);
          controller.close();
        });
    },
  });
  return new Response(readable, {});
};
