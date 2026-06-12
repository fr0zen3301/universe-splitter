// /inmetro/*  ->  https://beacon.inmetro.gov.br/*   (signed beacon, keyless)
import { proxy } from "../_proxy.js";

export const onRequest = (context) => proxy(context, "https://beacon.inmetro.gov.br");
