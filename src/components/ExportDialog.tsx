import React from 'react';
import styled from 'styled-components';
import { ExportFormat, Note } from '../types';
import { exportNote } from '../utils/exportUtils';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Dialog = styled.div`
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.foreground};
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  color: ${props => props.theme.foreground};
`;

const FormatList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const FormatOption = styled.div`
  padding: 12px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.noteList.border};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: ${props => props.theme.noteList.activeItem};
  }
  
  &.selected {
    border-color: ${props => props.theme.primary};
    background-color: ${props => `${props.theme.primary}10`};
  }
`;

const FormatIcon = styled.div`
  margin-right: 10px;
  font-size: 20px;
`;

const FormatDetails = styled.div`
  flex: 1;
`;

const FormatName = styled.div`
  font-weight: 500;
`;

const FormatDescription = styled.div`
  font-size: 12px;
  opacity: 0.7;
  margin-top: 3px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  background-color: ${props => props.primary ? props.theme.primary : 'transparent'};
  color: ${props => props.primary ? 'white' : props.theme.foreground};
  border: 1px solid ${props => props.primary ? 'transparent' : props.theme.noteList.border};
  
  &:hover {
    opacity: 0.9;
  }
`;

interface ExportDialogProps {
  note: Note;
  onClose: () => void;
}

// 导出格式的配置
const formatOptions = [
  {
    id: 'markdown',
    name: 'Markdown (.md)',
    description: '导出为标准Markdown文件，保留原始格式',
    icon: '📄'
  },
  {
    id: 'html',
    name: 'HTML (.html)',
    description: '导出为HTML网页，包含基本样式',
    icon: '🌐'
  },
  {
    id: 'txt',
    name: '纯文本 (.txt)',
    description: '导出为纯文本文件，移除所有格式',
    icon: '📝'
  },
  {
    id: 'pdf',
    name: 'PDF文档 (.pdf)',
    description: '导出为PDF文档（开发中）',
    icon: '📑',
    disabled: true
  }
];

const ExportDialog: React.FC<ExportDialogProps> = ({ note, onClose }) => {
  const [selectedFormat, setSelectedFormat] = React.useState<ExportFormat>('markdown');
  
  const handleExport = () => {
    exportNote(note, selectedFormat);
    onClose();
  };
  
  return (
    <Overlay onClick={onClose}>
      <Dialog onClick={e => e.stopPropagation()}>
        <Title>导出「{note.title}」</Title>
        
        <FormatList>
          {formatOptions.map(format => (
            <FormatOption 
              key={format.id}
              className={selectedFormat === format.id ? 'selected' : ''}
              onClick={() => !format.disabled && setSelectedFormat(format.id as ExportFormat)}
              style={{ opacity: format.disabled ? 0.5 : 1, cursor: format.disabled ? 'not-allowed' : 'pointer' }}
            >
              <FormatIcon>{format.icon}</FormatIcon>
              <FormatDetails>
                <FormatName>{format.name}</FormatName>
                <FormatDescription>{format.description}</FormatDescription>
              </FormatDetails>
            </FormatOption>
          ))}
        </FormatList>
        
        <ButtonGroup>
          <Button onClick={onClose}>取消</Button>
          <Button primary onClick={handleExport}>导出</Button>
        </ButtonGroup>
      </Dialog>
    </Overlay>
  );
};

export default ExportDialog;