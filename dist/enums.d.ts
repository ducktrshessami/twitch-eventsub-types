export declare enum RequestHeaders {
    MessageId = "twitch-eventsub-message-id",
    MessageRetry = "twitch-eventsub-message-retry",
    MessageType = "twitch-eventsub-message-type",
    MessageSignature = "twitch-eventsub-message-signature",
    MessageTimestamp = "twitch-eventsub-message-timestamp",
    SubscriptionType = "twitch-eventsub-subscription-type",
    SubscriptionVersion = "twitch-eventsub-subscription-version"
}
export declare enum NotificationType {
    Notification = "notification",
    WebhookCallbackVerification = "webhook_callback_verification",
    Revocation = "revocation"
}
export declare enum SubscriptionType {
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
export declare enum SubscriptionStatus {
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
export declare enum StreamType {
    Live = "live",
    Playlist = "playlist",
    WatchParty = "watch_party",
    Premiere = "premiere",
    Rerun = "rerun",
    Error = ""
}
export declare enum TransportMethod {
    Webhook = "webhook",
    Websocket = "websocket"
}
export declare enum UserType {
    Admin = "admin",
    GlobalMod = "global_mod",
    Staff = "staff",
    Normal = ""
}
export declare enum BroadcasterType {
    Affiliate = "affiliate",
    Partner = "partner",
    Normal = ""
}
export declare enum StreamFilterType {
    All = "all",
    Live = "live"
}
