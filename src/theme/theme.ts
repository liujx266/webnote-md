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
  primary: '#4A90E2', // A gentle, modern blue
  accent: '#F5A623', // A soft, friendly orange for accents
  background: '#FFFFFF', // Pure white background
  foreground: '#333333', // Dark grey for text, not pure black
  sidebar: { // This will be repurposed for the new top navigation
    background: '#FFFFFF',
    foreground: '#555555',
    activeItem: '#4A90E2',
  },
  noteList: {
    background: '#F9F9F9', // Very light grey for the list area
    foreground: '#333333',
    border: '#EAEAEA', // Soft border color
    activeItem: '#E8F1FC', // A very light blue for active selection
  },
  editor: {
    background: '#FFFFFF',
    foreground: '#333333',
    border: '#EAEAEA',
  },
  preview: {
    background: '#FFFFFF',
    foreground: '#333333',
    border: '#EAEAEA',
    codeBackground: '#F7F7F7',
    blockquoteColor: '#777777',
    linkColor: '#4A90E2',
  },
};

const darkTheme: Theme = {
  primary: '#5E9BEF', // A slightly brighter blue for dark mode
  accent: '#F7B556', // A soft orange for dark mode accents
  background: '#1A1A1A', // A very dark grey, not pure black
  foreground: '#E0E0E0', // Light grey for text
  sidebar: { // This will be repurposed for the new top navigation
    background: '#212121',
    foreground: '#CCCCCC',
    activeItem: '#5E9BEF',
  },
  noteList: {
    background: '#212121',
    foreground: '#E0E0E0',
    border: '#333333',
    activeItem: '#2C3A4B', // A subtle dark blue for selection
  },
  editor: {
    background: '#1A1A1A',
    foreground: '#E0E0E0',
    border: '#333333',
  },
  preview: {
    background: '#1A1A1A',
    foreground: '#E0E0E0',
    border: '#333333',
    codeBackground: '#252525',
    blockquoteColor: '#AAAAAA',
    linkColor: '#5E9BEF',
  },
};

export const getTheme = (mode: ThemeMode): Theme => {
  return mode === 'light' ? lightTheme : darkTheme;
};