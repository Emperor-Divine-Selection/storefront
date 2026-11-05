<script setup lang="ts">
import { ArrowRight, Store } from 'lucide-vue-next'

const { isLoggedIn, user } = useCurrentUser()
</script>

<template>
    <div class="relative mx-auto max-w-6xl px-6 py-20">
        <!-- 顶部一根渐隐的青色分隔线，弱化"落地页"的呆板 -->
        <div class="pointer-events-none absolute left-0 right-0 top-0 h-px
                    bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>

        <section class="max-w-2xl">
            <p class="font-mono text-[12px] tracking-[0.2em] text-cyan-400/70">// RUNESHOP</p>

            <h1 class="mt-4 text-3xl font-semibold leading-tight text-slate-100 sm:text-4xl">
                认真挑选的<br class="sm:hidden" />每一件商品
            </h1>

            <p class="mt-5 max-w-lg text-sm leading-7 text-slate-400">
                商品还在上架中。你可以先注册账号，或者直接申请开店——
                审核通过后，同一套账号就能在商家中心管理自己的店铺。
            </p>

            <div class="mt-9 flex flex-wrap items-center gap-3">
                <template v-if="isLoggedIn">
                    <NuxtLink to="/apply"
                        class="flex items-center gap-2 bg-[#0e7490] px-5 py-2.5 text-sm font-medium text-cyan-50 transition-all hover:bg-[#0891b2] hover:shadow-[0_0_24px_-6px_rgba(34,211,238,0.5)]">
                        <Store class="h-4 w-4" :stroke-width="1.8" />
                        我要开店
                    </NuxtLink>
                    <NuxtLink to="/account"
                        class="border border-[#232c3d] px-5 py-2.5 text-sm text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-200">
                        个人中心
                    </NuxtLink>
                    <span class="font-mono text-[12px] text-slate-500">
                        你好，{{ user?.username }}
                    </span>
                </template>

                <template v-else>
                    <NuxtLink to="/register"
                        class="flex items-center gap-2 bg-[#0e7490] px-5 py-2.5 text-sm font-medium text-cyan-50 transition-all hover:bg-[#0891b2] hover:shadow-[0_0_24px_-6px_rgba(34,211,238,0.5)]">
                        免费注册
                        <ArrowRight class="h-4 w-4" :stroke-width="2" />
                    </NuxtLink>
                    <NuxtLink to="/login"
                        class="border border-[#232c3d] px-5 py-2.5 text-sm text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-200">
                        已有账号，登录
                    </NuxtLink>
                </template>
            </div>
        </section>

        <section class="mt-20 grid gap-4 sm:grid-cols-3">
            <div class="relative border border-[#1b2230] bg-[#121721] p-5">
                <span class="absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-cyan-400/35"></span>
                <h3 class="text-sm font-medium text-slate-200">一套账号</h3>
                <p class="mt-2 text-[13px] leading-6 text-slate-500">
                    同一个账号既能下单购物，也能开店经营，不用注册两遍。
                </p>
            </div>
            <div class="relative border border-[#1b2230] bg-[#121721] p-5">
                <span class="absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-cyan-400/35"></span>
                <h3 class="text-sm font-medium text-slate-200">审核留痕</h3>
                <p class="mt-2 text-[13px] leading-6 text-slate-500">
                    开店申请由运营人工审核，通过或驳回都有明确意见。
                </p>
            </div>
            <div class="relative border border-[#1b2230] bg-[#121721] p-5">
                <span class="absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-cyan-400/35"></span>
                <h3 class="text-sm font-medium text-slate-200">随时可查</h3>
                <p class="mt-2 text-[13px] leading-6 text-slate-500">
                    申请进度在个人中心就能看，不必反复询问。
                </p>
            </div>
        </section>
    </div>
</template>
