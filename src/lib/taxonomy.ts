// 三維度分類的顯示標籤（對照 Claude_Code_交接檔.md 第 3、7 節）。
export const DOMAIN_LABELS = {
  foundations: '基礎數學',
  lp: 'LP 線性規劃',
  ip: 'IP 整數規劃',
  nlp: 'NLP 非線性規劃',
  sp: 'SP 隨機規劃',
  sip: 'SIP 隨機整數規劃',
  dp: 'DP 動態規劃',
  decomposition: '分解與對偶',
  tools: '工具與計算',
} as const;

export type Domain = keyof typeof DOMAIN_LABELS;

export const TYPE_LABELS = {
  concept: '觀念',
  method: '方法',
  proof: '證明',
  application: '應用',
  guide: '導讀',
  qa: '答讀者問',
} as const;

export type ArticleType = keyof typeof TYPE_LABELS;
