/**
 * 统一请求封装
 *
 * 后端所有响应都是 { code, msg, data }，code 与 HTTP 状态码一致。
 * 这里把信封拆开，成功只返 data，失败抛 Error（由页面决定怎么展示）。
 */

interface ApiEnvelope<T> {
    code: number
    msg: string
    data: T
}

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: Record<string, unknown>
    query?: Record<string, string | number>
}

export const useApi = () => {
    // useRequestFetch 在服务端会把浏览器的 cookie 一并转发 ——
    // 这就是 SSR 首屏能读到登录态的原因，普通 $fetch 做不到
    const requestFetch = useRequestFetch()

    const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
        const response = await requestFetch<ApiEnvelope<T>>(`/api${path}`, {
            // 后端 4xx 也带 { code, msg, data }，别让 $fetch 把 body 丢掉直接抛
            ignoreResponseError: true,
            ...options,
        })

        if (!response || typeof response.code !== 'number') {
            throw new Error('服务异常，请稍后重试')
        }
        if (response.code >= 400) {
            throw new Error(response.msg)
        }

        return response.data
    }

    return { request }
}
