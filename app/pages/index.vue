<script setup lang="ts">
const { isLoggedIn, user } = useCurrentUser()
</script>

<template>
    <div class="mx-auto max-w-6xl px-6 py-16">
        <section class="max-w-2xl">
            <p class="text-xs font-medium uppercase tracking-widest text-blue-600">RuneShop</p>
            <h1 class="mt-3 text-3xl font-semibold leading-tight text-[#0f172a] sm:text-4xl">
                认真挑选的每一件商品
            </h1>
            <p class="mt-4 text-sm leading-7 text-gray-500">
                商品还在上架中。你可以先注册账号，或者直接申请开店——
                审核通过后，同一套账号就能在商户端管理自己的店铺。
            </p>

            <div class="mt-8 flex flex-wrap items-center gap-3">
                <template v-if="isLoggedIn">
                    <NuxtLink to="/apply"
                        class="rounded-lg bg-[#0f172a] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1e293b]">
                        我要开店
                    </NuxtLink>
                    <NuxtLink to="/account"
                        class="rounded-lg border border-[#e2e5ea] bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300">
                        个人中心
                    </NuxtLink>
                    <span class="text-[13px] text-gray-400">你好，{{ user?.username }}</span>
                </template>

                <template v-else>
                    <NuxtLink to="/register"
                        class="rounded-lg bg-[#0f172a] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1e293b]">
                        免费注册
                    </NuxtLink>
                    <NuxtLink to="/login"
                        class="rounded-lg border border-[#e2e5ea] bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300">
                        已有账号，登录
                    </NuxtLink>
                </template>
            </div>
        </section>

        <section class="mt-16 grid gap-4 sm:grid-cols-3">
            <div class="rounded-xl border border-[#e9ebef] bg-white p-5">
                <h3 class="text-sm font-semibold text-[#0f172a]">一套账号</h3>
                <p class="mt-2 text-[13px] leading-6 text-gray-500">
                    同一个账号既能下单购物，也能开店经营，不用注册两遍。
                </p>
            </div>
            <div class="rounded-xl border border-[#e9ebef] bg-white p-5">
                <h3 class="text-sm font-semibold text-[#0f172a]">审核留痕</h3>
                <p class="mt-2 text-[13px] leading-6 text-gray-500">
                    开店申请由运营人工审核，通过或驳回都有明确意见。
                </p>
            </div>
            <div class="rounded-xl border border-[#e9ebef] bg-white p-5">
                <h3 class="text-sm font-semibold text-[#0f172a]">随时可查</h3>
                <p class="mt-2 text-[13px] leading-6 text-gray-500">
                    申请进度在个人中心就能看，不必反复询问。
                </p>
            </div>
        </section>
    </div>
</template>
