import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AddBuddyBody, BuddyEntry, Conversation, CreateUserBody, DirectMessage, ErrorResponse, GetShoutboxParams, HealthStatus, LoginBody, PostShoutBody, SendMessageBody, ShoutboxMessage, UpdateMoodBody, UpdateUserBody, User, UserProfile } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all users
 */
export declare const getListUsersUrl: () => string;
export declare const listUsers: (options?: RequestInit) => Promise<User[]>;
export declare const getListUsersQueryKey: () => readonly ["/api/users"];
export declare const getListUsersQueryOptions: <TData = Awaited<ReturnType<typeof listUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListUsersQueryResult = NonNullable<Awaited<ReturnType<typeof listUsers>>>;
export type ListUsersQueryError = ErrorType<unknown>;
/**
 * @summary List all users
 */
export declare function useListUsers<TData = Awaited<ReturnType<typeof listUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Register a new user
 */
export declare const getCreateUserUrl: () => string;
export declare const createUser: (createUserBody: CreateUserBody, options?: RequestInit) => Promise<User>;
export declare const getCreateUserMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError, {
        data: BodyType<CreateUserBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError, {
    data: BodyType<CreateUserBody>;
}, TContext>;
export type CreateUserMutationResult = NonNullable<Awaited<ReturnType<typeof createUser>>>;
export type CreateUserMutationBody = BodyType<CreateUserBody>;
export type CreateUserMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Register a new user
 */
export declare const useCreateUser: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError, {
        data: BodyType<CreateUserBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createUser>>, TError, {
    data: BodyType<CreateUserBody>;
}, TContext>;
/**
 * @summary Get user profile
 */
export declare const getGetUserUrl: (username: string) => string;
export declare const getUser: (username: string, options?: RequestInit) => Promise<UserProfile>;
export declare const getGetUserQueryKey: (username: string) => readonly [`/api/users/${string}`];
export declare const getGetUserQueryOptions: <TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<ErrorResponse>>(username: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetUserQueryResult = NonNullable<Awaited<ReturnType<typeof getUser>>>;
export type GetUserQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get user profile
 */
export declare function useGetUser<TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<ErrorResponse>>(username: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update user profile
 */
export declare const getUpdateUserUrl: (username: string) => string;
export declare const updateUser: (username: string, updateUserBody: UpdateUserBody, options?: RequestInit) => Promise<User>;
export declare const getUpdateUserMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
        username: string;
        data: BodyType<UpdateUserBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
    username: string;
    data: BodyType<UpdateUserBody>;
}, TContext>;
export type UpdateUserMutationResult = NonNullable<Awaited<ReturnType<typeof updateUser>>>;
export type UpdateUserMutationBody = BodyType<UpdateUserBody>;
export type UpdateUserMutationError = ErrorType<unknown>;
/**
 * @summary Update user profile
 */
export declare const useUpdateUser: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
        username: string;
        data: BodyType<UpdateUserBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateUser>>, TError, {
    username: string;
    data: BodyType<UpdateUserBody>;
}, TContext>;
/**
 * @summary Update user mood
 */
export declare const getUpdateMoodUrl: (username: string) => string;
export declare const updateMood: (username: string, updateMoodBody: UpdateMoodBody, options?: RequestInit) => Promise<User>;
export declare const getUpdateMoodMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMood>>, TError, {
        username: string;
        data: BodyType<UpdateMoodBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateMood>>, TError, {
    username: string;
    data: BodyType<UpdateMoodBody>;
}, TContext>;
export type UpdateMoodMutationResult = NonNullable<Awaited<ReturnType<typeof updateMood>>>;
export type UpdateMoodMutationBody = BodyType<UpdateMoodBody>;
export type UpdateMoodMutationError = ErrorType<unknown>;
/**
 * @summary Update user mood
 */
export declare const useUpdateMood: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMood>>, TError, {
        username: string;
        data: BodyType<UpdateMoodBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateMood>>, TError, {
    username: string;
    data: BodyType<UpdateMoodBody>;
}, TContext>;
/**
 * @summary Log in
 */
export declare const getLoginUrl: () => string;
export declare const login: (loginBody: LoginBody, options?: RequestInit) => Promise<User>;
export declare const getLoginMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginBody>;
}, TContext>;
export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>;
export type LoginMutationBody = BodyType<LoginBody>;
export type LoginMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Log in
 */
export declare const useLogin: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginBody>;
}, TContext>;
/**
 * @summary Log out
 */
export declare const getLogoutUrl: () => string;
export declare const logout: (options?: RequestInit) => Promise<void>;
export declare const getLogoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
export type LogoutMutationResult = NonNullable<Awaited<ReturnType<typeof logout>>>;
export type LogoutMutationError = ErrorType<unknown>;
/**
 * @summary Log out
 */
export declare const useLogout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
/**
 * @summary Get current logged-in user
 */
export declare const getGetMeUrl: () => string;
export declare const getMe: (options?: RequestInit) => Promise<User>;
export declare const getGetMeQueryKey: () => readonly ["/api/session/me"];
export declare const getGetMeQueryOptions: <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>;
export type GetMeQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get current logged-in user
 */
export declare function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get buddy list for user
 */
export declare const getGetBuddyListUrl: (username: string) => string;
export declare const getBuddyList: (username: string, options?: RequestInit) => Promise<BuddyEntry[]>;
export declare const getGetBuddyListQueryKey: (username: string) => readonly [`/api/buddies/${string}`];
export declare const getGetBuddyListQueryOptions: <TData = Awaited<ReturnType<typeof getBuddyList>>, TError = ErrorType<unknown>>(username: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBuddyList>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getBuddyList>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetBuddyListQueryResult = NonNullable<Awaited<ReturnType<typeof getBuddyList>>>;
export type GetBuddyListQueryError = ErrorType<unknown>;
/**
 * @summary Get buddy list for user
 */
export declare function useGetBuddyList<TData = Awaited<ReturnType<typeof getBuddyList>>, TError = ErrorType<unknown>>(username: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBuddyList>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Add a buddy
 */
export declare const getAddBuddyUrl: (username: string) => string;
export declare const addBuddy: (username: string, addBuddyBody: AddBuddyBody, options?: RequestInit) => Promise<BuddyEntry>;
export declare const getAddBuddyMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addBuddy>>, TError, {
        username: string;
        data: BodyType<AddBuddyBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addBuddy>>, TError, {
    username: string;
    data: BodyType<AddBuddyBody>;
}, TContext>;
export type AddBuddyMutationResult = NonNullable<Awaited<ReturnType<typeof addBuddy>>>;
export type AddBuddyMutationBody = BodyType<AddBuddyBody>;
export type AddBuddyMutationError = ErrorType<unknown>;
/**
 * @summary Add a buddy
 */
export declare const useAddBuddy: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addBuddy>>, TError, {
        username: string;
        data: BodyType<AddBuddyBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addBuddy>>, TError, {
    username: string;
    data: BodyType<AddBuddyBody>;
}, TContext>;
/**
 * @summary Remove a buddy
 */
export declare const getRemoveBuddyUrl: (username: string, buddyUsername: string) => string;
export declare const removeBuddy: (username: string, buddyUsername: string, options?: RequestInit) => Promise<void>;
export declare const getRemoveBuddyMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeBuddy>>, TError, {
        username: string;
        buddyUsername: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeBuddy>>, TError, {
    username: string;
    buddyUsername: string;
}, TContext>;
export type RemoveBuddyMutationResult = NonNullable<Awaited<ReturnType<typeof removeBuddy>>>;
export type RemoveBuddyMutationError = ErrorType<unknown>;
/**
 * @summary Remove a buddy
 */
export declare const useRemoveBuddy: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeBuddy>>, TError, {
        username: string;
        buddyUsername: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof removeBuddy>>, TError, {
    username: string;
    buddyUsername: string;
}, TContext>;
/**
 * @summary Get shoutbox messages
 */
export declare const getGetShoutboxUrl: (params?: GetShoutboxParams) => string;
export declare const getShoutbox: (params?: GetShoutboxParams, options?: RequestInit) => Promise<ShoutboxMessage[]>;
export declare const getGetShoutboxQueryKey: (params?: GetShoutboxParams) => readonly ["/api/shoutbox", ...GetShoutboxParams[]];
export declare const getGetShoutboxQueryOptions: <TData = Awaited<ReturnType<typeof getShoutbox>>, TError = ErrorType<unknown>>(params?: GetShoutboxParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getShoutbox>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getShoutbox>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetShoutboxQueryResult = NonNullable<Awaited<ReturnType<typeof getShoutbox>>>;
export type GetShoutboxQueryError = ErrorType<unknown>;
/**
 * @summary Get shoutbox messages
 */
export declare function useGetShoutbox<TData = Awaited<ReturnType<typeof getShoutbox>>, TError = ErrorType<unknown>>(params?: GetShoutboxParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getShoutbox>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Post a shoutbox message
 */
export declare const getPostShoutUrl: () => string;
export declare const postShout: (postShoutBody: PostShoutBody, options?: RequestInit) => Promise<ShoutboxMessage>;
export declare const getPostShoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof postShout>>, TError, {
        data: BodyType<PostShoutBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof postShout>>, TError, {
    data: BodyType<PostShoutBody>;
}, TContext>;
export type PostShoutMutationResult = NonNullable<Awaited<ReturnType<typeof postShout>>>;
export type PostShoutMutationBody = BodyType<PostShoutBody>;
export type PostShoutMutationError = ErrorType<unknown>;
/**
 * @summary Post a shoutbox message
 */
export declare const usePostShout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof postShout>>, TError, {
        data: BodyType<PostShoutBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof postShout>>, TError, {
    data: BodyType<PostShoutBody>;
}, TContext>;
/**
 * @summary Delete a shoutbox message
 */
export declare const getDeleteShoutUrl: (id: number) => string;
export declare const deleteShout: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteShoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteShout>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteShout>>, TError, {
    id: number;
}, TContext>;
export type DeleteShoutMutationResult = NonNullable<Awaited<ReturnType<typeof deleteShout>>>;
export type DeleteShoutMutationError = ErrorType<unknown>;
/**
 * @summary Delete a shoutbox message
 */
export declare const useDeleteShout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteShout>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteShout>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Get all conversations for a user
 */
export declare const getGetInboxUrl: (username: string) => string;
export declare const getInbox: (username: string, options?: RequestInit) => Promise<Conversation[]>;
export declare const getGetInboxQueryKey: (username: string) => readonly [`/api/messages/${string}/inbox`];
export declare const getGetInboxQueryOptions: <TData = Awaited<ReturnType<typeof getInbox>>, TError = ErrorType<unknown>>(username: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getInbox>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getInbox>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetInboxQueryResult = NonNullable<Awaited<ReturnType<typeof getInbox>>>;
export type GetInboxQueryError = ErrorType<unknown>;
/**
 * @summary Get all conversations for a user
 */
export declare function useGetInbox<TData = Awaited<ReturnType<typeof getInbox>>, TError = ErrorType<unknown>>(username: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getInbox>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get messages between two users
 */
export declare const getGetConversationUrl: (username: string, otherUsername: string) => string;
export declare const getConversation: (username: string, otherUsername: string, options?: RequestInit) => Promise<DirectMessage[]>;
export declare const getGetConversationQueryKey: (username: string, otherUsername: string) => readonly [`/api/messages/${string}/${string}`];
export declare const getGetConversationQueryOptions: <TData = Awaited<ReturnType<typeof getConversation>>, TError = ErrorType<unknown>>(username: string, otherUsername: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getConversation>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getConversation>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetConversationQueryResult = NonNullable<Awaited<ReturnType<typeof getConversation>>>;
export type GetConversationQueryError = ErrorType<unknown>;
/**
 * @summary Get messages between two users
 */
export declare function useGetConversation<TData = Awaited<ReturnType<typeof getConversation>>, TError = ErrorType<unknown>>(username: string, otherUsername: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getConversation>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Send a direct message
 */
export declare const getSendMessageUrl: (username: string, otherUsername: string) => string;
export declare const sendMessage: (username: string, otherUsername: string, sendMessageBody: SendMessageBody, options?: RequestInit) => Promise<DirectMessage>;
export declare const getSendMessageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendMessage>>, TError, {
        username: string;
        otherUsername: string;
        data: BodyType<SendMessageBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof sendMessage>>, TError, {
    username: string;
    otherUsername: string;
    data: BodyType<SendMessageBody>;
}, TContext>;
export type SendMessageMutationResult = NonNullable<Awaited<ReturnType<typeof sendMessage>>>;
export type SendMessageMutationBody = BodyType<SendMessageBody>;
export type SendMessageMutationError = ErrorType<unknown>;
/**
 * @summary Send a direct message
 */
export declare const useSendMessage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendMessage>>, TError, {
        username: string;
        otherUsername: string;
        data: BodyType<SendMessageBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof sendMessage>>, TError, {
    username: string;
    otherUsername: string;
    data: BodyType<SendMessageBody>;
}, TContext>;
/**
 * @summary Mark messages from otherUsername as read
 */
export declare const getMarkReadUrl: (username: string, otherUsername: string) => string;
export declare const markRead: (username: string, otherUsername: string, options?: RequestInit) => Promise<void>;
export declare const getMarkReadMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof markRead>>, TError, {
        username: string;
        otherUsername: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof markRead>>, TError, {
    username: string;
    otherUsername: string;
}, TContext>;
export type MarkReadMutationResult = NonNullable<Awaited<ReturnType<typeof markRead>>>;
export type MarkReadMutationError = ErrorType<unknown>;
/**
 * @summary Mark messages from otherUsername as read
 */
export declare const useMarkRead: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof markRead>>, TError, {
        username: string;
        otherUsername: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof markRead>>, TError, {
    username: string;
    otherUsername: string;
}, TContext>;
/**
 * @summary Get recently active users
 */
export declare const getGetOnlineUsersUrl: () => string;
export declare const getOnlineUsers: (options?: RequestInit) => Promise<User[]>;
export declare const getGetOnlineUsersQueryKey: () => readonly ["/api/online-users"];
export declare const getGetOnlineUsersQueryOptions: <TData = Awaited<ReturnType<typeof getOnlineUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOnlineUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getOnlineUsers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetOnlineUsersQueryResult = NonNullable<Awaited<ReturnType<typeof getOnlineUsers>>>;
export type GetOnlineUsersQueryError = ErrorType<unknown>;
/**
 * @summary Get recently active users
 */
export declare function useGetOnlineUsers<TData = Awaited<ReturnType<typeof getOnlineUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOnlineUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update last seen timestamp for user
 */
export declare const getPingUserUrl: (username: string) => string;
export declare const pingUser: (username: string, options?: RequestInit) => Promise<void>;
export declare const getPingUserMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof pingUser>>, TError, {
        username: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof pingUser>>, TError, {
    username: string;
}, TContext>;
export type PingUserMutationResult = NonNullable<Awaited<ReturnType<typeof pingUser>>>;
export type PingUserMutationError = ErrorType<unknown>;
/**
 * @summary Update last seen timestamp for user
 */
export declare const usePingUser: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof pingUser>>, TError, {
        username: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof pingUser>>, TError, {
    username: string;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map