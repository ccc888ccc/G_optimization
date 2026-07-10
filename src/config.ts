// 全站設定集中處。站名/副標/連結改這裡即可全站更新。

export const SITE = {
  /** 主站名（Header 標題、<title> 後綴、SEO）。TODO(G): 站名可再定案。 */
  name: 'G的呼吸小站',
  /** 英文副標，沿用企劃暫定名，學術期刊感。 */
  tagline: 'Optimization, Illustrated',
  /** 一句話描述，用於首頁與 SEO meta。 */
  description: '一個把數學最佳化講到透的教學網站：先直覺、後嚴謹證明，配互動視覺化。',
  /** 預設語系。 */
  lang: 'zh-Hant',
  /** 作者 / 版權標示。 */
  author: 'G',
} as const;

/** 主選單（Header 用）。順序即顯示序。 */
export const NAV: { label: string; href: string }[] = [
  { label: '首頁', href: '/' },
  { label: '學習路徑', href: '/paths' },
  { label: '各領域', href: '/domains' },
  { label: '每週問題', href: '/weekly' },
  { label: '習題', href: '/exercises' },
  { label: '速查', href: '/reference' },
  { label: '關於', href: '/about' },
];
