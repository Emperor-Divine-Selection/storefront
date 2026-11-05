<script setup lang="ts">
import { Gem } from 'lucide-vue-next'

interface Props {
    /** 面板顶部那行等宽小字，像终端提示 */
    code: string
    title: string
    subtitle: string
}

defineProps<Props>()
</script>

<template>
    <div class="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0d1117] px-6 py-14">
        <!-- 网格背景（中心亮、边缘淡出） -->
        <div class="bg-grid pointer-events-none absolute inset-0"></div>

        <!-- 两团氛围光，压到很淡：只是让画面不死板，不参与照明 -->
        <div class="pointer-events-none absolute -left-40 -top-32 h-[440px] w-[440px] rounded-full bg-cyan-500/6 blur-[130px]">
        </div>
        <div class="pointer-events-none absolute -bottom-40 -right-32 h-[420px] w-[420px] rounded-full bg-fuchsia-500/6 blur-[130px]">
        </div>

        <div class="relative w-full max-w-105">
            <!-- 品牌 -->
            <NuxtLink to="/" class="mb-8 flex items-center gap-2.5">
                <span class="text-cyan-400/80">
                    <Gem class="h-5 w-5" :stroke-width="1.6" />
                </span>
                <span class="font-mono text-[13px] tracking-[0.25em] text-slate-300">RUNESHOP</span>
            </NuxtLink>

            <!-- 主面板 -->
            <div class="relative border border-[#1b2230] bg-[#121721]/88 p-8 backdrop-blur-sm">
                <!-- 四个角标，HUD 感 -->
                <span class="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l border-t border-cyan-400/40"></span>
                <span class="pointer-events-none absolute -right-px -top-px h-3 w-3 border-r border-t border-cyan-400/40"></span>
                <span class="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b border-l border-cyan-400/40"></span>
                <span class="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b border-r border-cyan-400/40"></span>

                <p class="font-mono text-[12px] tracking-widest text-cyan-400/60">{{ code }}</p>
                <h1 class="mt-2.5 text-xl font-semibold text-slate-100">{{ title }}</h1>
                <p class="mt-1.5 text-[13px] text-slate-400">{{ subtitle }}</p>

                <div class="mt-7">
                    <slot />
                </div>
            </div>

            <p class="mt-7 text-center font-mono text-[11px] tracking-widest text-slate-500">
                © 2026 RUNESHOP
            </p>
        </div>
    </div>
</template>

<style scoped>
.bg-grid {
    background-image:
        linear-gradient(to right, rgba(34, 211, 238, 0.045) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(34, 211, 238, 0.045) 1px, transparent 1px);
    background-size: 64px 64px;
    /* 中间清楚、四周淡出：满屏细线是最直接的视觉噪音来源 */
    mask-image: radial-gradient(ellipse 65% 55% at 50% 45%, #000 10%, transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse 65% 55% at 50% 45%, #000 10%, transparent 100%);
}
</style>
