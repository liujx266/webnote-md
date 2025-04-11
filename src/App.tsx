import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Sidebar from './components/Sidebar.tsx'
import NoteList from './components/NoteList.tsx'
import NoteEditor from './components/NoteEditor.tsx'
import NoteView from './components/NoteView.tsx'
import CategoryManager from './components/CategoryManager.tsx'
import TagManager from './components/TagManager.tsx'
import ExportDialog from './components/ExportDialog.tsx'
import { Note, Category, ExportFormat } from './types.ts'
import { useTheme } from './theme/ThemeContext.tsx'
import { exportNote } from './utils/exportUtils.ts'

// 修改样式使应用铺满整个屏幕
const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  max-width: 100%; // 确保不会超出视口宽度
  color: ${props => props.theme.foreground};
  background-color: ${props => props.theme.background};
  position: fixed; // 固定位置
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden; // 防止滚动条
`

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`

function App() {
  // 状态管理
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<string>('notes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showExportDialog, setShowExportDialog] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('markdown');
  const { theme } = useTheme();

  // 加载保存在localStorage的笔记和上次选择的笔记ID
  useEffect(() => {
    console.log('Loading from localStorage');
    const savedNotes = localStorage.getItem('mdnotes_data');
    const savedCategories = localStorage.getItem('mdnotes_categories');
    const lastSelectedNoteId = localStorage.getItem('mdnotes_lastSelected');
    const lastActiveView = localStorage.getItem('mdnotes_lastActiveView');
    
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        
        // 确保解析的数据是数组
        if (Array.isArray(parsedNotes) && parsedNotes.length > 0) {
          setNotes(parsedNotes);
          
          // 如果有上次选择的笔记ID且该笔记仍存在，则选中它
          if (lastSelectedNoteId && parsedNotes.some((note: Note) => note.id === lastSelectedNoteId)) {
            setSelectedNoteId(lastSelectedNoteId);
          } else {
            // 否则默认选中第一个笔记
            setSelectedNoteId(parsedNotes[0].id);
          }
        }
      } catch (error) {
        console.error('Error parsing notes from localStorage:', error);
      }
    }
    
    if (savedCategories) {
      try {
        const parsedCategories = JSON.parse(savedCategories);
        if (Array.isArray(parsedCategories)) {
          setCategories(parsedCategories);
        }
      } catch (error) {
        console.error('Error parsing categories from localStorage:', error);
      }
    }
    
    if (lastActiveView) {
      setActiveView(lastActiveView);
    }
  }, []);

  // 保存笔记到localStorage
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('mdnotes_data', JSON.stringify(notes));
    } else if (notes.length === 0 && localStorage.getItem('mdnotes_data')) {
      localStorage.removeItem('mdnotes_data');
    }
  }, [notes]);
  
  // 保存分类到localStorage
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('mdnotes_categories', JSON.stringify(categories));
    } else if (categories.length === 0 && localStorage.getItem('mdnotes_categories')) {
      localStorage.removeItem('mdnotes_categories');
    }
  }, [categories]);
  
  // 保存当前选中的笔记ID
  useEffect(() => {
    if (selectedNoteId) {
      localStorage.setItem('mdnotes_lastSelected', selectedNoteId);
    } else {
      localStorage.removeItem('mdnotes_lastSelected');
    }
  }, [selectedNoteId]);
  
  // 保存当前活动视图
  useEffect(() => {
    localStorage.setItem('mdnotes_lastActiveView', activeView);
  }, [activeView]);

  // 创建新笔记
  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '新笔记',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: '', // 添加空分类
      tags: [],    // 添加空标签数组
      favorite: false // 默认非收藏
    };
    
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
    setActiveView('notes'); // 确保在创建后切换到笔记视图
  };

  // 更新笔记
  const updateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map(note => 
      note.id === updatedNote.id 
        ? { ...updatedNote, updatedAt: new Date().toISOString() } 
        : note
    );
    setNotes(updatedNotes);
  };

  // 删除笔记
  const deleteNote = (id: string) => {
    const filteredNotes = notes.filter(note => note.id !== id);
    setNotes(filteredNotes);
    
    if (selectedNoteId === id) {
      setSelectedNoteId(filteredNotes[0]?.id || null);
    }
  };

  // 切换笔记收藏状态
  const toggleFavorite = (id: string) => {
    const updatedNotes = notes.map(note => 
      note.id === id 
        ? { ...note, favorite: !note.favorite, updatedAt: new Date().toISOString() } 
        : note
    );
    setNotes(updatedNotes);
  };
  
  // 搜索笔记
  const searchNotes = (query: string) => {
    setSearchQuery(query);
  };
  
  // 筛选笔记
  const getFilteredNotes = () => {
    let filtered = [...notes];
    
    // 根据搜索关键词筛选
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(lowerQuery) || 
        note.content.toLowerCase().includes(lowerQuery)
      );
    }
    
    // 根据当前视图筛选
    switch (activeView) {
      case 'favorites':
        filtered = filtered.filter(note => note.favorite);
        break;
      case 'categories':
        // 如果在分类管理页面，不需要筛选笔记
        return [];
      case 'tags':
        // 如果在标签管理页面，不需要筛选笔记
        return [];
      default:
        // 默认显示所有笔记
        break;
    }
    
    return filtered;
  };
  
  // 获取所有标签及其使用次数
  const getAllTags = () => {
    const tagCounts: { [key: string]: number } = {};
    
    notes.forEach(note => {
      if (note.tags && Array.isArray(note.tags)) {
        note.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    return Object.entries(tagCounts).map(([name, count]) => ({ name, count }));
  };
  
  // 添加分类
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString()
    };
    setCategories([...categories, newCategory]);
  };
  
  // 更新分类
  const updateCategory = (updatedCategory: Category) => {
    setCategories(categories.map(cat => 
      cat.id === updatedCategory.id ? updatedCategory : cat
    ));
    
    // 同时更新使用该分类的笔记
    const oldCategory = categories.find(cat => cat.id === updatedCategory.id);
    if (oldCategory && oldCategory.name !== updatedCategory.name) {
      const updatedNotes = notes.map(note => 
        note.category === oldCategory.name
          ? { ...note, category: updatedCategory.name }
          : note
      );
      setNotes(updatedNotes);
    }
  };
  
  // 删除分类
  const deleteCategory = (id: string) => {
    const categoryToDelete = categories.find(cat => cat.id === id);
    if (!categoryToDelete) return;
    
    setCategories(categories.filter(cat => cat.id !== id));
    
    // 清除使用该分类的笔记的分类字段
    const updatedNotes = notes.map(note => 
      note.category === categoryToDelete.name
        ? { ...note, category: '' }
        : note
    );
    setNotes(updatedNotes);
  };
  
  // 添加标签
  const addTag = (tag: string) => {
    // 检查标签是否已存在（不区分大小写）
    const allTagNames = getAllTags().map(t => t.name.toLowerCase());
    if (allTagNames.includes(tag.toLowerCase())) {
      alert(`标签 "${tag}" 已存在`);
      return;
    }
    
    // 如果当前有选中的笔记，就将标签添加到该笔记
    if (selectedNote) {
      const updatedNote = {
        ...selectedNote,
        tags: [...(selectedNote.tags || []), tag],
        updatedAt: new Date().toISOString()
      };
      updateNote(updatedNote);
    } else {
      // 如果没有选中的笔记，创建一个带有该标签的新笔记
      const newNote: Note = {
        id: Date.now().toString(),
        title: '包含新标签的笔记',
        content: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: '',
        tags: [tag],
        favorite: false
      };
      setNotes([newNote, ...notes]);
      setSelectedNoteId(newNote.id);
    }
    
    // 保持在标签页
    setActiveView('tags');
  };
  
  // 删除标签
  const deleteTag = (tagToDelete: string) => {
    // 从所有笔记中移除该标签
    const updatedNotes = notes.map(note => {
      if (note.tags && note.tags.includes(tagToDelete)) {
        return {
          ...note,
          tags: note.tags.filter(tag => tag !== tagToDelete),
          updatedAt: new Date().toISOString()
        };
      }
      return note;
    });
    
    setNotes(updatedNotes);
  };
  
  // 处理笔记导出 - 修改为显示导出对话框
  const handleExportNote = () => {
    if (selectedNote) {
      // 显示导出对话框，而不是直接导出
      setShowExportDialog(true);
    } else {
      alert('请先选择要导出的笔记');
    }
  };

  const selectedNote = notes.find(note => note.id === selectedNoteId) || null;
  const filteredNotes = getFilteredNotes();
  const allTags = getAllTags();

  return (
    <AppContainer>
      <Sidebar 
        isEditing={activeView === 'notes'} 
        toggleEditMode={() => {}} // 暂时不使用此功能
        activeView={activeView}
        onChangeView={setActiveView}
        onExportNote={handleExportNote}
      />
      
      {/* 主要内容区域 */}
      <NoteList 
        notes={filteredNotes}
        selectedNoteId={selectedNoteId}
        filter={{ 
          view: activeView 
        }}
        onSelectNote={setSelectedNoteId}
        onCreateNote={createNote}
        onDeleteNote={deleteNote}
        onToggleFavorite={toggleFavorite}
        onSearch={searchNotes}
      />
      
      <MainContent>
        {/* 笔记视图 */}
        {activeView === 'notes' && (
          <>
            {selectedNote ? (
              <>
                <NoteEditor 
                  note={selectedNote}
                  onUpdateNote={updateNote}
                  categories={categories}
                  isVisible={true}
                />
                <NoteView 
                  note={selectedNote} 
                  isVisible={true}
                />
              </>
            ) : (
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                color: theme.foreground,
                opacity: 0.7
              }}>
                <p>请从左侧列表选择一个笔记或创建一个新笔记</p>
              </div>
            )}
          </>
        )}
        
        {/* 分类管理视图 */}
        {activeView === 'categories' && (
          <CategoryManager 
            categories={categories}
            onAddCategory={addCategory}
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
          />
        )}
        
        {/* 标签管理视图 */}
        {activeView === 'tags' && (
          <TagManager 
            tags={allTags}
            onAddTag={addTag}
            onDeleteTag={deleteTag}
          />
        )}
      </MainContent>

      {/* 导出对话框 */}
      {showExportDialog && selectedNote && (
        <ExportDialog 
          note={selectedNote} 
          onClose={() => setShowExportDialog(false)} 
        />
      )}
    </AppContainer>
  )
}

export default App