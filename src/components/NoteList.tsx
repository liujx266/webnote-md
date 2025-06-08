import React from 'react';
import styled from 'styled-components';
import { Note } from '../types';

const NoteListContainer = styled.div`
  width: 300px;
  background-color: ${props => props.theme.noteList.background};
  border-right: 1px solid ${props => props.theme.noteList.border};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex-shrink: 0;
  transition: all 0.3s ease;
`;

const NoteListHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.noteList.border};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const NoteListTitle = styled.h2`
  margin: 0;
  font-size: 1.2em;
  color: ${props => props.theme.noteList.foreground};
  font-weight: 600;
`;


const SearchContainer = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme.noteList.border};
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${props => props.theme.noteList.border};
  border-radius: 6px;
  background-color: ${props => props.theme.editor.background};
  color: ${props => props.theme.foreground};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}30;
  }
`;

const NoteItem = styled.div<{ isActive: boolean }>`
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid ${props => props.theme.noteList.border};
  background-color: ${props => props.isActive ? props.theme.noteList.activeItem : 'transparent'};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.noteList.activeItem};
  }
`;

const NoteTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1em;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => props.theme.noteList.foreground};
  display: flex;
  align-items: center;
`;

const NoteDate = styled.div`
  font-size: 0.75em;
  color: ${props => props.theme.noteList.foreground};
  opacity: 0.6;
`;

const NoteMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 0.75em;
`;

const NoteCategory = styled.span`
  padding: 3px 8px;
  border-radius: 12px;
  background-color: ${props => props.color || props.theme.primary}20;
  color: ${props => props.color || props.theme.primary};
  font-size: 0.7em;
  font-weight: 500;
`;

const NoteTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
`;

const NoteTag = styled.span`
  padding: 2px 6px;
  border-radius: 4px;
  background-color: ${props => props.theme.noteList.border};
  color: ${props => props.theme.noteList.foreground}90;
  font-size: 0.7em;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${NoteItem}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background-color: transparent;
  color: ${props => props.theme.noteList.foreground}90;
  border: none;
  padding: 4px;
  border-radius: 4px;
  font-size: 0.8em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    color: ${props => props.theme.noteList.foreground};
    background-color: ${props => props.theme.noteList.border};
  }
  
  &.delete:hover {
    color: ${props => props.theme.accent};
  }
  
  &.favorite {
    color: ${props => props.color || 'inherit'};
  }
`;

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  filter?: {
    category?: string;
    tag?: string;
    view?: string; 
  };
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onSearch: (query: string) => void;
}

const NoteList = ({
  notes, 
  selectedNoteId, 
  filter = {},
  onSelectNote, 
  onCreateNote, 
  onDeleteNote,
  onToggleFavorite,
  onSearch
}: NoteListProps) => {
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  };

  // 获取当前视图的标题
  const getViewTitle = () => {
    if (filter.category) return `分类: ${filter.category}`;
    if (filter.tag) return `标签: ${filter.tag}`;
    if (filter.view === 'favorites') return '收藏笔记';
    return '全部笔记';
  };

  return (
    <NoteListContainer>
      <NoteListHeader>
        <NoteListTitle>{getViewTitle()}</NoteListTitle>
      </NoteListHeader>
      
      <SearchContainer>
        <SearchInput 
          type="text" 
          placeholder="搜索笔记..." 
          onChange={(e) => onSearch(e.target.value)} 
        />
      </SearchContainer>
      
      {notes.length === 0 ? (
        <div style={{ padding: '15px', textAlign: 'center', color: 'inherit', opacity: 0.7 }}>
          没有笔记，点击"新建"创建一篇
        </div>
      ) : (
        notes.map(note => (
          <NoteItem 
            key={note.id} 
            isActive={selectedNoteId === note.id}
            onClick={() => onSelectNote(note.id)}
          >
            <NoteTitle>
              {note.favorite && <span style={{ marginRight: '5px' }}>⭐</span>}
              {note.title}
            </NoteTitle>
            
            <NoteDate>最后更新: {formatDate(note.updatedAt)}</NoteDate>
            
            <NoteMeta>
              {note.category && (
                <NoteCategory>{note.category}</NoteCategory>
              )}
            </NoteMeta>
            
            {note.tags && note.tags.length > 0 && (
              <NoteTags>
                {note.tags.map((tag, index) => (
                  <NoteTag key={index}>{tag}</NoteTag>
                ))}
              </NoteTags>
            )}
            
            <ActionButtons>
              <ActionButton 
                className="favorite"
                color={note.favorite ? 'gold' : undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(note.id);
                }}
              >
                {note.favorite ? '取消收藏' : '收藏'}
              </ActionButton>
              
              <ActionButton 
                className="delete" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
              >
                删除
              </ActionButton>
            </ActionButtons>
          </NoteItem>
        ))
      )}
    </NoteListContainer>
  );
};

export default NoteList;