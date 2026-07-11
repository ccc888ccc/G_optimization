// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeCodeblock from './src/lib/rehype-codeblock.mjs';
import rehypeEqCopy from './src/lib/rehype-eq-copy.mjs';

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
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, rehypeEqCopy, rehypeCodeblock],
    shikiConfig: {
      // 用 css-variables 主題，讓語法上色吃 global.css 的 --code-* token（亮/深自動切換）。
      theme: 'css-variables',
    },
  },
});
