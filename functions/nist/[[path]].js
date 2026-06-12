// /nist/*  ->  https://beacon.nist.gov/*   (signed randomness beacon, keyless)
import { proxy } from "../_proxy.js";

export const onRequest = (context) => proxy(context, "https://beacon.nist.gov");
