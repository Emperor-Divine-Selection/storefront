<script setup lang="ts">
import { computed, ref } from 'vue'
import { Gem, LogOut } from 'lucide-vue-next'

const { user, isLoggedIn, refresh, clear } = useCurrentUser()
const { request } = useApi()

const loggingOut = ref(false)

const initial = computed(() => (user.value?.username ?? 'R').slice(0, 1).toUpperCase())

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
    <div class="flex min-h-dvh flex-col bg-[#0d1117]">
        <header class="sticky top-0 z-20 border-b border-[#1b2230] bg-[#0d1117]/85 backdrop-blur">
            <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                <NuxtLink to="/" class="flex items-center gap-2.5">
                    <span class="text-cyan-400/80">
                        <Gem class="h-5 w-5" :stroke-width="1.6" />
                    </span>
                    <span class="font-mono text-[13px] tracking-[0.25em] text-slate-200">RUNESHOP</span>
                </NuxtLink>

                <nav class="flex items-center gap-1 text-[13px]">
                    <template v-if="isLoggedIn">
                        <NuxtLink to="/apply"
                            class="px-3 py-1.5 text-slate-400 transition-colors hover:text-cyan-300">
                            我要开店
                        </NuxtLink>
                        <NuxtLink to="/account"
                            class="flex items-center gap-2 px-3 py-1.5 text-slate-400 transition-colors hover:text-cyan-300">
                            <img v-if="user?.avatar" :src="user.avatar" :alt="user.username"
                                class="h-6 w-6 border border-[#232c3d] object-cover" />
                            <span v-else
                                class="flex h-6 w-6 items-center justify-center bg-[#1b2230] font-mono text-[11px] text-cyan-300">
                                {{ initial }}
                            </span>
                            {{ user?.username }}
                        </NuxtLink>
                        <button type="button" :disabled="loggingOut"
                            class="flex items-center gap-1.5 px-3 py-1.5 text-slate-500 transition-colors hover:text-slate-300 disabled:opacity-50"
                            @click="handleLogout">
                            <LogOut class="h-3.5 w-3.5" :stroke-width="1.6" />
                            退出
                        </button>
                    </template>

                    <template v-else>
                        <NuxtLink to="/login"
                            class="px-3 py-1.5 text-slate-400 transition-colors hover:text-cyan-300">
                            登录
                        </NuxtLink>
                        <NuxtLink to="/register"
                            class="bg-[#0e7490] px-4 py-1.5 font-medium text-cyan-50 transition-all hover:bg-[#0891b2] hover:shadow-[0_0_20px_-6px_rgba(34,211,238,0.45)]">
                            注册
                        </NuxtLink>
                    </template>
                </nav>
            </div>
        </header>

        <main class="flex-1">
            <slot />
        </main>

        <footer class="border-t border-[#1b2230]">
            <div
                class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 font-mono text-[11px] tracking-[0.12em] text-slate-600 sm:flex-row">
                <span>© 2026 RUNESHOP</span>
                <span>认真挑选每一件商品</span>
            </div>
        </footer>
    </div>
</template>
