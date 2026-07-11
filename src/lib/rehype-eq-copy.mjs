// 把 rehype-katex 產生的置中公式（.katex-display）包成 .eq 容器，
// 從內嵌 MathML 的 <annotation encoding="application/x-tex"> 取出原始 LaTeX 存進 data-tex，
// 供「複製 LaTeX」按鈕使用（按鈕行為在 ArticleLayout 的 client script 裡用事件代理處理）。
import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

const processed = new WeakSet();

function textContent(node) {
  if (node.type === 'text') return node.value;
  if (node.children) return node.children.map(textContent).join('');
  return '';
}

export default function rehypeEqCopy() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === null) return;
      const classes = (node.properties && node.properties.className) || [];
      if (!Array.isArray(classes) || !classes.includes('katex-display')) return;
      if (processed.has(node)) return;
      processed.add(node);

      let tex = '';
      visit(node, 'element', (n) => {
        if (n.tagName === 'annotation') tex = textContent(n);
      });

      const wrapper = h('div', { class: 'eq' }, [
        h(
          'button',
          { class: 'eqcopy mono', type: 'button', 'data-copy-eq': 'true', 'data-tex': tex },
          '⧉ 複製 LaTeX'
        ),
        node,
      ]);

      parent.children[index] = wrapper;
    });
  };
}
