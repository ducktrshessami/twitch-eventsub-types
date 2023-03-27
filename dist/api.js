import { SubscriptionType, TransportMethod } from "./enums.js";
import { FetchError } from "./error.js";
export const API_VERSION = "1";
export const HMAC_PREFIX = "sha256=";
const OAUTH_GRANT_TYPE = "client_credentials";
export const OAUTH_BASE_ENDPOINT = "https://id.twitch.tv/oauth2";
const OAUTH_TOKEN_ENDPOINT = OAUTH_BASE_ENDPOINT + "/token";
const OAUTH_REVOKE_ENDPOINT = OAUTH_BASE_ENDPOINT + "/revoke";
export const API_BASE_ENDPOINT = "https://api.twitch.tv/helix";
const GET_USERS_ENDPOINT = API_BASE_ENDPOINT + "/users";
const SUBSCRIPTION_ENDPOINT = API_BASE_ENDPOINT + "/eventsub/subscriptions";
const GET_CHANNELS_ENDPOINT = API_BASE_ENDPOINT + "/channels";
const GET_STREAMS_ENDPOINT = API_BASE_ENDPOINT + "/streams";
async function oauthRequest(url, body) {
    const query = new URLSearchParams(body);
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: query.toString()
    });
    if (res.status === 200) {
        return res;
    }
    else {
        throw new FetchError(res);
    }
}
export async function getClientCredentials(clientId, clientSecret) {
    const res = await oauthRequest(OAUTH_TOKEN_ENDPOINT, {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: OAUTH_GRANT_TYPE
    });
    return await res.json();
}
export async function revokeClientCredentials(clientId, token) {
    await oauthRequest(OAUTH_REVOKE_ENDPOINT, {
        client_id: clientId,
        token
    });
}
export async function authorize(clientId, clientSecret, fn) {
    let result;
    let error;
    const { access_token } = await getClientCredentials(clientId, clientSecret);
    try {
        result = await fn(access_token);
    }
    catch (err) {
        error = err;
    }
    finally {
        await revokeClientCredentials(clientId, access_token);
        if (error) {
            throw error;
        }
        else {
            return result;
        }
    }
}
async function authorizedRequest(clientId, accessToken, url, method, options) {
    const target = new URL(url);
    const headers = {
        "Client-Id": clientId,
        Authorization: `Bearer ${accessToken}`
    };
    let body = null;
    if (options.body) {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(options.body);
    }
    if (options.query) {
        target.search = options.query.toString();
    }
    return await fetch(target, {
        method,
        headers,
        body
    });
}
export async function getUsers(clientId, accessToken, options) {
    const query = new URLSearchParams();
    options.ids?.forEach(id => query.append("id", id));
    options.logins?.forEach(login => query.append("login", login));
    const res = await authorizedRequest(clientId, accessToken, GET_USERS_ENDPOINT, "GET", { query });
    if (res.status === 200) {
        return await res.json();
    }
    else {
        throw new FetchError(res);
    }
}
export async function getChannels(clientId, accessToken, ids) {
    const query = new URLSearchParams();
    ids.forEach(id => query.append("broadcaster_id", id));
    const res = await authorizedRequest(clientId, accessToken, GET_CHANNELS_ENDPOINT, "GET", { query });
    if (res.status === 200) {
        return await res.json();
    }
    else {
        throw new FetchError(res);
    }
}
export async function getStreams(clientId, accessToken, { userIds, userLogins, gameIds, ...nonIterOptions }) {
    const query = new URLSearchParams(nonIterOptions);
    userIds?.forEach(id => query.append("user_id", id));
    userLogins?.forEach(login => query.append("user_login", login));
    gameIds?.forEach(id => query.append("game_id", id));
    const res = await authorizedRequest(clientId, accessToken, GET_STREAMS_ENDPOINT, "GET", { query });
    if (res.status === 200) {
        return await res.json();
    }
    else {
        throw new FetchError(res);
    }
}
export async function subscribe(clientId, accessToken, broadcasterId, callbackEndpoint, secret) {
    const res = await authorizedRequest(clientId, accessToken, SUBSCRIPTION_ENDPOINT, "POST", {
        body: {
            type: SubscriptionType.StreamOnline,
            version: API_VERSION,
            condition: { broadcaster_user_id: broadcasterId },
            transport: {
                method: TransportMethod.Webhook,
                callback: callbackEndpoint,
                secret: secret
            }
        }
    });
    if (res.status !== 202) {
        throw new FetchError(res);
    }
}
export async function getSubscriptions(clientId, accessToken, options = {}) {
    const res = await authorizedRequest(clientId, accessToken, SUBSCRIPTION_ENDPOINT, "GET", { query: new URLSearchParams(options) });
    if (res.status === 200) {
        return await res.json();
    }
    else {
        throw new FetchError(res);
    }
}
export async function deleteSubscription(clientId, accessToken, subscriptionId) {
    const res = await authorizedRequest(clientId, accessToken, SUBSCRIPTION_ENDPOINT, "DELETE", { query: new URLSearchParams({ id: subscriptionId }) });
    if (res.status !== 204) {
        throw new FetchError(res);
    }
}
