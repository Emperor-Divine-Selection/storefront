<script setup lang="ts">
import { ArrowRight, CheckCircle2, Clock, XCircle } from 'lucide-vue-next'

interface Application {
    id: string
    shop_name: string
    status: 'pending' | 'approved' | 'rejected'
    create_time: string
    reviewed_at: string | null
    review_remark: string | null
}

const { isLoggedIn } = useCurrentUser()
const { request } = useApi()

const submitting = ref(false)
const errorMessage = ref('')

const shopName = ref('')

const MAX_SHOP_NAME_LEN = 50

const formatTime = (raw: string | null) => {
    if (!raw) return '—'
    return new Date(raw).toLocaleString('zh-CN', { hour12: false })
}

// SSR 阶段就把状态取出来：否则首屏会闪一下 LOADING，对「查进度」这种页面很别扭
const {
    data: application,
    refresh,
    pending: loading,
} = await useAsyncData<Application | null>('customer-application', () =>
    isLoggedIn.value
        ? request<Application | null>('/customer/application').catch(() => null)
        : Promise.resolve(null),
)

const handleSubmit = async () => {
    errorMessage.value = ''
    const name = shopName.value.trim()

    if (!name) {
        errorMessage.value = '请输入店铺名称'
        return
    }
    if (name.length > MAX_SHOP_NAME_LEN) {
        errorMessage.value = `店铺名称不能超过 ${MAX_SHOP_NAME_LEN} 个字`
        return
    }

    submitting.value = true
    try {
        // 提交成功后重新拉一次：状态以服务端为准，不要自己拼
        await request('/merchant/apply', {
            method: 'POST',
            body: { shop_name: name },
        })
        await refresh()
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : '提交失败，请稍后重试'
    } finally {
        submitting.value = false
    }
}

const statusMeta = computed(() => {
    switch (application.value?.status) {
        case 'approved':
            return {
                label: '已通过',
                icon: CheckCircle2,
                color: 'text-emerald-300',
                border: 'border-emerald-400/30',
                bg: 'bg-emerald-400/6',
            }
        case 'rejected':
            return {
                label: '已驳回',
                icon: XCircle,
                color: 'text-red-300',
                border: 'border-red-400/30',
                bg: 'bg-red-400/6',
            }
        default:
            return {
                label: '审核中',
                icon: Clock,
                color: 'text-amber-300',
                border: 'border-amber-400/30',
                bg: 'bg-amber-400/6',
            }
    }
})
</script>

<template>
    <div class="mx-auto max-w-3xl px-6 py-14">
        <p class="font-mono text-[12px] tracking-widest text-cyan-400/70">// APPLY</p>
        <h1 class="mt-3 text-xl font-semibold text-slate-100">申请开店</h1>
        <p class="mt-1.5 text-[13px] text-slate-400">
            提交店铺名称，运营审核通过后即可在商家中心经营
        </p>

        <!-- 未登录 -->
        <template v-if="!isLoggedIn">
            <div class="mt-7 border border-[#1b2230] bg-[#121721] p-6">
                <p class="text-[13px] text-slate-400">申请开店需要使用你的顾客账号。</p>
                <NuxtLink to="/login"
                    class="mt-5 inline-flex items-center gap-2 bg-[#0e7490] px-5 py-2.5 text-sm font-medium text-cyan-50 transition-all hover:bg-[#0891b2] hover:shadow-[0_0_24px_-6px_rgba(34,211,238,0.5)]">
                    去登录
                    <ArrowRight class="h-4 w-4" :stroke-width="2" />
                </NuxtLink>
            </div>
        </template>

        <!-- 已登录：加载中 -->
        <template v-else-if="loading">
            <div class="mt-7 border border-[#1b2230] bg-[#121721] p-6">
                <p class="font-mono text-[12px] tracking-widest text-slate-500">LOADING…</p>
            </div>
        </template>

        <!-- 已登录：有申请单 -->
        <template v-else-if="application">
            <div class="relative mt-7 border bg-[#121721] p-6" :class="statusMeta.border">
                <span class="absolute -left-px -top-px h-3 w-3 border-l border-t border-cyan-400/35"></span>
                <span class="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-cyan-400/35"></span>

                <div class="flex items-center gap-2" :class="statusMeta.color">
                    <component :is="statusMeta.icon" class="h-4 w-4" :stroke-width="1.8" />
                    <span class="font-mono text-[12px] tracking-widest">{{ statusMeta.label }}</span>
                </div>

                <p class="mt-4 text-lg font-medium text-slate-100">{{ application.shop_name }}</p>

                <dl class="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                        <dt class="font-mono text-[11px] tracking-widest text-slate-500">提交时间</dt>
                        <dd class="mt-1.5 text-[13px] text-slate-300">{{ formatTime(application.create_time) }}</dd>
                    </div>
                    <div v-if="application.reviewed_at">
                        <dt class="font-mono text-[11px] tracking-widest text-slate-500">审核时间</dt>
                        <dd class="mt-1.5 text-[13px] text-slate-300">{{ formatTime(application.reviewed_at) }}</dd>
                    </div>
                </dl>

                <div v-if="application.review_remark"
                    class="mt-5 border-l-2 border-cyan-400/40 bg-[#0f141c] px-4 py-3">
                    <p class="font-mono text-[11px] tracking-widest text-slate-500">审核意见</p>
                    <p class="mt-1.5 text-[13px] leading-6 text-slate-300">{{ application.review_remark }}</p>
                </div>

                <!-- 分状态的动作 -->
                <div class="mt-6">
                    <template v-if="application.status === 'approved'">
                        <p class="text-[13px] text-slate-400">
                            现在可以用同一个账号登录商家中心，管理你的店铺。
                        </p>
                        <a href="http://localhost:5174/login" target="_blank" rel="noreferrer"
                            class="mt-4 inline-flex items-center gap-2 bg-[#0e7490] px-5 py-2.5 text-sm font-medium text-cyan-50 transition-all hover:bg-[#0891b2] hover:shadow-[0_0_24px_-6px_rgba(34,211,238,0.5)]">
                            前往商家中心
                            <ArrowRight class="h-4 w-4" :stroke-width="2" />
                        </a>
                    </template>

                    <template v-else-if="application.status === 'pending'">
                        <p class="text-[13px] text-slate-400">
                            运营正在审核，通常一个工作日内会有结果。
                        </p>
                    </template>

                    <template v-else>
                        <p class="text-[13px] text-slate-400">
                            当前一个账号只能提交一次开店申请，被驳回后暂不支持重新提交。
                        </p>
                    </template>
                </div>
            </div>
        </template>

        <!-- 已登录：还没申请过 -->
        <template v-else>
            <div v-if="errorMessage"
                class="mt-7 border border-red-400/25 bg-red-400/6 px-4 py-3 text-[13px] text-red-300/90">
                {{ errorMessage }}
            </div>

            <form class="relative mt-7 border border-[#1b2230] bg-[#121721] p-6"
                @submit.prevent="handleSubmit">
                <span class="absolute -left-px -top-px h-3 w-3 border-l border-t border-cyan-400/35"></span>

                <label for="shopName" class="mb-2 block font-mono text-[12px] tracking-widest text-slate-400">
                    店铺名称
                </label>
                <input id="shopName" v-model="shopName" type="text" autocomplete="off"
                    :maxlength="MAX_SHOP_NAME_LEN" placeholder="例如：星辰符文铺"
                    class="w-full border border-[#232c3d] bg-[#0f141c] px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10" />
                <p class="mt-2 flex items-center justify-between font-mono text-[11px] text-slate-500">
                    <span>提交后不可修改 · 全站唯一</span>
                    <span>{{ shopName.length }} / {{ MAX_SHOP_NAME_LEN }}</span>
                </p>

                <button type="submit" :disabled="submitting"
                    class="mt-6 w-full bg-[#0e7490] py-2.5 text-sm font-semibold tracking-wide text-cyan-50 transition-all hover:bg-[#0891b2] hover:shadow-[0_0_22px_-6px_rgba(34,211,238,0.45)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none">
                    <span class="flex items-center justify-center gap-2">
                        {{ submitting ? '提交中…' : '提交申请' }}
                        <ArrowRight v-if="!submitting" class="h-4 w-4" :stroke-width="2" />
                    </span>
                </button>
            </form>
        </template>
    </div>
</template>
