<script setup lang="ts">
interface Props {
    title: string
    subtitle: string
}

defineProps<Props>()
</script>

<template>
    <div class="flex min-h-dvh bg-[#f6f7f9]">
        <!-- 左侧品牌区（窄屏隐藏） -->
        <aside
            class="relative hidden w-[46%] max-w-160 flex-col justify-between overflow-hidden bg-[#0f172a] p-12 lg:flex">
            <!-- 一层极淡的光晕，避免整块死黑 -->
            <div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl">
            </div>
            <div class="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-indigo-400/8 blur-3xl">
            </div>

            <NuxtLink to="/" class="relative flex items-center gap-2.5">
                <span class="text-blue-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-6 w-6">
                        <path d="M3 9.5 5 4h14l2 5.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M4 9.5V20h16V9.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M9 20v-6h6v6" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </span>
                <span class="text-base font-semibold tracking-wide text-white">RuneShop</span>
            </NuxtLink>

            <div class="relative max-w-sm">
                <h2 class="text-2xl font-semibold leading-snug text-white">
                    精选好物<br />从一次挑选开始
                </h2>
                <p class="mt-3 text-sm leading-6 text-slate-400">
                    注册一个账号，既能购物，也能申请开店。<br />
                    同一套身份，买家卖家自由切换。
                </p>
            </div>

            <p class="relative text-xs text-slate-600">© 2026 RuneShop</p>
        </aside>

        <!-- 右侧表单区 -->
        <main class="flex flex-1 items-center justify-center px-6 py-12">
            <div class="w-full max-w-95">
                <!-- 窄屏时补一个 logo -->
                <NuxtLink to="/" class="mb-8 flex items-center gap-2 lg:hidden">
                    <span class="text-[#0f172a]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
                            class="h-5 w-5">
                            <path d="M3 9.5 5 4h14l2 5.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M4 9.5V20h16V9.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M9 20v-6h6v6" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </span>
                    <span class="text-sm font-semibold text-[#0f172a]">RuneShop</span>
                </NuxtLink>

                <h1 class="text-xl font-semibold text-[#0f172a]">{{ title }}</h1>
                <p class="mt-1.5 text-[13px] text-gray-500">{{ subtitle }}</p>

                <div class="mt-8">
                    <slot />
                </div>
            </div>
        </main>
    </div>
</template>
