import { StreamOnlineWebhookBody, WebhookBody } from "./api.js";
import { SubscriptionType } from "./enums.js";

export function channelUrl(name: string): string {
    return `https://www.twitch.tv/${name}`;
}

export function isStreamOnlineBody(body: WebhookBody): body is StreamOnlineWebhookBody {
    return body.subscription.type === SubscriptionType.StreamOnline;
}

export type Awaitable<T> = T | Promise<T>;
