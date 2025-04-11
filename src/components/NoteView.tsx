import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Note } from '../types';

const ViewContainer = styled.div<{ isVisible: boolean }>`
  display: ${props => props.isVisible ? 'flex' : 'none'};
  flex: 1;
  flex-direction: column;
  padding: 20px;
  background-color: ${props => props.theme.preview.background};
  color: ${props => props.theme.preview.foreground};
  overflow-y: auto;
`;

const NoteTitle = styled.h1`
  margin: 0 0 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${props => props.theme.preview.border};
  color: ${props => props.theme.preview.foreground};
`;

const NoteMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const NoteCategory = styled.span`
  padding: 4px 8px;
  background-color: ${props => props.theme.primary};
  color: white;
  border-radius: 4px;
  font-size: 12px;
`;

const NoteTag = styled.span`
  padding: 3px 8px;
  background-color: ${props => props.theme.preview.border};
  color: ${props => props.theme.preview.foreground};
  border-radius: 4px;
  font-size: 12px;
`;

const MarkdownContent = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: ${props => props.theme.preview.foreground};
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
    color: ${props => props.theme.preview.foreground};
  }
  
  code {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: ${props => props.theme.preview.codeBackground};
    border-radius: 3px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    color: ${props => props.theme.preview.foreground};
  }
  
  pre {
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: ${props => props.theme.preview.codeBackground};
    border-radius: 3px;
  }
  
  pre > code {
    background-color: transparent;
    padding: 0;
  }
  
  blockquote {
    padding: 0 1em;
    color: ${props => props.theme.preview.blockquoteColor};
    border-left: 0.25em solid ${props => props.theme.preview.border};
    margin-left: 0;
    margin-right: 0;
  }
  
  img {
    max-width: 100%;
  }
  
  a {
    color: ${props => props.theme.preview.linkColor};
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 20px 0;
  }
  
  table th, table td {
    padding: 6px 13px;
    border: 1px solid ${props => props.theme.preview.border};
  }
  
  table tr {
    background-color: ${props => props.theme.preview.background};
    border-top: 1px solid ${props => props.theme.preview.border};
  }
  
  table tr:nth-child(2n) {
    background-color: ${props => props.theme.preview.codeBackground};
  }
  
  hr {
    height: 0.25em;
    padding: 0;
    margin: 24px 0;
    background-color: ${props => props.theme.preview.border};
    border: 0;
  }
  
  .task-list-item {
    list-style-type: none;
  }
  
  .task-list-item input {
    margin: 0 0.2em 0.25em -1.6em;
    vertical-align: middle;
  }
`;

const PreviewHeader = styled.div`
  margin-bottom: 20px;
  font-size: 14px;
  color: ${props => props.theme.preview.foreground};
  opacity: 0.7;
  background-color: ${props => props.theme.preview.codeBackground};
  padding: 8px;
  border-radius: 4px;
  text-align: center;
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
    <ViewContainer isVisible={isVisible}>
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
          rehypePlugins={[rehypeKatex]}
        >
          {note.content}
        </ReactMarkdown>
      </MarkdownContent>
    </ViewContainer>
  );
};

export default NoteView;