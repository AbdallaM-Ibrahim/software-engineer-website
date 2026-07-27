import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";

// Per-request memoised Payload Local API client. A single page render calls
// several data helpers, each of which needs a client — React's cache() collapses
// those into one initialisation per request.
export const getPayloadClient = cache(async () => getPayload({ config }));
