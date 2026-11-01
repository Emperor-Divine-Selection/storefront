<script setup lang="ts">
const { isLoggedIn } = useCurrentUser()
</script>

<template>
    <div class="mx-auto max-w-6xl px-6 py-12">
        <template v-if="isLoggedIn">
            <h1 class="text-xl font-semibold text-[#0f172a]">申请开店</h1>
            <p class="mt-1.5 text-[13px] text-gray-500">提交店铺名称，运营审核通过后即可在商户端经营</p>

            <p class="mt-6 text-[13px] text-gray-400">申请表单即将上线。</p>
        </template>

        <template v-else>
            <h1 class="text-xl font-semibold text-[#0f172a]">请先登录</h1>
            <p class="mt-1.5 text-[13px] text-gray-500">申请开店需要使用你的顾客账号</p>
            <NuxtLink to="/login"
                class="mt-6 inline-block rounded-lg bg-[#0f172a] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1e293b]">
                去登录
            </NuxtLink>
        </template>
    </div>
</template>
