import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['@pinia/nuxt'],
    css: ['~/assets/css/main.css'],
    vite: { plugins: [tailwindcss()] },
    devServer: { port: 5175 },

    // 前端打 /api/xxx，转给 Axum 的 :3000。
    // 目标里的 /** 会把 /api 前缀剥掉，所以 /api/customer/me → :3000/customer/me
    routeRules: {
        '/api/**': { proxy: 'http://localhost:3000/**' },
    },

    app: {
        head: {
            title: 'RuneShop',
            htmlAttrs: { lang: 'zh-CN' },
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'description', content: 'RuneShop —— 精选好物，放心购买' },
            ],
        },
    },
})
