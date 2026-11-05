<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()

import { ArrowRight, Eye, EyeOff, Lock, User } from 'lucide-vue-next'

const { request } = useApi()
const { refresh } = useCurrentUser()

interface LoginForm {
    username: string
    password: string
}

// 泛型写在 reactive 上：约束入参形状，返回值类型由 Vue 自己算，
// 不用 `const form: LoginForm = ...`（那种断言可能和实际类型不符）
const form = ref<LoginForm>({
    username: '',
    password: '',
})

const submitting = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

// 从注册页跳过来时给个成功提示
const justRegistered = computed(() => route.query.registered === '1')

const validate = () => {
    if (!form.value.username.trim()) return '请输入用户名'
    if (!form.value.password) return '请输入密码'
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
                username: form.value.username.trim(),
                password: form.value.password,
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
    <AuthShell code="// ACCESS" title="登录" subtitle="验证身份，进入符文商店">
        <div v-if="justRegistered"
            class="mb-5 border border-emerald-400/25 bg-emerald-400/6 px-3.5 py-2.5 text-[13px] text-emerald-300/90">
            注册成功，请用刚才的账号登录。
        </div>

        <div v-if="errorMessage"
            class="mb-5 border border-red-400/25 bg-red-400/6 px-3.5 py-2.5 text-[13px] text-red-300/90">
            {{ errorMessage }}
        </div>

        <form class="space-y-5" @submit.prevent="handleSubmit">
            <div>
                <label for="username"
                    class="mb-2 block font-mono text-[12px] tracking-widest text-slate-400">用户名</label>
                <div class="relative">
                    <User class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                        :stroke-width="1.6" />
                    <input id="username" v-model="form.username" type="text" autocomplete="off"
                        placeholder="输入用户名"
                        class="w-full border border-[#232c3d] bg-[#0f141c] py-2.5 pl-10 pr-3.5 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10" />
                </div>
            </div>

            <div>
                <label for="password"
                    class="mb-2 block font-mono text-[12px] tracking-widest text-slate-400">密码</label>
                <div class="relative">
                    <Lock class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                        :stroke-width="1.6" />
                    <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                        autocomplete="new-password" placeholder="输入密码"
                        class="w-full border border-[#232c3d] bg-[#0f141c] py-2.5 pl-10 pr-11 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10" />
                    <button type="button"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-cyan-300"
                        :aria-label="showPassword ? '隐藏密码' : '显示密码'"
                        @click="showPassword = !showPassword">
                        <EyeOff v-if="showPassword" class="h-4 w-4" :stroke-width="1.6" />
                        <Eye v-else class="h-4 w-4" :stroke-width="1.6" />
                    </button>
                </div>
            </div>

            <button type="submit" :disabled="submitting"
                class="mt-1 w-full bg-[#0e7490] py-2.5 text-sm font-semibold tracking-wide text-cyan-50 transition-all hover:bg-[#0891b2] hover:shadow-[0_0_22px_-6px_rgba(34,211,238,0.45)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none">
                <span class="flex items-center justify-center gap-2">
                    {{ submitting ? '验证中…' : '登录' }}
                    <ArrowRight v-if="!submitting" class="h-4 w-4" :stroke-width="2" />
                </span>
            </button>
        </form>

        <p class="mt-7 text-center text-[13px] text-slate-400">
            还没有账号？
            <NuxtLink to="/register"
                class="font-medium text-cyan-400 underline-offset-4 transition-colors hover:text-cyan-300 hover:underline">
                立即注册
            </NuxtLink>
        </p>

        <p class="mt-7 text-center font-mono text-[11px] tracking-widest text-slate-500">
            仅限本人使用 · 请勿共享账号
        </p>
    </AuthShell>
</template>
