import React from 'react';
import styled from 'styled-components';
import { Note } from '../types';

const NoteListContainer = styled.div`
  width: 250px;
  background-color: ${props => props.theme.noteList.background};
  border-right: 1px solid ${props => props.theme.noteList.border};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const NoteListHeader = styled.div`
  padding: 15px;
  border-bottom: 1px solid ${props => props.theme.noteList.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NoteListTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  color: ${props => props.theme.noteList.foreground};
`;

const NewNoteButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    filter: brightness(90%);
  }
`;

const SearchContainer = styled.div`
  padding: 10px 15px;
  border-bottom: 1px solid ${props => props.theme.noteList.border};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid ${props => props.theme.noteList.border};
  border-radius: 4px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.foreground};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const NoteItem = styled.div<{ isActive: boolean }>`
  padding: 15px;
  cursor: pointer;
  border-bottom: 1px solid ${props => props.theme.noteList.border};
  background-color: ${props => props.isActive 
    ? props.theme.noteList.activeItem 
    : 'transparent'};
  
  &:hover {
    background-color: ${props => props.isActive 
      ? props.theme.noteList.activeItem 
      : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const NoteTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => props.theme.noteList.foreground};
  display: flex;
  align-items: center;
`;

const NoteDate = styled.div`
  font-size: 12px;
  color: ${props => props.theme.noteList.foreground};
  opacity: 0.7;
`;

const NoteMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 12px;
  color: ${props => props.theme.noteList.foreground};
  opacity: 0.7;
`;

const NoteCategory = styled.span`
  padding: 2px 5px;
  border-radius: 3px;
  background-color: ${props => props.color || props.theme.primary};
  color: white;
  font-size: 10px;
  margin-right: 5px;
`;

const NoteTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
`;

const NoteTag = styled.span`
  padding: 1px 5px;
  border-radius: 3px;
  background-color: ${props => props.theme.noteList.border};
  color: ${props => props.theme.noteList.foreground};
  font-size: 10px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 5px;
`;

const ActionButton = styled.button`
  background-color: transparent;
  color: ${props => props.theme.noteList.foreground};
  border: 1px solid ${props => props.theme.noteList.border};
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 10px;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &.delete {
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
        <NewNoteButton onClick={onCreateNote}>新建</NewNoteButton>
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