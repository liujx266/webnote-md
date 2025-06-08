import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import { Note } from '../types';

const ViewContainer = styled.div<{ isVisible: boolean }>`
  display: ${props => props.isVisible ? 'flex' : 'none'};
  flex: 1;
  flex-direction: column;
  padding: 24px 40px;
  background-color: ${props => props.theme.preview.background};
  color: ${props => props.theme.preview.foreground};
  overflow-y: auto;
  transition: all 0.3s ease;
`;

const NoteTitle = styled.h1`
  margin: 0 0 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.preview.border};
  color: ${props => props.theme.preview.foreground};
  font-size: 2.2em;
  font-weight: 700;
`;

const NoteMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 24px;
`;

const NoteCategory = styled.span`
  padding: 4px 12px;
  background-color: ${props => props.theme.primary}20;
  color: ${props => props.theme.primary};
  border-radius: 16px;
  font-size: 0.8em;
  font-weight: 500;
`;

const NoteTag = styled.span`
  padding: 4px 10px;
  background-color: ${props => props.theme.accent}20;
  color: ${props => props.theme.accent};
  border-radius: 16px;
  font-size: 0.8em;
  font-weight: 500;
`;

const MarkdownContent = styled.div`
  font-size: 1em;
  line-height: 1.8;
  color: ${props => props.theme.preview.foreground};
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 1em;
    font-weight: 600;
    line-height: 1.3;
    color: ${props => props.theme.preview.foreground};
    border-bottom: 1px solid ${props => props.theme.preview.border};
    padding-bottom: 0.3em;
  }
  h1 { font-size: 2em; }
  h2 { font-size: 1.5em; }
  h3 { font-size: 1.25em; }

  p {
    margin-bottom: 1em;
  }
  
  code {
    padding: 0.2em 0.4em;
    margin: 0 2px;
    font-size: 85%;
    background-color: ${props => props.theme.preview.codeBackground};
    border-radius: 6px;
    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
    color: ${props => props.theme.preview.foreground};
  }
  
  pre {
    padding: 1em;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: ${props => props.theme.preview.codeBackground};
    border-radius: 8px;
    margin: 1.5em 0;
  }
  
  pre > code {
    background-color: transparent;
    padding: 0;
    margin: 0;
    font-size: 100%;
  }
  
  blockquote {
    padding: 0.5em 1.2em;
    color: ${props => props.theme.preview.blockquoteColor};
    border-left: 0.3em solid ${props => props.theme.primary};
    margin: 1.5em 0;
    background-color: ${props => props.theme.preview.codeBackground};
    border-radius: 0 8px 8px 0;
  }
  
  img {
    max-width: 100%;
    border-radius: 8px;
  }
  
  a {
    color: ${props => props.theme.preview.linkColor};
    text-decoration: none;
    font-weight: 500;
    border-bottom: 1px solid transparent;
    transition: all 0.2s ease;
  }
  
  a:hover {
    border-bottom-color: ${props => props.theme.preview.linkColor};
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 2em 0;
  }
  
  table th, table td {
    padding: 10px 15px;
    border: 1px solid ${props => props.theme.preview.border};
  }
  
  table th {
    background-color: ${props => props.theme.preview.codeBackground};
    font-weight: 600;
  }
  
  table tr:nth-child(2n) {
    background-color: ${props => props.theme.preview.codeBackground}80;
  }
  
  hr {
    height: 4px;
    padding: 0;
    margin: 2em 0;
    background-color: ${props => props.theme.preview.border};
    border: 0;
    border-radius: 2px;
  }
  
  ul, ol {
    padding-left: 2em;
  }

  .task-list-item {
    list-style-type: none;
  }
  
  .task-list-item input {
    margin: 0 0.5em 0.25em -2em;
    vertical-align: middle;
  }
`;

const PreviewHeader = styled.div`
  display: none; /* We can hide this for a cleaner look */
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => props.theme.preview.foreground};
  opacity: 0.7;
  text-align: center;
`;

interface NoteViewProps {
  note: Note | null;
  isVisible?: boolean;
}

const NoteView = ({ note, isVisible = true }: NoteViewProps) => {
  if (!note) {
    return (
      <ViewContainer isVisible={isVisible}>
        <EmptyState>
          <h2>没有选中的笔记</h2>
          <p>请从左侧列表选择一个笔记查看</p>
        </EmptyState>
      </ViewContainer>
    );
  }
  
  return (
    <ViewContainer isVisible={isVisible} id="note-view-content">
      <PreviewHeader>预览</PreviewHeader>
      <NoteTitle>{note.title}</NoteTitle>
      
      <NoteMeta>
        {note.category && (
          <NoteCategory>{note.category}</NoteCategory>
        )}
        
        {note.tags && note.tags.map((tag, index) => (
          <NoteTag key={index}>{tag}</NoteTag>
        ))}
      </NoteMeta>
      
      <MarkdownContent>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm, remarkMath]} 
          rehypePlugins={[rehypeRaw, rehypeKatex]}
        >
          {note.content}
        </ReactMarkdown>
      </MarkdownContent>
    </ViewContainer>
  );
};

export default NoteView;

