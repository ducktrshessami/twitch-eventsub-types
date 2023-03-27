import { SubscriptionType } from "./enums.js";
export function channelUrl(name) {
    return `https://www.twitch.tv/${name}`;
}
export function isStreamOnlineBody(body) {
    return body.subscription.type === SubscriptionType.StreamOnline;
}
