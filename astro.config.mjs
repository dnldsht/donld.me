import { defineConfig } from 'astro/config'
import unocss from 'unocss/astro'
import vercel from '@astrojs/vercel'

export default defineConfig({
  site: 'https://donld.me',
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
      wrap: false,
    },
  },
  integrations: [unocss(
    { injectReset: true },
  )],
  server: {
    port: 8000,
    host: true,
  },
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
})
