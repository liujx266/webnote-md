import React, { useState } from 'react';
import styled from 'styled-components';
import { Category } from '../types';

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

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: ${props => props.theme.noteList.background};
  border-radius: 4px;
  border: 1px solid ${props => props.theme.noteList.border};
`;

const CategoryName = styled.div`
  flex-grow: 1;
  color: ${props => props.theme.foreground};
`;

const CategoryColor = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 10px;
`;

const ActionButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${props => props.theme.foreground};
  cursor: pointer;
  padding: 5px;
  margin-left: 5px;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
  
  &.delete {
    color: ${props => props.theme.accent};
  }
`;

const FormContainer = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background-color: ${props => props.theme.noteList.background};
  border-radius: 4px;
  border: 1px solid ${props => props.theme.noteList.border};
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: ${props => props.theme.foreground};
`;

const Input = styled.input`
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory
}) => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3498db');

  const handleAddClick = () => {
    setIsAddingCategory(true);
    setNewCategoryName('');
    setNewCategoryColor('#3498db');
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryColor(category.color);
    setIsAddingCategory(false);
  };

  const handleSubmitAdd = () => {
    if (newCategoryName.trim()) {
      onAddCategory({
        name: newCategoryName.trim(),
        color: newCategoryColor
      });
      setIsAddingCategory(false);
    }
  };

  const handleSubmitEdit = () => {
    if (editingCategory && newCategoryName.trim()) {
      onUpdateCategory({
        ...editingCategory,
        name: newCategoryName.trim(),
        color: newCategoryColor
      });
      setEditingCategory(null);
    }
  };

  const handleCancel = () => {
    setIsAddingCategory(false);
    setEditingCategory(null);
  };

  return (
    <Container>
      <Header>
        <Title>分类管理</Title>
        <Button onClick={handleAddClick}>添加分类</Button>
      </Header>

      {isAddingCategory && (
        <FormContainer>
          <FormGroup>
            <Label>分类名称</Label>
            <Input
              type="text"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              placeholder="输入分类名称..."
            />
          </FormGroup>
          <FormGroup>
            <Label>分类颜色</Label>
            <Input
              type="color"
              value={newCategoryColor}
              onChange={e => setNewCategoryColor(e.target.value)}
            />
          </FormGroup>
          <ButtonGroup>
            <Button onClick={handleSubmitAdd}>保存</Button>
            <Button onClick={handleCancel} style={{ backgroundColor: '#7f8c8d' }}>
              取消
            </Button>
          </ButtonGroup>
        </FormContainer>
      )}

      {editingCategory && (
        <FormContainer>
          <FormGroup>
            <Label>分类名称</Label>
            <Input
              type="text"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>分类颜色</Label>
            <Input
              type="color"
              value={newCategoryColor}
              onChange={e => setNewCategoryColor(e.target.value)}
            />
          </FormGroup>
          <ButtonGroup>
            <Button onClick={handleSubmitEdit}>更新</Button>
            <Button onClick={handleCancel} style={{ backgroundColor: '#7f8c8d' }}>
              取消
            </Button>
          </ButtonGroup>
        </FormContainer>
      )}

      <CategoryList>
        {categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'inherit', opacity: 0.7 }}>
            没有分类，点击"添加分类"创建一个
          </div>
        ) : (
          categories.map(category => (
            <CategoryItem key={category.id}>
              <CategoryColor color={category.color} />
              <CategoryName>{category.name}</CategoryName>
              <ActionButton onClick={() => handleEditClick(category)}>
                ✏️
              </ActionButton>
              <ActionButton
                className="delete"
                onClick={() => onDeleteCategory(category.id)}
              >
                🗑️
              </ActionButton>
            </CategoryItem>
          ))
        )}
      </CategoryList>
    </Container>
  );
};

export default CategoryManager;