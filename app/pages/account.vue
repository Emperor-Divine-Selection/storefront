<script setup lang="ts">
const { user, isLoggedIn } = useCurrentUser()
</script>

<template>
    <div class="mx-auto max-w-6xl px-6 py-12">
        <template v-if="isLoggedIn">
            <h1 class="text-xl font-semibold text-[#0f172a]">个人中心</h1>
            <p class="mt-1.5 text-[13px] text-gray-500">账号信息与开店申请</p>

            <div class="mt-6 rounded-xl border border-[#e9ebef] bg-white p-6">
                <dl class="grid gap-4 sm:grid-cols-2">
                    <div>
                        <dt class="text-xs text-gray-400">用户名</dt>
                        <dd class="mt-1 text-sm text-gray-800">{{ user?.username }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs text-gray-400">邮箱</dt>
                        <dd class="mt-1 text-sm text-gray-800">{{ user?.email }}</dd>
                    </div>
                </dl>
            </div>

            <p class="mt-6 text-[13px] text-gray-400">申请状态与开店表单即将上线。</p>
        </template>

        <template v-else>
            <h1 class="text-xl font-semibold text-[#0f172a]">请先登录</h1>
            <p class="mt-1.5 text-[13px] text-gray-500">登录后才能查看个人信息和开店申请</p>
            <NuxtLink to="/login"
                class="mt-6 inline-block rounded-lg bg-[#0f172a] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1e293b]">
                去登录
            </NuxtLink>
        </template>
    </div>
</template>
