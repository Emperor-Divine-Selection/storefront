<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()

const { request } = useApi()
const { refresh } = useCurrentUser()

const form = reactive({
    username: '',
    password: '',
})

const submitting = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

// 从注册页跳过来时给个成功提示
const justRegistered = computed(() => route.query.registered === '1')

const validate = () => {
    if (!form.username.trim()) return '请输入用户名'
    if (!form.password) return '请输入密码'
    return ''
}

const handleSubmit = async () => {
    errorMessage.value = validate()
    if (errorMessage.value) return

    submitting.value = true
    try {
        await request('/customer/auth/login', {
            method: 'POST',
            body: {
                username: form.username.trim(),
                password: form.password,
            },
        })

        // cookie 已经由后端写入，刷新一下共享的登录态，顶栏才会立刻变成已登录
        await refresh()
        await navigateTo('/account')
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : '登录失败，请稍后重试'
    } finally {
        submitting.value = false
    }
}
</script>

<template>
    <AuthShell title="登录" subtitle="欢迎回来，继续挑选你想要的">
        <div v-if="justRegistered"
            class="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[13px] text-emerald-700">
            注册成功，请用刚才的账号登录。
        </div>

        <div v-if="errorMessage"
            class="mb-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
            {{ errorMessage }}
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
            <div>
                <label for="username" class="mb-1.5 block text-[13px] font-medium text-gray-700">用户名</label>
                <input id="username" v-model="form.username" type="text" autocomplete="off"
                    placeholder="请输入用户名"
                    class="w-full rounded-lg border border-[#e2e5ea] bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" />
            </div>

            <div>
                <label for="password" class="mb-1.5 block text-[13px] font-medium text-gray-700">密码</label>
                <div class="relative">
                    <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                        autocomplete="new-password" placeholder="请输入密码"
                        class="w-full rounded-lg border border-[#e2e5ea] bg-white px-3.5 py-2.5 pr-14 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" />
                    <button type="button"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 transition-colors hover:text-gray-600"
                        @click="showPassword = !showPassword">
                        {{ showPassword ? '隐藏' : '显示' }}
                    </button>
                </div>
            </div>

            <button type="submit" :disabled="submitting"
                class="mt-2 w-full rounded-lg bg-[#0f172a] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1e293b] disabled:cursor-not-allowed disabled:opacity-60">
                {{ submitting ? '登录中…' : '登录' }}
            </button>
        </form>

        <p class="mt-6 text-center text-[13px] text-gray-500">
            还没有账号？
            <NuxtLink to="/register" class="font-medium text-[#0f172a] underline-offset-4 hover:underline">
                立即注册
            </NuxtLink>
        </p>

        <p class="mt-8 text-center text-xs text-gray-400">仅限本人使用，请勿共享账号</p>
    </AuthShell>
</template>
