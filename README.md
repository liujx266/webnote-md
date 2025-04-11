# MDNote - Markdown笔记应用

一个简洁易用的Web端Markdown笔记应用，支持实时预览功能。

## 功能特点

- ✏️ **创建笔记**: 快速创建新的笔记文档
- 🔍 **查看笔记**: 列表式管理所有笔记
- ✍️ **编辑笔记**: 使用Markdown语法编辑内容
- 🗑️ **删除笔记**: 一键删除不需要的笔记
- 👁️ **实时预览**: 编辑的同时查看渲染后的效果
- 📂 **分类管理**: 创建和管理笔记分类
- 🏷️ **标签系统**: 为笔记添加多个标签，方便归类
- ⭐ **收藏功能**: 收藏重要笔记，快速访问
- 📤 **多格式导出**: 支持导出为Markdown、HTML和纯文本
- 🌓 **明暗主题**: 支持切换明亮和暗黑模式
- 💾 **本地存储**: 使用浏览器localStorage自动保存所有笔记

## 技术栈

- **React**: 用于构建用户界面的JavaScript库
- **TypeScript**: 提供类型安全的JavaScript超集
- **Styled Components**: CSS-in-JS解决方案，用于组件样式
- **React Markdown**: 用于渲染Markdown内容
- **KaTeX**: 用于数学公式渲染
- **Remark/Rehype插件**: 增强Markdown功能，支持GFM和数学公式
- **Vite**: 现代前端构建工具，提供更快的开发体验

## 项目结构

```plaintext
D:\mdnote\
├── src\                       # 源代码目录
│   ├── components\            # React组件
│   │   ├── CategoryManager.tsx # 分类管理组件
│   │   ├── ExportDialog.tsx   # 导出对话框组件
│   │   ├── NoteEditor.tsx     # 笔记编辑器组件
│   │   ├── NoteList.tsx       # 笔记列表组件
│   │   ├── NoteView.tsx       # 笔记预览组件
│   │   ├── Sidebar.tsx        # 侧边栏组件
│   │   └── TagManager.tsx     # 标签管理组件
│   ├── theme\                 # 主题相关
│   │   ├── styled.d.ts        # Styled Components类型声明
│   │   ├── theme.ts           # 主题配置
│   │   └── ThemeContext.tsx   # 主题上下文
│   ├── utils\                 # 工具函数
│   │   └── exportUtils.ts     # 导出功能工具
│   ├── App.tsx                # 应用主组件
│   ├── main.tsx               # 应用入口点
│   ├── types.ts               # 类型定义
│   └── index.css              # 全局样式
├── index.html                 # HTML模板
├── vite.config.ts             # Vite配置文件
├── tsconfig.json              # TypeScript配置文件
├── tsconfig.node.json         # Node TypeScript配置文件
├── .gitignore                 # Git忽略文件
├── package.json               # 项目依赖和脚本
└── README.md                  # 项目说明文档(本文件)
```

## 快速开始

### 前提条件

- Node.js (推荐使用v18或更高版本)
- npm或yarn包管理器

### 安装步骤

1. 克隆仓库或下载源代码

   ```bash
   git clone <仓库地址> mdnote
   cd mdnote
   ```

2. 安装依赖

   ```bash
   npm install
   # 或
   yarn install
   ```

3. 启动开发服务器

   ```bash
   npm run dev
   # 或
   yarn dev
   ```

4. 打开浏览器访问 `http://localhost:3001`

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建完成后，生成的文件将位于`dist`目录中，可以部署到任何静态文件服务器。

## 使用指南

1. **创建笔记**: 点击左侧笔记列表中的"新建"按钮
2. **编辑笔记**: 在中间的编辑区域输入Markdown格式的文本
3. **预览笔记**: 右侧区域会实时显示渲染后的Markdown内容
4. **删除笔记**: 点击笔记条目右下方的"删除"按钮
5. **分类管理**: 点击侧边栏的"分类"图标进行笔记分类管理
6. **标签管理**: 点击侧边栏的"标签"图标管理笔记标签
7. **收藏笔记**: 点击笔记条目右下方的"收藏"按钮，收藏的笔记可在收藏夹中查看
8. **切换主题**: 点击侧边栏底部的主题图标切换明暗主题
9. **导出笔记**: 选中笔记后点击侧边栏的"导出"图标，支持多种格式导出

## Markdown支持

MDNote支持标准的Markdown语法，包括但不限于：

- 标题 (#, ##, ###)
- 强调 (*斜体*, **粗体**)
- 列表 (有序和无序)
- 链接和图片
- 代码块和内联代码
- 表格
- 引用
- 水平分割线
- 数学公式 (KaTeX支持)
- GitHub风格的Markdown扩展 (GFM)

## License

MIT

---

项目由 [Camellia]创建和维护。
