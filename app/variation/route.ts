import { Midjourney } from '../../mj-api';
import { NextRequest } from 'next/server';
const client = new Midjourney(
  <string>process.env.SERVER_ID,
  <string>process.env.CHANNEL_ID,
  <string>process.env.SALAI_TOKEN
);

client.maxWait = 600;
export const POST = async (req: NextRequest) => {
  const { content, index, msgId, msgHash } = await req.json();
  console.log('variation.handler', content);
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    start(controller) {
      console.log('variation.start', content);
      client
        .Variation(content, index, msgId, msgHash, (uri: string, progress: string) => {
          console.log('variation.loading', uri);
          controller.enqueue(encoder.encode(JSON.stringify({ uri, progress })));
        })
        .then((msg) => {
          console.log('variation.done', msg);
          controller.enqueue(encoder.encode(JSON.stringify(msg)));
          controller.close();
        })
        .catch((err: any) => {
          console.log('variation.error', err);
          controller.close();
        });
    },
  });
  return new Response(readable, {});
};
