import { StreamOnlineWebhookBody, WebhookBody } from "./api.js";
export declare function channelUrl(name: string): string;
export declare function isStreamOnlineBody(body: WebhookBody): body is StreamOnlineWebhookBody;
export type Awaitable<T> = T | Promise<T>;
