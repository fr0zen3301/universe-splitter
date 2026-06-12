// Shared reverse-proxy helper for Cloudflare Pages Functions.
//
// Each route file (qrng, nist, inmetro, anu, curby) forwards its requests here.
// The browser only ever calls our own origin (same-origin, so no CORS), and this
// function does the outbound fetch server-side. Any API key stays on the server.
//
// This is the production twin of the Vite dev proxy in vite.config.js.

export async function proxy(context, targetOrigin, extraHeaders = {}) {
  const { request, params } = context;
  const url = new URL(request.url);

  // params.path is the catch-all segments after the route prefix.
  const segments = params && params.path
    ? (Array.isArray(params.path) ? params.path.join("/") : params.path)
    : "";

  const targetUrl = `${targetOrigin}/${segments}${url.search}`;

  try {
    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers: extraHeaders,
    });

    const headers = new Headers();
    const ct = upstream.headers.get("content-type");
    if (ct) headers.set("content-type", ct);
    headers.set("cache-control", "no-store");

    return new Response(upstream.body, { status: upstream.status, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: "proxy_failed" }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }
}
