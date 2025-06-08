import { Note, ExportFormat } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * 将笔记导出为不同格式的文件
 * @param note 要导出的笔记
 * @param format 导出格式
 */
export const exportNote = (note: Note, format: ExportFormat): void => {
  let content = '';
  let fileType = '';
  let extension = '';
  
  switch (format) {
    case 'markdown':
      content = `# ${note.title}\n\n${note.content}`;
      fileType = 'text/markdown';
      extension = 'md';
      break;
    case 'html':
      content = generateHtmlContent(note);
      fileType = 'text/html';
      extension = 'html';
      break;
    case 'txt':
      content = `${note.title}\n\n${note.content}`;
      fileType = 'text/plain';
      extension = 'txt';
      break;
    default:
      content = `# ${note.title}\n\n${note.content}`;
      fileType = 'text/markdown';
      extension = 'md';
  }
  
  // 创建Blob对象
  const blob = new Blob([content], { type: fileType });
  
  // 创建一个下载链接
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.${extension}`;
  
  // 触发下载
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  // 清理URL对象
  URL.revokeObjectURL(url);
};

/**
 * 将指定的HTML元素导出为PDF文件
 * @param title 文件名
 * @param element 要导出的HTML元素
 */
export const exportNoteAsPdf = async (title: string, element: HTMLElement): Promise<void> => {
  const originalHeight = element.style.height;
  const originalOverflow = element.style.overflowY;

  try {
    // 增加安全边距，确保捕获所有内容
    const scrollHeight = element.scrollHeight;
    const heightWithPadding = scrollHeight + 200;

    // 暂时修改样式以捕获完整内容
    element.style.height = `${heightWithPadding}px`;
    element.style.overflowY = 'visible';

    const canvas = await html2canvas(element, {
      scale: 2, // 提高分辨率
      useCORS: true, // 允许加载跨域图片
      backgroundColor: window.getComputedStyle(document.body).backgroundColor, // 使用当前主题背景色
      windowHeight: heightWithPadding,
      scrollY: -window.scrollY,
    });

    // 恢复原始样式
    element.style.height = originalHeight;
    element.style.overflowY = originalOverflow;

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);

  } catch (error) {
    console.error('导出PDF时出错:', error);
    alert('导出PDF失败，请查看控制台获取更多信息。');
  } finally {
    // 确保在任何情况下都恢复原始样式
    element.style.height = originalHeight;
    element.style.overflowY = originalOverflow;
  }
};

/**
 * 生成HTML内容
 * @param note 笔记对象
 */
const generateHtmlContent = (note: Note): string => {
  // 这里简单实现，实际应用中可以使用更复杂的HTML模板
  const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${note.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
      color: #333;
    }
    h1 {
      border-bottom: 1px solid #eaecef;
      padding-bottom: 0.3em;
    }
    code {
      background-color: rgba(27, 31, 35, 0.05);
      border-radius: 3px;
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      padding: 0.2em 0.4em;
    }
    pre {
      background-color: #f6f8fa;
      border-radius: 3px;
      padding: 16px;
      overflow: auto;
    }
    blockquote {
      border-left: 0.25em solid #dfe2e5;
      color: #6a737d;
      padding: 0 1em;
      margin-left: 0;
    }
    img {
      max-width: 100%;
    }
    .meta {
      color: #6a737d;
      font-size: 0.9em;
      margin-bottom: 1em;
    }
    .tag, .category {
      display: inline-block;
      padding: 0.2em 0.6em;
      margin-right: 0.5em;
      border-radius: 3px;
      font-size: 0.8em;
    }
    .tag {
      background-color: #f1f8ff;
      color: #0366d6;
    }
    .category {
      background-color: #f0fff4;
      color: #22863a;
    }
  </style>
</head>
<body>
  <h1>${note.title}</h1>
  <div class="meta">
    ${note.category ? `<span class="category">${note.category}</span>` : ''}
    ${note.tags && note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
    <br>
    创建时间: ${new Date(note.createdAt).toLocaleString()}
    <br>
    更新时间: ${new Date(note.updatedAt).toLocaleString()}
  </div>
  <div class="content">
    ${convertMarkdownToHtml(note.content)}
  </div>
</body>
</html>
  `;
  
  return htmlContent;
};

/**
 * 简单的Markdown到HTML转换
 * 注意：这只是一个非常简单的实现，实际应用中应该使用成熟的库
 */
const convertMarkdownToHtml = (markdown: string): string => {
  // 仅作为示例，实际应用应使用如marked.js这样的库
  let html = markdown
    // 标题
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    // 粗体和斜体
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // 链接
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    // 列表
    .replace(/^\s*\*\s(.*)$/gm, '<li>$1</li>')
    // 代码块
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // 行内代码
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // 换行
    .replace(/\n/g, '<br>');
  
  return html;
};