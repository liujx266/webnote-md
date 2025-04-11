export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  category: string; // 添加分类
  tags: string[]; // 添加标签数组
  favorite: boolean; // 添加收藏功能
}

export interface SidebarItem {
  id: string;
  name: string;
  icon?: string;
  route: string;
}

// 添加分类类型
export interface Category {
  id: string;
  name: string;
  color: string;
}

// 为导出功能添加的格式类型
export type ExportFormat = 'markdown' | 'html' | 'pdf' | 'txt';