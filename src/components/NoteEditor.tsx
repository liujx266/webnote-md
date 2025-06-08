import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Note, Category } from '../types';

const EditorContainer = styled.div<{ isVisible: boolean }>`
  display: ${props => props.isVisible ? 'flex' : 'none'};
  flex: 1;
  flex-direction: column;
  padding: 24px 32px;
  background-color: ${props => props.theme.editor.background};
  color: ${props => props.theme.editor.foreground};
  border-right: 1px solid ${props => props.theme.editor.border};
  transition: all 0.3s ease;
  overflow-y: auto;
`;

const EditorHeader = styled.div`
  margin-bottom: 16px;
  flex-shrink: 0;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 12px 0;
  font-size: 2em;
  font-weight: 700;
  border: none;
  border-bottom: 1px solid ${props => props.theme.editor.border};
  margin-bottom: 16px;
  background-color: transparent;
  color: ${props => props.theme.foreground};
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const MetaContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: center;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.editor.border};
  border-radius: 6px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.foreground};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}30;
  }
`;

const TagInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.editor.border};
  border-radius: 6px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.foreground};
  flex-grow: 1;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}30;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const Tag = styled.div`
  padding: 4px 10px;
  background-color: ${props => props.theme.noteList.border};
  color: ${props => props.theme.noteList.foreground}90;
  border-radius: 16px;
  font-size: 0.8em;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const TagRemoveButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${props => props.theme.accent};
  margin-left: 6px;
  cursor: pointer;
  font-size: 1.2em;
  line-height: 1;
  padding: 0;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const ContentTextarea = styled.textarea`
  flex: 1;
  width: 100%;
  padding: 16px 0;
  font-size: 1em;
  line-height: 1.7;
  border: none;
  resize: none;
  font-family: inherit;
  background-color: transparent;
  color: ${props => props.theme.foreground};
  
  &:focus {
    outline: none;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => props.theme.foreground};
  opacity: 0.7;
  text-align: center;
`;

interface NoteEditorProps {
  note: Note | null;
  onUpdateNote: (note: Note) => void;
  categories: Category[];
  isVisible?: boolean;
}

const NoteEditor = ({ 
  note, 
  onUpdateNote, 
  categories,
  isVisible = true
}: NoteEditorProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category || '');
      setTags(note.tags || []);
    } else {
      setTitle('');
      setContent('');
      setCategory('');
      setTags([]);
    }
  }, [note]);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    if (note) {
      onUpdateNote({
        ...note,
        title: newTitle
      });
    }
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (note) {
      onUpdateNote({
        ...note,
        content: newContent
      });
    }
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    
    if (note) {
      onUpdateNote({
        ...note,
        category: newCategory
      });
    }
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      
      if (!tags.includes(tagInput.trim())) {
        const newTags = [...tags, tagInput.trim()];
        setTags(newTags);
        setTagInput('');
        
        if (note) {
          onUpdateNote({
            ...note,
            tags: newTags
          });
        }
      }
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    
    if (note) {
      onUpdateNote({
        ...note,
        tags: newTags
      });
    }
  };
  
  if (!note) {
    return (
      <EditorContainer isVisible={isVisible}>
        <EmptyState>
          <h2>没有选中的笔记</h2>
          <p>请从左侧列表选择一个笔记或创建一个新笔记</p>
        </EmptyState>
      </EditorContainer>
    );
  }
  
  return (
    <EditorContainer isVisible={isVisible}>
      <EditorHeader>
        <TitleInput
          type="text"
          placeholder="笔记标题"
          value={title}
          onChange={handleTitleChange}
        />
        
        <MetaContainer>
          <Select value={category} onChange={handleCategoryChange}>
            <option value="">无分类</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </Select>
          
          <TagInput
            type="text"
            placeholder="添加标签 (按回车添加)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
          />
        </MetaContainer>
        
        {tags.length > 0 && (
          <TagsContainer>
            {tags.map((tag, index) => (
              <Tag key={index}>
                {tag}
                <TagRemoveButton onClick={() => handleRemoveTag(tag)}>
                  &times;
                </TagRemoveButton>
              </Tag>
            ))}
          </TagsContainer>
        )}
      </EditorHeader>
      
      <ContentTextarea
        placeholder="在此输入Markdown内容..."
        value={content}
        onChange={handleContentChange}
      />
    </EditorContainer>
  );
};

export default NoteEditor;