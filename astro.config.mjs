// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// TODO(G): 上線後若綁定自有網域，改這裡的 site。
export default defineConfig({
  site: 'https://optimization-illustrated.pages.dev',
  server: {
    // 讓 dev/preview 綁定 harness 指派的 PORT（回退 4321）
    port: Number(process.env.PORT) || 4321,
    host: true,
  },
  integrations: [react(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
  // KaTeX（remark-math + rehype-katex）將於文章頁里程碑加入 markdown 設定。
});
