import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../theme/ThemeContext';

const NavbarContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 60px;
  background-color: ${props => props.theme.sidebar.background};
  border-bottom: 1px solid ${props => props.theme.noteList.border};
  flex-shrink: 0;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const NavLink = styled.a<{ isActive: boolean }>`
  padding: 8px 4px;
  color: ${props => props.isActive ? props.theme.sidebar.activeItem : props.theme.sidebar.foreground};
  font-weight: ${props => props.isActive ? 600 : 500};
  text-decoration: none;
  border-bottom: 2px solid ${props => props.isActive ? props.theme.sidebar.activeItem : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.sidebar.activeItem};
  }
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const NewNoteButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    filter: brightness(90%);
  }
`;

const ExportButton = styled.button`
  background-color: transparent;
  color: ${props => props.theme.sidebar.foreground};
  border: 1px solid ${props => props.theme.noteList.border};
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.noteList.activeItem};
    border-color: ${props => props.theme.noteList.activeItem};
  }
`;

const ThemeToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 22px;
  padding: 4px;
  color: ${props => props.theme.sidebar.foreground};
`;

interface TopNavbarProps {
  activeView: string;
  onChangeView: (view: string) => void;
  onNewNote: () => void;
  onExportNote: () => void;
  toggleTheme: () => void;
}

const TopNavbar = ({
  activeView,
  onChangeView,
  onNewNote,
  onExportNote,
  toggleTheme
}: TopNavbarProps) => {
  const { themeMode } = useTheme();

  return (
    <NavbarContainer>
      <NavLinks>
        <NavLink isActive={activeView === 'notes'} onClick={() => onChangeView('notes')}>
          笔记
        </NavLink>
        <NavLink isActive={activeView === 'categories'} onClick={() => onChangeView('categories')}>
          分类
        </NavLink>
        <NavLink isActive={activeView === 'tags'} onClick={() => onChangeView('tags')}>
          标签
        </NavLink>
        <NavLink isActive={activeView === 'favorites'} onClick={() => onChangeView('favorites')}>
          收藏
        </NavLink>
      </NavLinks>
      <Spacer />
      <ActionButtons>
        <ExportButton onClick={onExportNote}>导出</ExportButton>
        <NewNoteButton onClick={onNewNote}>新建笔记</NewNoteButton>
        <ThemeToggleButton onClick={toggleTheme}>
          {themeMode === 'light' ? '🌙' : '☀️'}
        </ThemeToggleButton>
      </ActionButtons>
    </NavbarContainer>
  );
};

export default TopNavbar;