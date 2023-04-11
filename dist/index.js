var RequestHeaders=(RequestHeaders2=>(RequestHeaders2.MessageId="twitch-eventsub-message-id",RequestHeaders2.MessageRetry="twitch-eventsub-message-retry",RequestHeaders2.MessageType="twitch-eventsub-message-type",RequestHeaders2.MessageSignature="twitch-eventsub-message-signature",RequestHeaders2.MessageTimestamp="twitch-eventsub-message-timestamp",RequestHeaders2.SubscriptionType="twitch-eventsub-subscription-type",RequestHeaders2.SubscriptionVersion="twitch-eventsub-subscription-version",RequestHeaders2))(RequestHeaders||{}),NotificationType=(NotificationType2=>(NotificationType2.Notification="notification",NotificationType2.WebhookCallbackVerification="webhook_callback_verification",NotificationType2.Revocation="revocation",NotificationType2))(NotificationType||{}),SubscriptionType=(SubscriptionType2=>(SubscriptionType2.ChannelUpdate="channel.update",SubscriptionType2.ChannelFollow="channel.follow",SubscriptionType2.ChannelSubscribe="channel.subscribe",SubscriptionType2.ChannelSubscriptionEnd="channel.subscription.end",SubscriptionType2.ChannelSubscriptionGift="channel.subscription.gift",SubscriptionType2.ChannelSubscriptionMessage="channel.subscription.message",SubscriptionType2.ChannelCheer="channel.cheer",SubscriptionType2.ChannelRaid="channel.raid",SubscriptionType2.ChannelBan="channel.ban",SubscriptionType2.ChannelUnban="channel.unban",SubscriptionType2.ChannelModeratorAdd="channel.moderator.add",SubscriptionType2.ChannelModeratorRemove="channel.moderator.remove",SubscriptionType2.ChannelPointsCustomRewardAdd="channel.channel_points_custom_reward.add",SubscriptionType2.ChannelPointsCustomRewardUpdate="channel.channel_points_custom_reward.update",SubscriptionType2.ChannelPointsCustomRewardRemove="channel.channel_points_custom_reward.remove",SubscriptionType2.ChannelPointsCustomRewardRedemptionAdd="channel.channel_points_custom_reward_redemption.add",SubscriptionType2.ChannelPointsCustomRewardRedemptionUpdate="channel.channel_points_custom_reward_redemption.update",SubscriptionType2.ChannelPollBegin="channel.poll.begin",SubscriptionType2.ChannelPollProgress="channel.poll.progress",SubscriptionType2.ChannelPollEnd="channel.poll.end",SubscriptionType2.ChannelPredictionBegin="channel.prediction.begin",SubscriptionType2.ChannelPredictionProgress="channel.prediction.progress",SubscriptionType2.ChannelPredictionLock="channel.prediction.lock",SubscriptionType2.ChannelPredictionEnd="channel.prediction.end",SubscriptionType2.CharityDonation="channel.charity_campaign.donate",SubscriptionType2.CharityCampaignStart="channel.charity_campaign.start",SubscriptionType2.CharityCampaignProgress="channel.charity_campaign.progress",SubscriptionType2.CharityCampaignStop="channel.charity_campaign.stop",SubscriptionType2.DropEntitlementGrant="drop.entitlement.grant",SubscriptionType2.ExtensionBitsTransactionCreate="extension.bits_transaction.create",SubscriptionType2.GoalBegin="channel.goal.begin",SubscriptionType2.GoalProgress="channel.goal.progress",SubscriptionType2.GoalEnd="channel.goal.end",SubscriptionType2.HypeTrainBegin="channel.hype_train.begin",SubscriptionType2.HypeTrainProgress="channel.hype_train.progress",SubscriptionType2.HypeTrainEnd="channel.hype_train.end",SubscriptionType2.ShieldModeBegin="channel.shield_mode.begin",SubscriptionType2.ShieldModeEnd="channel.shield_mode.end",SubscriptionType2.ShoutoutCreate="channel.shoutout.create",SubscriptionType2.ShoutoutReceived="channel.shoutout.receive",SubscriptionType2.StreamOnline="stream.online",SubscriptionType2.StreamOffline="stream.offline",SubscriptionType2.UserAuthorizationGrant="user.authorization.grant",SubscriptionType2.UserAuthorizationRevoke="user.authorization.revoke",SubscriptionType2.UserUpdate="user.update",SubscriptionType2))(SubscriptionType||{}),SubscriptionStatus=(SubscriptionStatus3=>(SubscriptionStatus3.Enabled="enabled",SubscriptionStatus3.WebhookCallbackVerificationPending="webhook_callback_verification_pending",SubscriptionStatus3.WebhookCallbackVerificationFailed="webhook_callback_verification_failed",SubscriptionStatus3.NotificationFailuresExceeded="notification_failures_exceeded",SubscriptionStatus3.AuthorizationRevoked="authorization_revoked",SubscriptionStatus3.ModeratorRemoved="moderator_removed",SubscriptionStatus3.UserRemoved="user_removed",SubscriptionStatus3.VersionRemoved="version_removed",SubscriptionStatus3.WebsocketDisconnected="websocket_disconnected",SubscriptionStatus3.WebsocketFailedPingPong="websocket_failed_ping_pong",SubscriptionStatus3.WebsocketReceivedInboundTraffic="websocket_received_inbound_traffic",SubscriptionStatus3.WebsocketConnectionUnused="websocket_connection_unused",SubscriptionStatus3.WebsocketInternalError="websocket_internal_error",SubscriptionStatus3.WebsocketNetworkTimeout="websocket_network_timeout",SubscriptionStatus3.WebsocketNetworkError="websocket_network_error",SubscriptionStatus3))(SubscriptionStatus||{}),StreamType=(StreamType3=>(StreamType3.Live="live",StreamType3.Playlist="playlist",StreamType3.WatchParty="watch_party",StreamType3.Premiere="premiere",StreamType3.Rerun="rerun",StreamType3.Error="",StreamType3))(StreamType||{}),TransportMethod=(TransportMethod2=>(TransportMethod2.Webhook="webhook",TransportMethod2.Websocket="websocket",TransportMethod2))(TransportMethod||{}),UserType=(UserType3=>(UserType3.Admin="admin",UserType3.GlobalMod="global_mod",UserType3.Staff="staff",UserType3.Normal="",UserType3))(UserType||{}),BroadcasterType=(BroadcasterType3=>(BroadcasterType3.Affiliate="affiliate",BroadcasterType3.Partner="partner",BroadcasterType3.Normal="",BroadcasterType3))(BroadcasterType||{}),StreamFilterType=(StreamFilterType3=>(StreamFilterType3.All="all",StreamFilterType3.Live="live",StreamFilterType3))(StreamFilterType||{});var CustomError=class extends Error{constructor(message){super(message),this.name=this.constructor.name}},FetchError=class extends CustomError{constructor(response){super(`${response.status}: ${response.statusText}`)}};var API_VERSION="1",HMAC_PREFIX="sha256=",OAUTH_GRANT_TYPE="client_credentials",OAUTH_BASE_ENDPOINT="https://id.twitch.tv/oauth2",OAUTH_TOKEN_ENDPOINT=OAUTH_BASE_ENDPOINT+"/token",OAUTH_REVOKE_ENDPOINT=OAUTH_BASE_ENDPOINT+"/revoke",API_BASE_ENDPOINT="https://api.twitch.tv/helix",GET_USERS_ENDPOINT=API_BASE_ENDPOINT+"/users",SUBSCRIPTION_ENDPOINT=API_BASE_ENDPOINT+"/eventsub/subscriptions",GET_CHANNELS_ENDPOINT=API_BASE_ENDPOINT+"/channels",GET_STREAMS_ENDPOINT=API_BASE_ENDPOINT+"/streams";async function oauthRequest(url,body){let query=new URLSearchParams(body),res=await fetch(url,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:query.toString()});if(res.status===200)return res;throw new FetchError(res)}async function getClientCredentials(clientId,clientSecret){return await(await oauthRequest(OAUTH_TOKEN_ENDPOINT,{client_id:clientId,client_secret:clientSecret,grant_type:OAUTH_GRANT_TYPE})).json()}async function revokeClientCredentials(clientId,token){await oauthRequest(OAUTH_REVOKE_ENDPOINT,{client_id:clientId,token})}async function authorize(clientId,clientSecret,fn){let result,error,{access_token}=await getClientCredentials(clientId,clientSecret);try{result=await fn(access_token)}catch(err){error=err}finally{if(await revokeClientCredentials(clientId,access_token),error)throw error;return result}}async function authorizedRequest(clientId,accessToken,url,method,options){let target=new URL(url),headers={"Client-Id":clientId,Authorization:`Bearer ${accessToken}`},body=null;return options.body&&(headers["Content-Type"]="application/json",body=JSON.stringify(options.body)),options.query&&(target.search=options.query.toString()),await fetch(target,{method,headers,body})}async function getUsers(clientId,accessToken,options){let query=new URLSearchParams;options.ids?.forEach(id=>query.append("id",id)),options.logins?.forEach(login=>query.append("login",login));let res=await authorizedRequest(clientId,accessToken,GET_USERS_ENDPOINT,"GET",{query});if(res.status===200)return await res.json();throw new FetchError(res)}async function getChannels(clientId,accessToken,ids){let query=new URLSearchParams;ids.forEach(id=>query.append("broadcaster_id",id));let res=await authorizedRequest(clientId,accessToken,GET_CHANNELS_ENDPOINT,"GET",{query});if(res.status===200)return await res.json();throw new FetchError(res)}async function getStreams(clientId,accessToken,{userIds,userLogins,gameIds,...nonIterOptions}){let query=new URLSearchParams(nonIterOptions);userIds?.forEach(id=>query.append("user_id",id)),userLogins?.forEach(login=>query.append("user_login",login)),gameIds?.forEach(id=>query.append("game_id",id));let res=await authorizedRequest(clientId,accessToken,GET_STREAMS_ENDPOINT,"GET",{query});if(res.status===200)return await res.json();throw new FetchError(res)}async function subscribe(clientId,accessToken,broadcasterId,callbackEndpoint,secret){let res=await authorizedRequest(clientId,accessToken,SUBSCRIPTION_ENDPOINT,"POST",{body:{type:"stream.online",version:API_VERSION,condition:{broadcaster_user_id:broadcasterId},transport:{method:"webhook",callback:callbackEndpoint,secret}}});if(res.status===202)return await res.json();throw new FetchError(res)}async function getSubscriptions(clientId,accessToken,options={}){let res=await authorizedRequest(clientId,accessToken,SUBSCRIPTION_ENDPOINT,"GET",{query:new URLSearchParams(options)});if(res.status===200)return await res.json();throw new FetchError(res)}async function deleteSubscription(clientId,accessToken,subscriptionId){let res=await authorizedRequest(clientId,accessToken,SUBSCRIPTION_ENDPOINT,"DELETE",{query:new URLSearchParams({id:subscriptionId})});if(res.status!==204)throw new FetchError(res)}function channelUrl(name){return`https://www.twitch.tv/${name}`}function isStreamOnlineBody(body){return body.subscription.type==="stream.online"}export{API_BASE_ENDPOINT,API_VERSION,BroadcasterType,HMAC_PREFIX,NotificationType,OAUTH_BASE_ENDPOINT,RequestHeaders,StreamFilterType,StreamType,SubscriptionStatus,SubscriptionType,TransportMethod,UserType,authorize,channelUrl,deleteSubscription,getChannels,getClientCredentials,getStreams,getSubscriptions,getUsers,isStreamOnlineBody,revokeClientCredentials,subscribe};
