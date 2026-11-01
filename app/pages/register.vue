<script setup lang="ts">
definePageMeta({ layout: false })

const { request } = useApi()

const form = reactive({
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
    if (!form.username.trim()) return '请输入用户名'
    if (!EMAIL_PATTERN.test(form.email.trim())) return '请输入有效的邮箱地址'
    if (form.password.length < MIN_PASSWORD_LEN) return `密码至少 ${MIN_PASSWORD_LEN} 位`
    if (form.password !== form.confirmPassword) return '两次输入的密码不一致'
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
                username: form.username.trim(),
                email: form.email.trim(),
                password: form.password,
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
    <AuthShell title="注册" subtitle="创建账号，开始挑选好物">
        <div v-if="errorMessage"
            class="mb-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600">
            {{ errorMessage }}
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
            <div>
                <label for="username" class="mb-1.5 block text-[13px] font-medium text-gray-700">用户名</label>
                <input id="username" v-model="form.username" type="text" autocomplete="off"
                    placeholder="登录时使用，注册后不可修改"
                    class="w-full rounded-lg border border-[#e2e5ea] bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" />
            </div>

            <div>
                <label for="email" class="mb-1.5 block text-[13px] font-medium text-gray-700">邮箱</label>
                <input id="email" v-model="form.email" type="email" autocomplete="off"
                    placeholder="用于找回账号"
                    class="w-full rounded-lg border border-[#e2e5ea] bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" />
            </div>

            <div>
                <label for="password" class="mb-1.5 block text-[13px] font-medium text-gray-700">密码</label>
                <div class="relative">
                    <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                        autocomplete="new-password" :placeholder="`至少 ${MIN_PASSWORD_LEN} 位`"
                        class="w-full rounded-lg border border-[#e2e5ea] bg-white px-3.5 py-2.5 pr-14 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" />
                    <button type="button"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 transition-colors hover:text-gray-600"
                        @click="showPassword = !showPassword">
                        {{ showPassword ? '隐藏' : '显示' }}
                    </button>
                </div>
            </div>

            <div>
                <label for="confirmPassword" class="mb-1.5 block text-[13px] font-medium text-gray-700">确认密码</label>
                <input id="confirmPassword" v-model="form.confirmPassword"
                    :type="showPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="再输入一次"
                    class="w-full rounded-lg border border-[#e2e5ea] bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" />
            </div>

            <button type="submit" :disabled="submitting"
                class="mt-2 w-full rounded-lg bg-[#0f172a] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1e293b] disabled:cursor-not-allowed disabled:opacity-60">
                {{ submitting ? '注册中…' : '注册' }}
            </button>
        </form>

        <p class="mt-6 text-center text-[13px] text-gray-500">
            已经有账号了？
            <NuxtLink to="/login" class="font-medium text-[#0f172a] underline-offset-4 hover:underline">
                直接登录
            </NuxtLink>
        </p>

        <p class="mt-8 text-center text-xs leading-5 text-gray-400">
            注册即表示同意《用户协议》与《隐私政策》
        </p>
    </AuthShell>
</template>
