import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../theme/ThemeContext';

const SidebarContainer = styled.div`
  width: 60px;
  background-color: ${props => props.theme.sidebar.background};
  color: ${props => props.theme.sidebar.foreground};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
`;

const SidebarButton = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 0;
  width: 100%;
  color: ${props => props.isActive ? props.theme.sidebar.activeItem : props.theme.sidebar.foreground};
  background-color: ${props => props.isActive ? 'rgba(52, 152, 219, 0.1)' : 'transparent'};
  cursor: pointer;
  text-decoration: none;
  font-size: 12px;
  
  &:hover {
    background-color: rgba(52, 152, 219, 0.1);
  }
`;

const Icon = styled.div`
  font-size: 24px;
  margin-bottom: 5px;
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

interface SidebarProps {
  isEditing: boolean;
  toggleEditMode: () => void;
  activeView: string;
  onChangeView: (view: string) => void;
  onExportNote: () => void;
}

const Sidebar = ({
  isEditing,
  toggleEditMode,
  activeView,
  onChangeView,
  onExportNote
}: SidebarProps) => {
  const { themeMode, toggleTheme } = useTheme();

  return (
    <SidebarContainer>
      <SidebarButton 
        isActive={activeView === 'notes'} 
        onClick={() => onChangeView('notes')}
      >
        <Icon>📝</Icon>
        笔记
      </SidebarButton>
      
      <SidebarButton 
        isActive={activeView === 'categories'} 
        onClick={() => onChangeView('categories')}
      >
        <Icon>📂</Icon>
        分类
      </SidebarButton>
      
      <SidebarButton 
        isActive={activeView === 'tags'} 
        onClick={() => onChangeView('tags')}
      >
        <Icon>🏷️</Icon>
        标签
      </SidebarButton>
      
      <SidebarButton 
        isActive={activeView === 'favorites'} 
        onClick={() => onChangeView('favorites')}
      >
        <Icon>⭐</Icon>
        收藏
      </SidebarButton>

      <Spacer />

      <SidebarButton 
        isActive={false} 
        onClick={onExportNote}
      >
        <Icon>📤</Icon>
        导出
      </SidebarButton>
      
      <SidebarButton 
        isActive={false} 
        onClick={toggleTheme}
      >
        <Icon>{themeMode === 'light' ? '🌙' : '☀️'}</Icon>
        主题
      </SidebarButton>
    </SidebarContainer>
  );
};

export default Sidebar;