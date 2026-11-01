<script setup lang="ts">
const { user, isLoggedIn, refresh, clear } = useCurrentUser()
const { request } = useApi()

const loggingOut = ref(false)

const handleLogout = async () => {
    loggingOut.value = true
    try {
        await request('/auth/logout', { method: 'POST' })
    } catch {
        // 服务端没删掉也不该把用户卡在页面上，下面照样清本地状态
    } finally {
        clear()
        await refresh()
        await navigateTo('/')
        loggingOut.value = false
    }
}
</script>

<template>
    <div class="flex min-h-dvh flex-col bg-[#f6f7f9]">
        <header class="sticky top-0 z-20 border-b border-[#e9ebef] bg-white/90 backdrop-blur">
            <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                <NuxtLink to="/" class="flex items-center gap-2.5">
                    <span class="text-[#0f172a]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
                            class="h-6 w-6">
                            <path d="M3 9.5 5 4h14l2 5.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M4 9.5V20h16V9.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M9 20v-6h6v6" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </span>
                    <span class="text-base font-semibold tracking-tight text-[#0f172a]">RuneShop</span>
                </NuxtLink>

                <nav class="flex items-center gap-1 text-[13px]">
                    <template v-if="isLoggedIn">
                        <NuxtLink to="/apply"
                            class="rounded-md px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
                            我要开店
                        </NuxtLink>
                        <NuxtLink to="/account"
                            class="rounded-md px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
                            {{ user?.username }}
                        </NuxtLink>
                        <button type="button" :disabled="loggingOut"
                            class="rounded-md px-3 py-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
                            @click="handleLogout">
                            退出
                        </button>
                    </template>

                    <template v-else>
                        <NuxtLink to="/login"
                            class="rounded-md px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
                            登录
                        </NuxtLink>
                        <NuxtLink to="/register"
                            class="rounded-md bg-[#0f172a] px-4 py-1.5 font-medium text-white transition-colors hover:bg-[#1e293b]">
                            注册
                        </NuxtLink>
                    </template>
                </nav>
            </div>
        </header>

        <main class="flex-1">
            <slot />
        </main>

        <footer class="border-t border-[#e9ebef] bg-white">
            <div
                class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-gray-400 sm:flex-row">
                <span>© 2026 RuneShop</span>
                <span>认真挑选每一件商品</span>
            </div>
        </footer>
    </div>
</template>
