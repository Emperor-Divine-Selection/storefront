<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

const { user, isLoggedIn } = useCurrentUser()
</script>

<template>
    <div class="mx-auto max-w-6xl px-6 py-14">
        <template v-if="isLoggedIn">
            <p class="font-mono text-[12px] tracking-[0.2em] text-cyan-400/70">// ACCOUNT</p>
            <h1 class="mt-3 text-xl font-semibold text-slate-100">个人中心</h1>
            <p class="mt-1.5 text-[13px] text-slate-400">账号信息与开店申请</p>

            <div class="relative mt-7 border border-[#1b2230] bg-[#121721] p-6">
                <span class="absolute -left-px -top-px h-3 w-3 border-l border-t border-cyan-400/35"></span>
                <span class="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-cyan-400/35"></span>

                <dl class="grid gap-5 sm:grid-cols-2">
                    <div>
                        <dt class="font-mono text-[11px] tracking-[0.12em] text-slate-500">用户名</dt>
                        <dd class="mt-1.5 text-sm text-slate-200">{{ user?.username }}</dd>
                    </div>
                    <div>
                        <dt class="font-mono text-[11px] tracking-[0.12em] text-slate-500">邮箱</dt>
                        <dd class="mt-1.5 text-sm text-slate-200">{{ user?.email }}</dd>
                    </div>
                </dl>
            </div>

            <NuxtLink to="/apply"
                class="mt-6 inline-flex items-center gap-2 border border-[#232c3d] px-4 py-2 text-[13px] text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-200">
                申请开店
                <ArrowRight class="h-3.5 w-3.5" :stroke-width="2" />
            </NuxtLink>
        </template>

        <template v-else>
            <p class="font-mono text-[12px] tracking-[0.2em] text-cyan-400/70">// ACCOUNT</p>
            <h1 class="mt-3 text-xl font-semibold text-slate-100">请先登录</h1>
            <p class="mt-1.5 text-[13px] text-slate-400">登录后才能查看个人信息和开店申请</p>
            <NuxtLink to="/login"
                class="mt-7 inline-block bg-[#0e7490] px-5 py-2.5 text-sm font-medium text-cyan-50 transition-all hover:bg-[#0891b2] hover:shadow-[0_0_24px_-6px_rgba(34,211,238,0.5)]">
                去登录
            </NuxtLink>
        </template>
    </div>
</template>
