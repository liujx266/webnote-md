import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  width: 100%;
  color: ${props => props.theme.foreground};
  background-color: ${props => props.theme.background};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0;
  color: ${props => props.theme.foreground};
`;

const Button = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    filter: brightness(90%);
  }
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
`;

const Tag = styled.div`
  padding: 6px 12px;
  border-radius: 4px;
  background-color: ${props => props.theme.noteList.border};
  color: ${props => props.theme.foreground};
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 100px;
`;

const TagName = styled.span`
  flex-grow: 1;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.accent};
  cursor: pointer;
  padding: 0 5px;
  font-size: 16px;
  
  &:hover {
    opacity: 0.8;
  }
`;

const TagCount = styled.span`
  background-color: ${props => props.theme.primary};
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 12px;
  margin-left: 5px;
`;

const FormContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: ${props => props.theme.noteList.background};
  border-radius: 4px;
  border: 1px solid ${props => props.theme.noteList.border};
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid ${props => props.theme.noteList.border};
  border-radius: 4px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.foreground};
  margin-bottom: 10px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 0;
  color: ${props => props.theme.foreground};
  opacity: 0.7;
`;

interface TagManagerProps {
  tags: { name: string; count: number }[];
  onAddTag: (tag: string) => void;
  onDeleteTag: (tag: string) => void;
}

const TagManager: React.FC<TagManagerProps> = ({
  tags,
  onAddTag,
  onDeleteTag
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const handleAddClick = () => {
    setIsAdding(true);
    setNewTagName('');
  };

  const handleSubmit = () => {
    if (newTagName.trim()) {
      onAddTag(newTagName.trim());
      setNewTagName('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
  };

  return (
    <Container>
      <Header>
        <Title>标签管理</Title>
        <Button onClick={handleAddClick}>添加标签</Button>
      </Header>

      {isAdding && (
        <FormContainer>
          <Input
            type="text"
            placeholder="输入新标签名称..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
          />
          <ButtonGroup>
            <Button onClick={handleSubmit}>保存</Button>
            <Button onClick={handleCancel} style={{ backgroundColor: '#7f8c8d' }}>
              取消
            </Button>
          </ButtonGroup>
        </FormContainer>
      )}

      {tags.length === 0 ? (
        <EmptyState>
          没有标签，点击"添加标签"创建一个
        </EmptyState>
      ) : (
        <TagList>
          {tags.map((tag) => (
            <Tag key={tag.name}>
              <TagName>{tag.name}</TagName>
              <TagCount>{tag.count}</TagCount>
              <DeleteButton onClick={() => onDeleteTag(tag.name)}>
                &times;
              </DeleteButton>
            </Tag>
          ))}
        </TagList>
      )}
    </Container>
  );
};

export default TagManager;