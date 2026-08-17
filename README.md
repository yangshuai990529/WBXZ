# TV 色彩风格 Demo（线上部署产物副本）

此目录从 Cloudflare Pages 部署地址恢复，包含当前网页运行所需的 HTML、CSS、JavaScript、图片和图标。

## 本地运行

```bash
npm run dev
```

然后访问 <http://localhost:4173>。

## 文件说明

- `index.html`：页面入口
- `assets/index--LcZh2cx.css`：页面样式
- `assets/index-R9eMNHbS.js`：React 编译后的页面逻辑
- `assets/*.jpg`：演示图片

注意：Cloudflare Pages 公开地址只提供构建产物，不包含原始 `src/`、组件文件或构建配置。当前副本可直接运行和修改；若要进行较大幅度迭代，建议后续把页面逻辑重构回易维护的 React 源码结构。
