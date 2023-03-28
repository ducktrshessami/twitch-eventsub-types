import { BroadcasterType, StreamFilterType, StreamType, SubscriptionStatus, SubscriptionType, TransportMethod, UserType } from "./enums.js";
import { Awaitable } from "./util.js";
export declare const API_VERSION = "1";
export declare const HMAC_PREFIX = "sha256=";
export declare const OAUTH_BASE_ENDPOINT = "https://id.twitch.tv/oauth2";
export declare const API_BASE_ENDPOINT = "https://api.twitch.tv/helix";
export declare function getClientCredentials(clientId: string, clientSecret: string): Promise<ClientCredentialGrantResponse>;
export declare function revokeClientCredentials(clientId: string, token: string): Promise<void>;
export declare function authorize<T>(clientId: string, clientSecret: string, fn: (accessToken: string) => Awaitable<T>): Promise<T>;
export declare function getUsers(clientId: string, accessToken: string, options: GetUsersOptions): Promise<GetResourceResponse<User>>;
export declare function getChannels(clientId: string, accessToken: string, ids: Array<string>): Promise<GetResourceResponse<Channel>>;
export declare function getStreams(clientId: string, accessToken: string, { userIds, userLogins, gameIds, ...nonIterOptions }: GetStreamsOptions): Promise<GetStreamsResponse>;
export declare function subscribe(clientId: string, accessToken: string, broadcasterId: string, callbackEndpoint: string, secret: string): Promise<void>;
export declare function getSubscriptions(clientId: string, accessToken: string, options?: GetSubscriptionsOptions): Promise<GetEventSubsResponse>;
export declare function deleteSubscription(clientId: string, accessToken: string, subscriptionId: string): Promise<void>;
export type BroadcasterTargettedCondition = {
    broadcaster_user_id: string;
};
export type ChannelFollowCondition = BroadcasterTargettedCondition & {
    moderator_user_id: string;
};
export type ChannelRaidCondition = {
    from_broadcaster_user_id?: string;
    to_broadcaster_user_id?: string;
};
export type ChannelPointsCustomSpecificRewardCondition = BroadcasterTargettedCondition & {
    reward_id?: string;
};
export type DropEntitlementGrantCondition = {
    organization_id: string;
    category_id?: string;
    campaign_id?: string;
};
export type ExtensionBitsTransactionCreateCondition = {
    extension_client_id: string;
};
export type UserAuthorizationCondition = {
    client_id: string;
};
export type UserUpdateCondition = {
    user_id: string;
};
export type Condition = BroadcasterTargettedCondition | ChannelFollowCondition | ChannelRaidCondition | ChannelPointsCustomSpecificRewardCondition | DropEntitlementGrantCondition | ExtensionBitsTransactionCreateCondition | UserAuthorizationCondition | UserUpdateCondition;
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
export type InvalidSubscription = ChannelUpdateSubscription | ChannelFollowSubscription | ChannelSubscribeSubscription | ChannelSubscriptionEndSubscription | ChannelSubscriptionGiftSubscription | ChannelSubscriptionMessageSubscription | ChannelCheerSubscription | ChannelRaidSubscription | ChannelBanSubscription | ChannelUnbanSubscription | ChannelModeratorAddSubscription | ChannelModeratorRemoveSubscription | ChannelPointsCustomRewardAddSubscription | ChannelPointsCustomRewardUpdateSubscription | ChannelPointsCustomRewardRemoveSubscription | ChannelPointsCustomRewardRedemptionAddSubscription | ChannelPointsCustomRewardRedemptionUpdateSubscription | ChannelPollBeginSubscription | ChannelPollProgressSubscription | ChannelPollEndSubscription | ChannelPredictionBeginSubscription | ChannelPredictionProgressSubscription | ChannelPredictionLockSubscription | ChannelPredictionEndSubscription | CharityDonationSubscription | CharityCampaignStartSubscription | CharityCampaignProgressSubscription | CharityCampaignStopSubscription | DropEntitlementGrantSubscription | ExtensionBitsTransactionCreateSubscription | GoalBeginSubscription | GoalProgressSubscription | GoalEndSubscription | HypeTrainBeginSubscription | HypeTrainProgressSubscription | HypeTrainEndSubscription | ShieldModeBeginSubscription | ShieldModeEndSubscription | ShoutoutCreateSubscription | ShoutoutReceivedSubscription | StreamOfflineSubscription | UserAuthorizationGrantSubscription | UserAuthorizationRevokeSubscription | UserUpdateSubscription;
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
type ResponsePagination = {
    cursor?: Cursor;
};
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
export type WebhookBody = InvalidSubscriptionWebhookBody | StreamOnlineNotificationBody | StreamOnlineCallbackVerificationBody | StreamOnlineRevocationBody;
interface BaseSubscriptionTransport {
    method: `${TransportMethod}`;
    callback?: string;
    secret?: string;
    session_id?: string;
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
export type GetSubscriptionsOptions = {
    status?: `${SubscriptionStatus}`;
    type?: `${SubscriptionType}`;
    user_id?: string;
    after?: Cursor;
};
export type ClientCredentialGrantResponse = {
    access_token: string;
    expires_in: number;
    token_type: string;
};
export type GetResourceResponse<Resource> = {
    data: Array<Resource>;
};
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
    type: `${Exclude<StreamType, StreamType.Playlist | StreamType.Premiere | StreamType.Rerun | StreamType.WatchParty>}`;
    title: string;
    tags: Array<string>;
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
    is_mature: boolean;
};
export type GetStreamsResponse = GetResourceResponse<Stream> & PaginatedResponse;
export {};
