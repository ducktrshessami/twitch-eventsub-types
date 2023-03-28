import {
    BroadcasterType,
    StreamFilterType,
    StreamType,
    SubscriptionStatus,
    SubscriptionType,
    TransportMethod,
    UserType
} from "./enums.js";
import { FetchError } from "./error.js";
import { Awaitable } from "./util.js";

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

async function oauthRequest(url: string, body: any): Promise<Response> {
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

export async function getClientCredentials(clientId: string, clientSecret: string): Promise<ClientCredentialGrantResponse> {
    const res = await oauthRequest(OAUTH_TOKEN_ENDPOINT, {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: OAUTH_GRANT_TYPE
    } satisfies ClientCredentialGrantQueryPairs);
    return await res.json();
}

export async function revokeClientCredentials(clientId: string, token: string): Promise<void> {
    await oauthRequest(OAUTH_REVOKE_ENDPOINT, {
        client_id: clientId,
        token
    } satisfies ClientCredentialRevokeQueryPairs);
}

export async function authorize<T>(
    clientId: string,
    clientSecret: string,
    fn: (accessToken: string) => Awaitable<T>
): Promise<T> {
    let result: T;
    let error: any;
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
            return result!;
        }
    }
}

async function authorizedRequest(
    clientId: string,
    accessToken: string,
    url: string,
    method: string,
    options: AuthorizedSubscriptionRequestOptions
): Promise<Response> {
    const target = new URL(url);
    const headers: HeadersInit = {
        "Client-Id": clientId,
        Authorization: `Bearer ${accessToken}`
    };
    let body: BodyInit | null = null;
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

export async function getUsers(
    clientId: string,
    accessToken: string,
    options: GetUsersOptions
): Promise<GetResourceResponse<User>> {
    const query = new URLSearchParams();
    options.ids?.forEach(id => query.append("id", id));
    options.logins?.forEach(login => query.append("login", login));
    const res = await authorizedRequest(
        clientId,
        accessToken,
        GET_USERS_ENDPOINT,
        "GET",
        { query }
    );
    if (res.status === 200) {
        return await res.json();
    }
    else {
        throw new FetchError(res);
    }
}

export async function getChannels(
    clientId: string,
    accessToken: string,
    ids: Array<string>
): Promise<GetResourceResponse<Channel>> {
    const query = new URLSearchParams();
    ids.forEach(id => query.append("broadcaster_id", id));
    const res = await authorizedRequest(
        clientId,
        accessToken,
        GET_CHANNELS_ENDPOINT,
        "GET",
        { query }
    );
    if (res.status === 200) {
        return await res.json();
    }
    else {
        throw new FetchError(res);
    }
}

export async function getStreams(
    clientId: string,
    accessToken: string,
    {
        userIds,
        userLogins,
        gameIds,
        ...nonIterOptions
    }: GetStreamsOptions
): Promise<GetStreamsResponse> {
    const query = new URLSearchParams(<Record<string, string>>nonIterOptions);
    userIds?.forEach(id => query.append("user_id", id));
    userLogins?.forEach(login => query.append("user_login", login));
    gameIds?.forEach(id => query.append("game_id", id));
    const res = await authorizedRequest(
        clientId,
        accessToken,
        GET_STREAMS_ENDPOINT,
        "GET",
        { query }
    );
    if (res.status === 200) {
        return await res.json();
    }
    else {
        throw new FetchError(res);
    }
}

export async function subscribe(
    clientId: string,
    accessToken: string,
    broadcasterId: string,
    callbackEndpoint: string,
    secret: string
): Promise<void> {
    const res = await authorizedRequest(
        clientId,
        accessToken,
        SUBSCRIPTION_ENDPOINT,
        "POST",
        {
            body: {
                type: SubscriptionType.StreamOnline,
                version: API_VERSION,
                condition: { broadcaster_user_id: broadcasterId },
                transport: {
                    method: TransportMethod.Webhook,
                    callback: callbackEndpoint,
                    secret: secret
                }
            } satisfies CreateStreamOnlineSubscriptionBody
        }
    );
    if (res.status !== 202) {
        throw new FetchError(res);
    }
}

export async function getSubscriptions(
    clientId: string,
    accessToken: string,
    options: GetSubscriptionsOptions = {}
): Promise<GetEventSubsResponse> {
    const res = await authorizedRequest(
        clientId,
        accessToken,
        SUBSCRIPTION_ENDPOINT,
        "GET",
        { query: new URLSearchParams(options) }
    );
    if (res.status === 200) {
        return await res.json();
    }
    else {
        throw new FetchError(res);
    }
}

export async function deleteSubscription(
    clientId: string,
    accessToken: string,
    subscriptionId: string
): Promise<void> {
    const res = await authorizedRequest(
        clientId,
        accessToken,
        SUBSCRIPTION_ENDPOINT,
        "DELETE",
        { query: new URLSearchParams({ id: subscriptionId }) }
    );
    if (res.status !== 204) {
        throw new FetchError(res);
    }
}

export type BroadcasterTargettedCondition = { broadcaster_user_id: string };
export type ChannelFollowCondition = BroadcasterTargettedCondition & { moderator_user_id: string };
export type ChannelRaidCondition = {
    from_broadcaster_user_id?: string;
    to_broadcaster_user_id?: string;
};
export type ChannelPointsCustomSpecificRewardCondition = BroadcasterTargettedCondition & { reward_id?: string };
export type DropEntitlementGrantCondition = {
    organization_id: string;
    category_id?: string;
    campaign_id?: string;
};
export type ExtensionBitsTransactionCreateCondition = { extension_client_id: string };
export type UserAuthorizationCondition = { client_id: string };
export type UserUpdateCondition = { user_id: string };
export type Condition =
    BroadcasterTargettedCondition |
    ChannelFollowCondition |
    ChannelRaidCondition |
    ChannelPointsCustomSpecificRewardCondition |
    DropEntitlementGrantCondition |
    ExtensionBitsTransactionCreateCondition |
    UserAuthorizationCondition |
    UserUpdateCondition;

export interface BaseSubscription {
    id: string;
    type: `${SubscriptionType}`;
    version: string;
    status: `${SubscriptionStatus}`;
    cost: number;
    condition: object;
    created_at: string;
}
export interface ChannelUpdateSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelUpdate}`;
    condition: BroadcasterTargettedCondition;
}
export interface ChannelFollowSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelFollow}`;
    condition: ChannelFollowCondition;
}
export interface ChannelSubscribeSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelSubscribe}`;
    condition: BroadcasterTargettedCondition;
}
export interface ChannelSubscriptionEndSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelSubscriptionEnd}`;
    condition: BroadcasterTargettedCondition;
}
export interface ChannelSubscriptionGiftSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelSubscriptionGift}`;
    condition: BroadcasterTargettedCondition;
}
export interface ChannelSubscriptionMessageSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelSubscriptionMessage}`;
    condition: BroadcasterTargettedCondition;
}
export interface ChannelCheerSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelCheer}`;
    condition: BroadcasterTargettedCondition;
}
export interface ChannelRaidSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelRaid}`;
    condition: ChannelRaidCondition;
}
export interface ChannelBanSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelBan}`;
    condition: BroadcasterTargettedCondition;
}
export interface ChannelUnbanSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelUnban}`;
    condition: BroadcasterTargettedCondition;
}
export interface ChannelModeratorAddSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelModeratorAdd}`;
    condition: BroadcasterTargettedCondition;
}
export interface ChannelModeratorRemoveSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelModeratorRemove}`;
    condition: BroadcasterTargettedCondition;
}
export interface ChannelPointsCustomRewardAddSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPointsCustomRewardAdd}`;
    condition: BroadcasterTargettedCondition;
}
export interface ChannelPointsCustomRewardUpdateSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPointsCustomRewardUpdate}`;
    condition: ChannelPointsCustomSpecificRewardCondition;
}
export interface ChannelPointsCustomRewardRemoveSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPointsCustomRewardRemove}`;
    condition: ChannelPointsCustomSpecificRewardCondition;
}
export interface ChannelPointsCustomRewardRedemptionAddSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPointsCustomRewardRedemptionAdd}`;
    condition: ChannelPointsCustomSpecificRewardCondition;
}
export interface ChannelPointsCustomRewardRedemptionUpdateSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPointsCustomRewardRedemptionUpdate}`;
    condition: ChannelPointsCustomSpecificRewardCondition;
}
export interface ChannelPollBeginSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPollBegin}`;
    condition: BroadcasterTargettedCondition;
}
export interface ChannelPollProgressSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPollProgress}`;
    condition: BroadcasterTargettedCondition;
}
export interface ChannelPollEndSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPollEnd}`;
    condition: BroadcasterTargettedCondition;
}
export interface ChannelPredictionBeginSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPredictionBegin}`;
    condition: BroadcasterTargettedCondition;
}
export interface ChannelPredictionProgressSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPredictionProgress}`;
    condition: BroadcasterTargettedCondition;
}
export interface ChannelPredictionLockSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPredictionLock}`;
    condition: BroadcasterTargettedCondition;
}
export interface ChannelPredictionEndSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPredictionEnd}`;
    condition: BroadcasterTargettedCondition;
}
export interface CharityDonationSubscription extends BaseSubscription {
    type: `${SubscriptionType.CharityDonation}`;
    condition: BroadcasterTargettedCondition;
}
export interface CharityCampaignStartSubscription extends BaseSubscription {
    type: `${SubscriptionType.CharityCampaignStart}`;
    condition: BroadcasterTargettedCondition;
}
export interface CharityCampaignProgressSubscription extends BaseSubscription {
    type: `${SubscriptionType.CharityCampaignProgress}`;
    condition: BroadcasterTargettedCondition;
}
export interface CharityCampaignStopSubscription extends BaseSubscription {
    type: `${SubscriptionType.CharityCampaignStop}`;
    condition: BroadcasterTargettedCondition;
}
export interface DropEntitlementGrantSubscription extends BaseSubscription {
    type: `${SubscriptionType.DropEntitlementGrant}`;
    condition: DropEntitlementGrantCondition;
}
export interface ExtensionBitsTransactionCreateSubscription extends BaseSubscription {
    type: `${SubscriptionType.ExtensionBitsTransactionCreate}`;
    condition: ExtensionBitsTransactionCreateCondition;
}
export interface GoalBeginSubscription extends BaseSubscription {
    type: `${SubscriptionType.GoalBegin}`;
    condition: BroadcasterTargettedCondition;
}
export interface GoalProgressSubscription extends BaseSubscription {
    type: `${SubscriptionType.GoalProgress}`;
    condition: BroadcasterTargettedCondition;
}
export interface GoalEndSubscription extends BaseSubscription {
    type: `${SubscriptionType.GoalEnd}`;
    condition: BroadcasterTargettedCondition;
}
export interface HypeTrainBeginSubscription extends BaseSubscription {
    type: `${SubscriptionType.HypeTrainBegin}`;
    condition: BroadcasterTargettedCondition;
}
export interface HypeTrainProgressSubscription extends BaseSubscription {
    type: `${SubscriptionType.HypeTrainProgress}`;
    condition: BroadcasterTargettedCondition;
}
export interface HypeTrainEndSubscription extends BaseSubscription {
    type: `${SubscriptionType.HypeTrainEnd}`;
    condition: BroadcasterTargettedCondition;
}
export interface ShieldModeBeginSubscription extends BaseSubscription {
    type: `${SubscriptionType.ShieldModeBegin}`;
    condition: BroadcasterTargettedCondition;
}
export interface ShieldModeEndSubscription extends BaseSubscription {
    type: `${SubscriptionType.ShieldModeEnd}`;
    condition: BroadcasterTargettedCondition;
}
export interface ShoutoutCreateSubscription extends BaseSubscription {
    type: `${SubscriptionType.ShoutoutCreate}`;
    condition: BroadcasterTargettedCondition;
}
export interface ShoutoutReceivedSubscription extends BaseSubscription {
    type: `${SubscriptionType.ShoutoutReceived}`;
    condition: BroadcasterTargettedCondition;
}
export interface StreamOnlineSubscription extends BaseSubscription {
    type: `${SubscriptionType.StreamOnline}`;
    condition: BroadcasterTargettedCondition;
}
export interface StreamOfflineSubscription extends BaseSubscription {
    type: `${SubscriptionType.StreamOffline}`;
    condition: BroadcasterTargettedCondition;
}
export interface UserAuthorizationGrantSubscription extends BaseSubscription {
    type: `${SubscriptionType.UserAuthorizationGrant}`;
    condition: UserAuthorizationCondition;
}
export interface UserAuthorizationRevokeSubscription extends BaseSubscription {
    type: `${SubscriptionType.UserAuthorizationRevoke}`;
    condition: UserAuthorizationCondition;
}
export interface UserUpdateSubscription extends BaseSubscription {
    type: `${SubscriptionType.UserUpdate}`;
    condition: UserUpdateCondition;
}
export type InvalidSubscription =
    ChannelUpdateSubscription |
    ChannelFollowSubscription |
    ChannelSubscribeSubscription |
    ChannelSubscriptionEndSubscription |
    ChannelSubscriptionGiftSubscription |
    ChannelSubscriptionMessageSubscription |
    ChannelCheerSubscription |
    ChannelRaidSubscription |
    ChannelBanSubscription |
    ChannelUnbanSubscription |
    ChannelModeratorAddSubscription |
    ChannelModeratorRemoveSubscription |
    ChannelPointsCustomRewardAddSubscription |
    ChannelPointsCustomRewardUpdateSubscription |
    ChannelPointsCustomRewardRemoveSubscription |
    ChannelPointsCustomRewardRedemptionAddSubscription |
    ChannelPointsCustomRewardRedemptionUpdateSubscription |
    ChannelPollBeginSubscription |
    ChannelPollProgressSubscription |
    ChannelPollEndSubscription |
    ChannelPredictionBeginSubscription |
    ChannelPredictionProgressSubscription |
    ChannelPredictionLockSubscription |
    ChannelPredictionEndSubscription |
    CharityDonationSubscription |
    CharityCampaignStartSubscription |
    CharityCampaignProgressSubscription |
    CharityCampaignStopSubscription |
    DropEntitlementGrantSubscription |
    ExtensionBitsTransactionCreateSubscription |
    GoalBeginSubscription |
    GoalProgressSubscription |
    GoalEndSubscription |
    HypeTrainBeginSubscription |
    HypeTrainProgressSubscription |
    HypeTrainEndSubscription |
    ShieldModeBeginSubscription |
    ShieldModeEndSubscription |
    ShoutoutCreateSubscription |
    ShoutoutReceivedSubscription |
    StreamOfflineSubscription |
    UserAuthorizationGrantSubscription |
    UserAuthorizationRevokeSubscription |
    UserUpdateSubscription;
export type Subscription = InvalidSubscription | StreamOnlineSubscription;

export type StreamOnlineEvent = {
    id: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    type: `${Exclude<StreamType, StreamType.Error>}`;
    started_at: string;
};

type Cursor = string;
type ResponsePagination = { cursor?: Cursor };
interface PaginatedResponse {
    pagination: ResponsePagination;
}

export interface BaseWebhookBody {
    subscription: Subscription;
}
export interface InvalidSubscriptionWebhookBody extends BaseWebhookBody {
    subscription: InvalidSubscription;
}
export interface StreamOnlineWebhookBody extends BaseWebhookBody {
    subscription: StreamOnlineSubscription;
}
export interface StreamOnlineNotificationBody extends StreamOnlineWebhookBody {
    event: StreamOnlineEvent;
}
export interface StreamOnlineCallbackVerificationBody extends StreamOnlineWebhookBody {
    challenge: string;
}
export type StreamOnlineRevocationBody = StreamOnlineWebhookBody;
export type WebhookBody =
    InvalidSubscriptionWebhookBody |
    StreamOnlineNotificationBody |
    StreamOnlineCallbackVerificationBody |
    StreamOnlineRevocationBody;

interface BaseSubscriptionTransport {
    method: `${TransportMethod}`;
    callback?: string;
    secret?: string;
    session_id?: string;
}
interface CreateWebhookSubscriptionTransportOptions extends BaseSubscriptionTransport {
    method: `${TransportMethod.Webhook}`;
    callback: string;
    secret: string;
    session_id?: never;
}
interface CreatedSubscriptionTransport extends BaseSubscriptionTransport {
    secret?: never;
    connected_at?: string;
}
interface ListedSubscriptionTransport extends CreatedSubscriptionTransport {
    disconnected_at?: string;
}
interface BaseEventSubscription {
    id: string;
    status: `${SubscriptionStatus}`;
    type: `${SubscriptionType}`;
    version: typeof API_VERSION;
    condition: Condition;
    created_at: string;
    transport: CreatedSubscriptionTransport;
    cost: number;
}
export interface ListedEventSubscription extends BaseEventSubscription {
    transport: ListedSubscriptionTransport;
}
interface BaseEventSubResponse {
    data: Array<BaseEventSubscription>;
    total: number;
    total_cost: number;
    max_total_cost: number;
}
export type CreateEventSubResponse = BaseEventSubResponse;
export interface GetEventSubsResponse extends BaseEventSubResponse, PaginatedResponse {
    data: Array<ListedEventSubscription>;
}

type AuthorizedSubscriptionRequestOptions = {
    body?: any,
    query?: string | URLSearchParams
};

type CreateStreamOnlineSubscriptionBody = {
    type: `${SubscriptionType.StreamOnline}`;
    version: typeof API_VERSION;
    condition: StreamOnlineSubscription["condition"];
    transport: CreateWebhookSubscriptionTransportOptions;
};

export type GetSubscriptionsOptions = {
    status?: `${SubscriptionStatus}`;
    type?: `${SubscriptionType}`;
    user_id?: string;
    after?: Cursor;
};

type ClientCredentialGrantQueryPairs = {
    client_id: string;
    client_secret: string;
    grant_type: typeof OAUTH_GRANT_TYPE;
};

export type ClientCredentialGrantResponse = {
    access_token: string;
    expires_in: number;
    token_type: string;
};

type ClientCredentialRevokeQueryPairs = {
    client_id: string;
    token: string;
};

export type GetResourceResponse<Resource> = { data: Array<Resource> };

export type GetUsersOptions = {
    ids?: Array<string>;
    logins?: Array<string>;
};
export type User = {
    id: string;
    login: string;
    display_name: string;
    type: `${UserType}`;
    broadcaster_type: `${BroadcasterType}`;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    email?: string;
    created_at: string;
};

export type Channel = {
    broadcaster_id: string;
    broadcaster_login: string;
    broadcaster_name: string;
    broadcaster_language: string;
    game_name: string;
    game_id: string;
    title: string;
    delay: number;
    tags: Array<string>;
};

export type GetStreamsOptions = {
    userIds?: Array<string>;
    userLogins?: Array<string>;
    gameIds?: Array<string>;
    type?: `${StreamFilterType}`;
    language?: string;
    first?: number;
    before?: string;
    after?: string;
};
export type Stream = {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: `${Exclude<
        StreamType,
        StreamType.Playlist |
        StreamType.Premiere |
        StreamType.Rerun |
        StreamType.WatchParty
    >}`;
    title: string;
    tags: Array<string>;
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
    is_mature: boolean;
};
export type GetStreamsResponse = GetResourceResponse<Stream> & PaginatedResponse;
