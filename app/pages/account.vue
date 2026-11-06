<script setup lang="ts">
import { ArrowRight, Camera } from 'lucide-vue-next'

const { user, isLoggedIn, refresh } = useCurrentUser()
const { request } = useApi()

const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const MAX_AVATAR_BYTES = 5 * 1024 * 1024

const initial = computed(() => (user.value?.username ?? 'R').slice(0, 1).toUpperCase())

const pickFile = () => {
    if (uploading.value) return
    fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    // 选同一个文件两次也要能触发 change
    input.value = ''
    if (!file) return

    errorMessage.value = ''
    successMessage.value = ''

    // 前端先挡一道，省得传 10MB 上去被后端拒
    if (file.size > MAX_AVATAR_BYTES) {
        errorMessage.value = '图片不能超过 5 MB'
        return
    }

    const formData = new FormData()
    formData.append('file', file)

    uploading.value = true
    try {
        await request('/customer/avatar', { method: 'POST', body: formData })
        // 头像 URL 带新 uuid，重新拉一次才不会显示旧图
        await refresh()
        successMessage.value = '头像已更新'
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : '上传失败，请稍后重试'
    } finally {
        uploading.value = false
    }
}
</script>

<template>
    <div class="mx-auto max-w-6xl px-6 py-14">
        <template v-if="isLoggedIn">
            <p class="font-mono text-[12px] tracking-widest text-cyan-400/70">// ACCOUNT</p>
            <h1 class="mt-3 text-xl font-semibold text-slate-100">个人中心</h1>
            <p class="mt-1.5 text-[13px] text-slate-400">账号信息与开店申请</p>

            <div class="relative mt-7 border border-[#1b2230] bg-[#121721] p-6">
                <span class="absolute -left-px -top-px h-3 w-3 border-l border-t border-cyan-400/35"></span>
                <span class="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-cyan-400/35"></span>

                <!-- 头像 -->
                <div class="flex items-center gap-4">
                    <div class="relative">
                        <img v-if="user?.avatar" :src="user.avatar" :alt="user.username"
                            class="h-16 w-16 border border-[#232c3d] object-cover" />
                        <div v-else
                            class="flex h-16 w-16 items-center justify-center border border-[#232c3d] bg-[#0f141c] font-mono text-xl text-cyan-300">
                            {{ initial }}
                        </div>

                        <!-- 上传中盖一层，避免用户以为没反应 -->
                        <div v-if="uploading"
                            class="absolute inset-0 flex items-center justify-center bg-[#0d1117]/80 font-mono text-[10px] tracking-widest text-cyan-300">
                            …
                        </div>
                    </div>

                    <div>
                        <p class="text-sm font-medium text-slate-200">{{ user?.username }}</p>
                        <button type="button" :disabled="uploading"
                            class="mt-2 flex items-center gap-1.5 border border-[#232c3d] px-3 py-1.5 text-[12px] text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                            @click="pickFile">
                            <Camera class="h-3.5 w-3.5" :stroke-width="1.8" />
                            {{ uploading ? '上传中…' : '更换头像' }}
                        </button>
                        <input ref="fileInput" type="file" accept="image/*" class="hidden"
                            @change="handleFileChange" />
                    </div>
                </div>

                <p v-if="errorMessage" class="mt-4 border border-red-400/25 bg-red-400/6 px-3 py-2 text-[12px] text-red-300/90">
                    {{ errorMessage }}
                </p>
                <p v-if="successMessage"
                    class="mt-4 border border-emerald-400/25 bg-emerald-400/6 px-3 py-2 text-[12px] text-emerald-300/90">
                    {{ successMessage }}
                </p>

                <dl class="mt-6 grid gap-5 border-t border-[#1b2230] pt-6 sm:grid-cols-2">
                    <div>
                        <dt class="font-mono text-[11px] tracking-widest text-slate-500">用户名</dt>
                        <dd class="mt-1.5 text-sm text-slate-200">{{ user?.username }}</dd>
                    </div>
                    <div>
                        <dt class="font-mono text-[11px] tracking-widest text-slate-500">邮箱</dt>
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
            <p class="font-mono text-[12px] tracking-widest text-cyan-400/70">// ACCOUNT</p>
            <h1 class="mt-3 text-xl font-semibold text-slate-100">请先登录</h1>
            <p class="mt-1.5 text-[13px] text-slate-400">登录后才能查看个人信息和开店申请</p>
            <NuxtLink to="/login"
                class="mt-7 inline-block bg-[#0e7490] px-5 py-2.5 text-sm font-medium text-cyan-50 transition-all hover:bg-[#0891b2] hover:shadow-[0_0_24px_-6px_rgba(34,211,238,0.5)]">
                去登录
            </NuxtLink>
        </template>
    </div>
</template>
