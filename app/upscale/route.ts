import { NextRequest } from 'next/server';
import { Midjourney } from '../../mj-api';

const client = new Midjourney(
  <string>process.env.SERVER_ID,
  <string>process.env.CHANNEL_ID,
  <string>process.env.SALAI_TOKEN
);

client.maxWait = 600;
export const POST = async (req: NextRequest) => {
  const { content, index, msgId, msgHash } = await req.json();
  console.log('upscale.handler', content);
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    start(controller) {
      console.log('upscale.start', content);
      client
        .Upscale(content, index, msgId, msgHash, (uri: string, progress: string) => {
          console.log('upscale.loading', uri);
          controller.enqueue(encoder.encode(JSON.stringify({ uri, progress })));
        })
        .then((msg) => {
          console.log('upscale.done', msg);
          controller.enqueue(encoder.encode(JSON.stringify(msg)));
          controller.close();
        })
        .catch((err: any) => {
          console.log('upscale.error', err);
          controller.close();
        });
    },
  });
  return new Response(readable, {});
};
