import React from 'react';

const ClassSidebar = ({ expandedFolders, onToggleFolder, onNavigate }) => {
  const folders = [
    {
      id: 'home',
      icon: '🏠',
      title: 'Trang chủ',
      content: 'welcome'
    },
    {
      id: 'assignments',
      icon: '📝',
      title: 'Bài tập',
      items: [
        { id: 'assignment-list', label: 'Danh sách bài tập' },
        { id: 'create-assignment', label: 'Tạo bài tập mới' }
      ]
    },
    {
      id: 'announcements',
      icon: '📢',
      title: 'Thông báo',
      items: [
        { id: 'announcement-list', label: 'Danh sách thông báo' },
        { id: 'create-announcement', label: 'Tạo thông báo' }
      ]
    },
    // {
    //   id: 'materials',
    //   icon: '📚',
    //   title: 'Tài liệu',
    //   items: [
    //     { id: 'material-list', label: 'Danh sách tài liệu' },
    //     { id: 'upload-material', label: 'Tải tài liệu lên' }
    //   ]
    // },
    {
      id: 'students',
      icon: '👥',
      title: 'Học sinh',
      content: 'student-list'
    }
  ];

  return (
    <div className="class-sidebar">
      <div className="folder-structure">
        {folders.map(folder => (
          <div key={folder.id} className="folder-item">
            {folder.items ? (
              <>
                <div 
                  className={`folder-title ${expandedFolders.includes(folder.id) ? 'expanded' : ''}`}
                  onClick={() => onToggleFolder(folder.id)}
                >
                  <span className="folder-icon">
                    {expandedFolders.includes(folder.id) ? '📂' : '📁'}
                  </span>
                  <span>{folder.icon} {folder.title}</span>
                  <span className="arrow">
                    {expandedFolders.includes(folder.id) ? '▼' : '▶'}
                  </span>
                </div>
                {expandedFolders.includes(folder.id) && (
                  <div className="folder-children">
                    {folder.items.map(item => (
                      <div 
                        key={item.id}
                        className="file-item"
                        onClick={() => onNavigate(item.id)}
                      >
                        📄 {item.label}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div 
                className="folder-title single"
                onClick={() => onNavigate(folder.content)}
              >
                <span>{folder.icon} {folder.title}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassSidebar;
