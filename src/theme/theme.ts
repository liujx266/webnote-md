export type ThemeMode = 'light' | 'dark';

export interface Theme {
  primary: string;
  accent: string;
  background: string;
  foreground: string;
  sidebar: {
    background: string;
    foreground: string;
    activeItem: string;
  };
  noteList: {
    background: string;
    foreground: string;
    border: string;
    activeItem: string;
  };
  editor: {
    background: string;
    foreground: string;
    border: string;
  };
  preview: {
    background: string;
    foreground: string;
    border: string;
    codeBackground: string;
    blockquoteColor: string;
    linkColor: string;
  };
}

const lightTheme: Theme = {
  primary: '#3498db',
  accent: '#e74c3c',
  background: '#ffffff',
  foreground: '#333333',
  sidebar: {
    background: '#2c3e50',
    foreground: '#ecf0f1',
    activeItem: '#3498db',
  },
  noteList: {
    background: '#f5f5f5',
    foreground: '#333333',
    border: '#e0e0e0',
    activeItem: 'rgba(52, 152, 219, 0.1)',
  },
  editor: {
    background: '#ffffff',
    foreground: '#333333',
    border: '#e0e0e0',
  },
  preview: {
    background: '#ffffff',
    foreground: '#333333',
    border: '#e0e0e0',
    codeBackground: '#f6f8fa',
    blockquoteColor: '#6a737d',
    linkColor: '#0366d6',
  },
};

const darkTheme: Theme = {
  primary: '#3498db',
  accent: '#e74c3c',
  background: '#1e1e1e',
  foreground: '#d4d4d4',
  sidebar: {
    background: '#252526',
    foreground: '#d4d4d4',
    activeItem: '#3498db',
  },
  noteList: {
    background: '#252526',
    foreground: '#d4d4d4',
    border: '#3c3c3c',
    activeItem: 'rgba(52, 152, 219, 0.2)',
  },
  editor: {
    background: '#1e1e1e',
    foreground: '#d4d4d4',
    border: '#3c3c3c',
  },
  preview: {
    background: '#1e1e1e',
    foreground: '#d4d4d4',
    border: '#3c3c3c',
    codeBackground: '#2d2d2d',
    blockquoteColor: '#9e9e9e',
    linkColor: '#6cb6ff',
  },
};

export const getTheme = (mode: ThemeMode): Theme => {
  return mode === 'light' ? lightTheme : darkTheme;
};