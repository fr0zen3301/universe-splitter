// /anu/*  ->  https://api.quantumnumbers.anu.edu.au/*   (real quantum; needs key)
//
// Set ANU_API_KEY in the Cloudflare Pages project settings
// (Settings -> Environment variables). It is injected here server-side, so the
// key never reaches the browser. Without a key ANU returns 401 and is skipped.
import { proxy } from "../_proxy.js";

export const onRequest = (context) => {
  const key = context.env && context.env.ANU_API_KEY;
  const headers = key ? { "x-api-key": key } : {};
  return proxy(context, "https://api.quantumnumbers.anu.edu.au", headers);
};
