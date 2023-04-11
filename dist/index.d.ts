declare enum RequestHeaders {
    MessageId = "twitch-eventsub-message-id",
    MessageRetry = "twitch-eventsub-message-retry",
    MessageType = "twitch-eventsub-message-type",
    MessageSignature = "twitch-eventsub-message-signature",
    MessageTimestamp = "twitch-eventsub-message-timestamp",
    SubscriptionType = "twitch-eventsub-subscription-type",
    SubscriptionVersion = "twitch-eventsub-subscription-version"
}
declare enum NotificationType {
    Notification = "notification",
    WebhookCallbackVerification = "webhook_callback_verification",
    Revocation = "revocation"
}
declare enum SubscriptionType {
    ChannelUpdate = "channel.update",
    ChannelFollow = "channel.follow",
    ChannelSubscribe = "channel.subscribe",
    ChannelSubscriptionEnd = "channel.subscription.end",
    ChannelSubscriptionGift = "channel.subscription.gift",
    ChannelSubscriptionMessage = "channel.subscription.message",
    ChannelCheer = "channel.cheer",
    ChannelRaid = "channel.raid",
    ChannelBan = "channel.ban",
    ChannelUnban = "channel.unban",
    ChannelModeratorAdd = "channel.moderator.add",
    ChannelModeratorRemove = "channel.moderator.remove",
    ChannelPointsCustomRewardAdd = "channel.channel_points_custom_reward.add",
    ChannelPointsCustomRewardUpdate = "channel.channel_points_custom_reward.update",
    ChannelPointsCustomRewardRemove = "channel.channel_points_custom_reward.remove",
    ChannelPointsCustomRewardRedemptionAdd = "channel.channel_points_custom_reward_redemption.add",
    ChannelPointsCustomRewardRedemptionUpdate = "channel.channel_points_custom_reward_redemption.update",
    ChannelPollBegin = "channel.poll.begin",
    ChannelPollProgress = "channel.poll.progress",
    ChannelPollEnd = "channel.poll.end",
    ChannelPredictionBegin = "channel.prediction.begin",
    ChannelPredictionProgress = "channel.prediction.progress",
    ChannelPredictionLock = "channel.prediction.lock",
    ChannelPredictionEnd = "channel.prediction.end",
    CharityDonation = "channel.charity_campaign.donate",
    CharityCampaignStart = "channel.charity_campaign.start",
    CharityCampaignProgress = "channel.charity_campaign.progress",
    CharityCampaignStop = "channel.charity_campaign.stop",
    DropEntitlementGrant = "drop.entitlement.grant",
    ExtensionBitsTransactionCreate = "extension.bits_transaction.create",
    GoalBegin = "channel.goal.begin",
    GoalProgress = "channel.goal.progress",
    GoalEnd = "channel.goal.end",
    HypeTrainBegin = "channel.hype_train.begin",
    HypeTrainProgress = "channel.hype_train.progress",
    HypeTrainEnd = "channel.hype_train.end",
    ShieldModeBegin = "channel.shield_mode.begin",
    ShieldModeEnd = "channel.shield_mode.end",
    ShoutoutCreate = "channel.shoutout.create",
    ShoutoutReceived = "channel.shoutout.receive",
    StreamOnline = "stream.online",
    StreamOffline = "stream.offline",
    UserAuthorizationGrant = "user.authorization.grant",
    UserAuthorizationRevoke = "user.authorization.revoke",
    UserUpdate = "user.update"
}
declare enum SubscriptionStatus {
    Enabled = "enabled",
    WebhookCallbackVerificationPending = "webhook_callback_verification_pending",
    WebhookCallbackVerificationFailed = "webhook_callback_verification_failed",
    NotificationFailuresExceeded = "notification_failures_exceeded",
    AuthorizationRevoked = "authorization_revoked",
    ModeratorRemoved = "moderator_removed",
    UserRemoved = "user_removed",
    VersionRemoved = "version_removed",
    WebsocketDisconnected = "websocket_disconnected",
    WebsocketFailedPingPong = "websocket_failed_ping_pong",
    WebsocketReceivedInboundTraffic = "websocket_received_inbound_traffic",
    WebsocketConnectionUnused = "websocket_connection_unused",
    WebsocketInternalError = "websocket_internal_error",
    WebsocketNetworkTimeout = "websocket_network_timeout",
    WebsocketNetworkError = "websocket_network_error"
}
declare enum StreamType {
    Live = "live",
    Playlist = "playlist",
    WatchParty = "watch_party",
    Premiere = "premiere",
    Rerun = "rerun",
    Error = ""
}
declare enum TransportMethod {
    Webhook = "webhook",
    Websocket = "websocket"
}
declare enum UserType {
    Admin = "admin",
    GlobalMod = "global_mod",
    Staff = "staff",
    Normal = ""
}
declare enum BroadcasterType {
    Affiliate = "affiliate",
    Partner = "partner",
    Normal = ""
}
declare enum StreamFilterType {
    All = "all",
    Live = "live"
}

declare function channelUrl(name: string): string;
declare function isStreamOnlineBody(body: WebhookBody): body is StreamOnlineWebhookBody;
type Awaitable<T> = T | Promise<T>;

declare const API_VERSION = "1";
declare const HMAC_PREFIX = "sha256=";
declare const OAUTH_BASE_ENDPOINT = "https://id.twitch.tv/oauth2";
declare const API_BASE_ENDPOINT = "https://api.twitch.tv/helix";
declare function getClientCredentials(clientId: string, clientSecret: string): Promise<ClientCredentialGrantResponse>;
declare function revokeClientCredentials(clientId: string, token: string): Promise<void>;
declare function authorize<T>(clientId: string, clientSecret: string, fn: (accessToken: string) => Awaitable<T>): Promise<T>;
declare function getUsers(clientId: string, accessToken: string, options: GetUsersOptions): Promise<GetResourceResponse<User>>;
declare function getChannels(clientId: string, accessToken: string, ids: Array<string>): Promise<GetResourceResponse<Channel>>;
declare function getStreams(clientId: string, accessToken: string, { userIds, userLogins, gameIds, ...nonIterOptions }: GetStreamsOptions): Promise<GetStreamsResponse>;
declare function subscribe(clientId: string, accessToken: string, broadcasterId: string, callbackEndpoint: string, secret: string): Promise<CreateEventSubResponse>;
declare function getSubscriptions(clientId: string, accessToken: string, options?: GetSubscriptionsOptions): Promise<GetEventSubsResponse>;
declare function deleteSubscription(clientId: string, accessToken: string, subscriptionId: string): Promise<void>;
type BroadcasterTargettedCondition = {
    broadcaster_user_id: string;
};
type ChannelFollowCondition = BroadcasterTargettedCondition & {
    moderator_user_id: string;
};
type ChannelRaidCondition = {
    from_broadcaster_user_id?: string;
    to_broadcaster_user_id?: string;
};
type ChannelPointsCustomSpecificRewardCondition = BroadcasterTargettedCondition & {
    reward_id?: string;
};
type DropEntitlementGrantCondition = {
    organization_id: string;
    category_id?: string;
    campaign_id?: string;
};
type ExtensionBitsTransactionCreateCondition = {
    extension_client_id: string;
};
type UserAuthorizationCondition = {
    client_id: string;
};
type UserUpdateCondition = {
    user_id: string;
};
type Condition = BroadcasterTargettedCondition | ChannelFollowCondition | ChannelRaidCondition | ChannelPointsCustomSpecificRewardCondition | DropEntitlementGrantCondition | ExtensionBitsTransactionCreateCondition | UserAuthorizationCondition | UserUpdateCondition;
interface BaseSubscription {
    id: string;
    type: `${SubscriptionType}`;
    version: string;
    status: `${SubscriptionStatus}`;
    cost: number;
    condition: object;
    created_at: string;
}
interface ChannelUpdateSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelUpdate}`;
    condition: BroadcasterTargettedCondition;
}
interface ChannelFollowSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelFollow}`;
    condition: ChannelFollowCondition;
}
interface ChannelSubscribeSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelSubscribe}`;
    condition: BroadcasterTargettedCondition;
}
interface ChannelSubscriptionEndSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelSubscriptionEnd}`;
    condition: BroadcasterTargettedCondition;
}
interface ChannelSubscriptionGiftSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelSubscriptionGift}`;
    condition: BroadcasterTargettedCondition;
}
interface ChannelSubscriptionMessageSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelSubscriptionMessage}`;
    condition: BroadcasterTargettedCondition;
}
interface ChannelCheerSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelCheer}`;
    condition: BroadcasterTargettedCondition;
}
interface ChannelRaidSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelRaid}`;
    condition: ChannelRaidCondition;
}
interface ChannelBanSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelBan}`;
    condition: BroadcasterTargettedCondition;
}
interface ChannelUnbanSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelUnban}`;
    condition: BroadcasterTargettedCondition;
}
interface ChannelModeratorAddSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelModeratorAdd}`;
    condition: BroadcasterTargettedCondition;
}
interface ChannelModeratorRemoveSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelModeratorRemove}`;
    condition: BroadcasterTargettedCondition;
}
interface ChannelPointsCustomRewardAddSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPointsCustomRewardAdd}`;
    condition: BroadcasterTargettedCondition;
}
interface ChannelPointsCustomRewardUpdateSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPointsCustomRewardUpdate}`;
    condition: ChannelPointsCustomSpecificRewardCondition;
}
interface ChannelPointsCustomRewardRemoveSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPointsCustomRewardRemove}`;
    condition: ChannelPointsCustomSpecificRewardCondition;
}
interface ChannelPointsCustomRewardRedemptionAddSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPointsCustomRewardRedemptionAdd}`;
    condition: ChannelPointsCustomSpecificRewardCondition;
}
interface ChannelPointsCustomRewardRedemptionUpdateSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPointsCustomRewardRedemptionUpdate}`;
    condition: ChannelPointsCustomSpecificRewardCondition;
}
interface ChannelPollBeginSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPollBegin}`;
    condition: BroadcasterTargettedCondition;
}
interface ChannelPollProgressSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPollProgress}`;
    condition: BroadcasterTargettedCondition;
}
interface ChannelPollEndSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPollEnd}`;
    condition: BroadcasterTargettedCondition;
}
interface ChannelPredictionBeginSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPredictionBegin}`;
    condition: BroadcasterTargettedCondition;
}
interface ChannelPredictionProgressSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPredictionProgress}`;
    condition: BroadcasterTargettedCondition;
}
interface ChannelPredictionLockSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPredictionLock}`;
    condition: BroadcasterTargettedCondition;
}
interface ChannelPredictionEndSubscription extends BaseSubscription {
    type: `${SubscriptionType.ChannelPredictionEnd}`;
    condition: BroadcasterTargettedCondition;
}
interface CharityDonationSubscription extends BaseSubscription {
    type: `${SubscriptionType.CharityDonation}`;
    condition: BroadcasterTargettedCondition;
}
interface CharityCampaignStartSubscription extends BaseSubscription {
    type: `${SubscriptionType.CharityCampaignStart}`;
    condition: BroadcasterTargettedCondition;
}
interface CharityCampaignProgressSubscription extends BaseSubscription {
    type: `${SubscriptionType.CharityCampaignProgress}`;
    condition: BroadcasterTargettedCondition;
}
interface CharityCampaignStopSubscription extends BaseSubscription {
    type: `${SubscriptionType.CharityCampaignStop}`;
    condition: BroadcasterTargettedCondition;
}
interface DropEntitlementGrantSubscription extends BaseSubscription {
    type: `${SubscriptionType.DropEntitlementGrant}`;
    condition: DropEntitlementGrantCondition;
}
interface ExtensionBitsTransactionCreateSubscription extends BaseSubscription {
    type: `${SubscriptionType.ExtensionBitsTransactionCreate}`;
    condition: ExtensionBitsTransactionCreateCondition;
}
interface GoalBeginSubscription extends BaseSubscription {
    type: `${SubscriptionType.GoalBegin}`;
    condition: BroadcasterTargettedCondition;
}
interface GoalProgressSubscription extends BaseSubscription {
    type: `${SubscriptionType.GoalProgress}`;
    condition: BroadcasterTargettedCondition;
}
interface GoalEndSubscription extends BaseSubscription {
    type: `${SubscriptionType.GoalEnd}`;
    condition: BroadcasterTargettedCondition;
}
interface HypeTrainBeginSubscription extends BaseSubscription {
    type: `${SubscriptionType.HypeTrainBegin}`;
    condition: BroadcasterTargettedCondition;
}
interface HypeTrainProgressSubscription extends BaseSubscription {
    type: `${SubscriptionType.HypeTrainProgress}`;
    condition: BroadcasterTargettedCondition;
}
interface HypeTrainEndSubscription extends BaseSubscription {
    type: `${SubscriptionType.HypeTrainEnd}`;
    condition: BroadcasterTargettedCondition;
}
interface ShieldModeBeginSubscription extends BaseSubscription {
    type: `${SubscriptionType.ShieldModeBegin}`;
    condition: BroadcasterTargettedCondition;
}
interface ShieldModeEndSubscription extends BaseSubscription {
    type: `${SubscriptionType.ShieldModeEnd}`;
    condition: BroadcasterTargettedCondition;
}
interface ShoutoutCreateSubscription extends BaseSubscription {
    type: `${SubscriptionType.ShoutoutCreate}`;
    condition: BroadcasterTargettedCondition;
}
interface ShoutoutReceivedSubscription extends BaseSubscription {
    type: `${SubscriptionType.ShoutoutReceived}`;
    condition: BroadcasterTargettedCondition;
}
interface StreamOnlineSubscription extends BaseSubscription {
    type: `${SubscriptionType.StreamOnline}`;
    condition: BroadcasterTargettedCondition;
}
interface StreamOfflineSubscription extends BaseSubscription {
    type: `${SubscriptionType.StreamOffline}`;
    condition: BroadcasterTargettedCondition;
}
interface UserAuthorizationGrantSubscription extends BaseSubscription {
    type: `${SubscriptionType.UserAuthorizationGrant}`;
    condition: UserAuthorizationCondition;
}
interface UserAuthorizationRevokeSubscription extends BaseSubscription {
    type: `${SubscriptionType.UserAuthorizationRevoke}`;
    condition: UserAuthorizationCondition;
}
interface UserUpdateSubscription extends BaseSubscription {
    type: `${SubscriptionType.UserUpdate}`;
    condition: UserUpdateCondition;
}
type InvalidSubscription = ChannelUpdateSubscription | ChannelFollowSubscription | ChannelSubscribeSubscription | ChannelSubscriptionEndSubscription | ChannelSubscriptionGiftSubscription | ChannelSubscriptionMessageSubscription | ChannelCheerSubscription | ChannelRaidSubscription | ChannelBanSubscription | ChannelUnbanSubscription | ChannelModeratorAddSubscription | ChannelModeratorRemoveSubscription | ChannelPointsCustomRewardAddSubscription | ChannelPointsCustomRewardUpdateSubscription | ChannelPointsCustomRewardRemoveSubscription | ChannelPointsCustomRewardRedemptionAddSubscription | ChannelPointsCustomRewardRedemptionUpdateSubscription | ChannelPollBeginSubscription | ChannelPollProgressSubscription | ChannelPollEndSubscription | ChannelPredictionBeginSubscription | ChannelPredictionProgressSubscription | ChannelPredictionLockSubscription | ChannelPredictionEndSubscription | CharityDonationSubscription | CharityCampaignStartSubscription | CharityCampaignProgressSubscription | CharityCampaignStopSubscription | DropEntitlementGrantSubscription | ExtensionBitsTransactionCreateSubscription | GoalBeginSubscription | GoalProgressSubscription | GoalEndSubscription | HypeTrainBeginSubscription | HypeTrainProgressSubscription | HypeTrainEndSubscription | ShieldModeBeginSubscription | ShieldModeEndSubscription | ShoutoutCreateSubscription | ShoutoutReceivedSubscription | StreamOfflineSubscription | UserAuthorizationGrantSubscription | UserAuthorizationRevokeSubscription | UserUpdateSubscription;
type Subscription = InvalidSubscription | StreamOnlineSubscription;
type StreamOnlineEvent = {
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
interface BaseWebhookBody {
    subscription: Subscription;
}
interface InvalidSubscriptionWebhookBody extends BaseWebhookBody {
    subscription: InvalidSubscription;
}
interface StreamOnlineWebhookBody extends BaseWebhookBody {
    subscription: StreamOnlineSubscription;
}
interface StreamOnlineNotificationBody extends StreamOnlineWebhookBody {
    event: StreamOnlineEvent;
}
interface StreamOnlineCallbackVerificationBody extends StreamOnlineWebhookBody {
    challenge: string;
}
type StreamOnlineRevocationBody = StreamOnlineWebhookBody;
type WebhookBody = InvalidSubscriptionWebhookBody | StreamOnlineNotificationBody | StreamOnlineCallbackVerificationBody | StreamOnlineRevocationBody;
interface CreatedSubscriptionTransport {
    method: `${TransportMethod}`;
    callback?: string;
    session_id?: string;
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
interface ListedEventSubscription extends BaseEventSubscription {
    transport: ListedSubscriptionTransport;
}
interface BaseEventSubResponse {
    total: number;
    total_cost: number;
    max_total_cost: number;
}
interface CreateEventSubResponse extends BaseEventSubResponse, GetResourceResponse<BaseEventSubscription> {
}
interface GetEventSubsResponse extends BaseEventSubResponse, PaginatedResponse, GetResourceResponse<ListedEventSubscription> {
}
type GetSubscriptionsOptions = {
    status?: `${SubscriptionStatus}`;
    type?: `${SubscriptionType}`;
    user_id?: string;
    after?: Cursor;
};
type ClientCredentialGrantResponse = {
    access_token: string;
    expires_in: number;
    token_type: string;
};
type GetResourceResponse<Resource> = {
    data: Array<Resource>;
};
type GetUsersOptions = {
    ids?: Array<string>;
    logins?: Array<string>;
};
type User = {
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
type Channel = {
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
type GetStreamsOptions = {
    userIds?: Array<string>;
    userLogins?: Array<string>;
    gameIds?: Array<string>;
    type?: `${StreamFilterType}`;
    language?: string;
    first?: number;
    before?: string;
    after?: string;
};
type Stream = {
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
type GetStreamsResponse = GetResourceResponse<Stream> & PaginatedResponse;

export { API_BASE_ENDPOINT, API_VERSION, Awaitable, BaseSubscription, BaseWebhookBody, BroadcasterTargettedCondition, BroadcasterType, Channel, ChannelBanSubscription, ChannelCheerSubscription, ChannelFollowCondition, ChannelFollowSubscription, ChannelModeratorAddSubscription, ChannelModeratorRemoveSubscription, ChannelPointsCustomRewardAddSubscription, ChannelPointsCustomRewardRedemptionAddSubscription, ChannelPointsCustomRewardRedemptionUpdateSubscription, ChannelPointsCustomRewardRemoveSubscription, ChannelPointsCustomRewardUpdateSubscription, ChannelPointsCustomSpecificRewardCondition, ChannelPollBeginSubscription, ChannelPollEndSubscription, ChannelPollProgressSubscription, ChannelPredictionBeginSubscription, ChannelPredictionEndSubscription, ChannelPredictionLockSubscription, ChannelPredictionProgressSubscription, ChannelRaidCondition, ChannelRaidSubscription, ChannelSubscribeSubscription, ChannelSubscriptionEndSubscription, ChannelSubscriptionGiftSubscription, ChannelSubscriptionMessageSubscription, ChannelUnbanSubscription, ChannelUpdateSubscription, CharityCampaignProgressSubscription, CharityCampaignStartSubscription, CharityCampaignStopSubscription, CharityDonationSubscription, ClientCredentialGrantResponse, Condition, CreateEventSubResponse, DropEntitlementGrantCondition, DropEntitlementGrantSubscription, ExtensionBitsTransactionCreateCondition, ExtensionBitsTransactionCreateSubscription, GetEventSubsResponse, GetResourceResponse, GetStreamsOptions, GetStreamsResponse, GetSubscriptionsOptions, GetUsersOptions, GoalBeginSubscription, GoalEndSubscription, GoalProgressSubscription, HMAC_PREFIX, HypeTrainBeginSubscription, HypeTrainEndSubscription, HypeTrainProgressSubscription, InvalidSubscription, InvalidSubscriptionWebhookBody, ListedEventSubscription, NotificationType, OAUTH_BASE_ENDPOINT, RequestHeaders, ShieldModeBeginSubscription, ShieldModeEndSubscription, ShoutoutCreateSubscription, ShoutoutReceivedSubscription, Stream, StreamFilterType, StreamOfflineSubscription, StreamOnlineCallbackVerificationBody, StreamOnlineEvent, StreamOnlineNotificationBody, StreamOnlineRevocationBody, StreamOnlineSubscription, StreamOnlineWebhookBody, StreamType, Subscription, SubscriptionStatus, SubscriptionType, TransportMethod, User, UserAuthorizationCondition, UserAuthorizationGrantSubscription, UserAuthorizationRevokeSubscription, UserType, UserUpdateCondition, UserUpdateSubscription, WebhookBody, authorize, channelUrl, deleteSubscription, getChannels, getClientCredentials, getStreams, getSubscriptions, getUsers, isStreamOnlineBody, revokeClientCredentials, subscribe };
