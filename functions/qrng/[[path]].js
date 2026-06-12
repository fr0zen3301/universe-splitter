// /qrng/*  ->  https://qrandom.io/*   (quantum vacuum, keyless)
import { proxy } from "../_proxy.js";

export const onRequest = (context) => proxy(context, "https://qrandom.io");
