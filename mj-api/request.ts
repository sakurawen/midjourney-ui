import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
const proxyAgent = new HttpsProxyAgent('http://localhost:7890');

export const request = axios.create({
  httpsAgent: proxyAgent,
});
