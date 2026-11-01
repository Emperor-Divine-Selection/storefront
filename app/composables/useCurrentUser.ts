export interface CurrentUser {
    id: string
    username: string
    email: string
    avatar: string | null
    bio: string | null
    create_time: string
}

/**
 * 当前登录用户（全局共享一份）
 *
 * 用 useAsyncData 而不是普通 ref：SSR 时取一次，客户端水合直接复用，
 * 首屏不会出现「先显示未登录、再闪成已登录」。
 */
export const useCurrentUser = () => {
    const { request } = useApi()

    const { data: user, refresh } = useAsyncData<CurrentUser | null>('current-user', () =>
        // 没登录时后端返 401，这里当「未登录」处理，不当错误
        request<CurrentUser>('/customer/me').catch(() => null),
    )

    const isLoggedIn = computed(() => Boolean(user.value))

    const clear = () => {
        user.value = null
    }

    return { user, isLoggedIn, refresh, clear }
}
