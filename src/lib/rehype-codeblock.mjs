// 把 Astro/Shiki 產生的 <pre> 包成設計稿的 .codeblock 結構（標題列 + 語言 + 複製鈕）。
// 複製鈕的實際行為由 ArticleLayout 內的 client script 用事件代理處理。
import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

const processed = new WeakSet();

export default function rehypeCodeblock() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'pre' || !parent || index === null) return;
      if (processed.has(node)) return;
      processed.add(node);

      const codeChild = node.children.find((c) => c.tagName === 'code');
      const lang =
        (node.properties && node.properties.dataLanguage) ||
        (codeChild &&
          codeChild.properties &&
          Array.isArray(codeChild.properties.className) &&
          codeChild.properties.className
            .map(String)
            .find((c) => c.startsWith('language-'))
            ?.replace('language-', '')) ||
        'text';

      const wrapper = h('div', { class: 'codeblock' }, [
        h('div', { class: 'codehd' }, [
          h('span', { class: 'mono' }, lang),
          h('button', { class: 'copybtn', type: 'button', 'data-copy-code': 'true' }, '⧉ 複製'),
        ]),
        node,
      ]);

      parent.children[index] = wrapper;
    });
  };
}
