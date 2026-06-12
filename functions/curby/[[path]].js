// /curby/*  ->  https://random.colorado.edu/*   (Bell-test quantum beacon, keyless)
import { proxy } from "../_proxy.js";

export const onRequest = (context) => proxy(context, "https://random.colorado.edu");
