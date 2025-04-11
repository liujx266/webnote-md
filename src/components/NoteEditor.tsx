import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Note, Category } from '../types';

const EditorContainer = styled.div<{ isVisible: boolean }>`
  display: ${props => props.isVisible ? 'flex' : 'none'};
  flex: 1;
  flex-direction: column;
  padding: 20px;
  background-color: ${props => props.theme.editor.background};
  color: ${props => props.theme.editor.foreground};
  border-right: 1px solid ${props => props.theme.editor.border};
`;

const EditorHeader = styled.div`
  margin-bottom: 20px;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 18px;
  border: 1px solid ${props => props.theme.editor.border};
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.foreground};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const MetaContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid ${props => props.theme.editor.border};
  border-radius: 4px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.foreground};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const TagInput = styled.input`
  padding: 8px;
  border: 1px solid ${props => props.theme.editor.border};
  border-radius: 4px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.foreground};
  flex-grow: 1;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
`;

const Tag = styled.div`
  padding: 4px 8px;
  background-color: ${props => props.theme.primary};
  color: white;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
`;

const TagRemoveButton = styled.button`
  background-color: transparent;
  border: none;
  color: white;
  margin-left: 5px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0 2px;
`;

const ContentTextarea = styled.textarea`
  flex: 1;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid ${props => props.theme.editor.border};
  border-radius: 4px;
  resize: none;
  font-family: 'Courier New', Courier, monospace;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.foreground};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
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