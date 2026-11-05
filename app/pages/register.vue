<script setup lang="ts">
definePageMeta({ layout: false })

import { ArrowRight, Eye, EyeOff, KeyRound, Lock, Mail, User } from 'lucide-vue-next'

const { request } = useApi()

interface RegisterForm {
    username: string
    email: string
    password: string
    confirmPassword: string
}

const form = ref<RegisterForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
})

const submitting = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

const MIN_PASSWORD_LEN = 8
// 只挡明显笔误，验不了邮箱是否真实存在
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const validate = () => {
    if (!form.value.username.trim()) return '请输入用户名'
    if (!EMAIL_PATTERN.test(form.value.email.trim())) return '请输入有效的邮箱地址'
    if (form.value.password.length < MIN_PASSWORD_LEN) return `密码至少 ${MIN_PASSWORD_LEN} 位`
    if (form.value.password !== form.value.confirmPassword) return '两次输入的密码不一致'
    return ''
}

const handleSubmit = async () => {
    errorMessage.value = validate()
    if (errorMessage.value) return

    submitting.value = true
    try {
        await request('/customer/register', {
            method: 'POST',
            body: {
                username: form.value.username.trim(),
                email: form.value.email.trim(),
                password: form.value.password,
            },
        })

        // 注册接口只建账号、不发 token，所以去登录页
        await navigateTo('/login?registered=1')
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : '注册失败，请稍后重试'
    } finally {
        submitting.value = false
    }
}
</script>

<template>
    <AuthShell code="// REGISTER" title="注册" subtitle="创建身份，开始你的第一次交易">
        <div v-if="errorMessage"
            class="mb-5 border border-red-400/25 bg-red-400/6 px-3.5 py-2.5 text-[13px] text-red-300/90">
            {{ errorMessage }}
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
            <div>
                <label for="username"
                    class="mb-2 block font-mono text-[12px] tracking-widest text-slate-400">用户名</label>
                <div class="relative">
                    <User class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                        :stroke-width="1.6" />
                    <input id="username" v-model="form.username" type="text" autocomplete="off"
                        placeholder="登录时使用，注册后不可修改"
                        class="w-full border border-[#232c3d] bg-[#0f141c] py-2.5 pl-10 pr-3.5 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10" />
                </div>
            </div>

            <div>
                <label for="email" class="mb-2 block font-mono text-[12px] tracking-widest text-slate-400">邮箱</label>
                <div class="relative">
                    <Mail class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                        :stroke-width="1.6" />
                    <input id="email" v-model="form.email" type="email" autocomplete="off" placeholder="用于找回账号"
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
                        autocomplete="new-password" :placeholder="`至少 ${MIN_PASSWORD_LEN} 位`"
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

            <div>
                <label for="confirmPassword"
                    class="mb-2 block font-mono text-[12px] tracking-widest text-slate-400">确认密码</label>
                <div class="relative">
                    <KeyRound class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                        :stroke-width="1.6" />
                    <input id="confirmPassword" v-model="form.confirmPassword"
                        :type="showPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="再输入一次"
                        class="w-full border border-[#232c3d] bg-[#0f141c] py-2.5 pl-10 pr-3.5 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10" />
                </div>
            </div>

            <button type="submit" :disabled="submitting"
                class="mt-1 w-full bg-[#0e7490] py-2.5 text-sm font-semibold tracking-wide text-cyan-50 transition-all hover:bg-[#0891b2] hover:shadow-[0_0_22px_-6px_rgba(34,211,238,0.45)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none">
                <span class="flex items-center justify-center gap-2">
                    {{ submitting ? '创建中…' : '注册' }}
                    <ArrowRight v-if="!submitting" class="h-4 w-4" :stroke-width="2" />
                </span>
            </button>
        </form>

        <p class="mt-7 text-center text-[13px] text-slate-400">
            已经有账号了？
            <NuxtLink to="/login"
                class="font-medium text-cyan-400 underline-offset-4 transition-colors hover:text-cyan-300 hover:underline">
                直接登录
            </NuxtLink>
        </p>

        <p class="mt-7 text-center font-mono text-[11px] leading-5 tracking-widest text-slate-500">
            注册即表示同意《用户协议》与《隐私政策》
        </p>
    </AuthShell>
</template>
