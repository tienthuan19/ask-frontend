import React from 'react';
import {
  WelcomeScreen,
  AssignmentList,
  CreateAssignment,
  StudentList,
  AnnouncementList,
  CreateAnnouncement,
  MaterialList,
  UploadMaterial
} from '../components/index.js';

const ClassContent = ({ 
  activeContent,
  selectedClass,
  showCreateAssignment,
  showCreateAnnouncement,
  showUploadMaterial,
  assignmentFormData,
  currentQuestion,
  announcements,
  materials,
  onNavigate,
  onDeleteAssignment,
  onExtendDeadline,
  onUpdateAssignmentField,
  onUpdateQuestion,
  onAddQuestion,
  onRemoveQuestion,
  onCreateAssignment,
  onCancelAssignment,
  onRemoveStudent,
  onSaveAnnouncement,
  onDeleteAnnouncement,
  onEditAnnouncement,
  onCancelAnnouncement,
  onSaveMaterial,
  onDeleteMaterial,
  onDownloadMaterial,
  onCancelMaterial
}) => {
  const renderContent = () => {
    // Nếu đang tạo bài tập mới, hiển thị form
    if (activeContent === 'create-assignment' || showCreateAssignment) {
      return (
        <CreateAssignment
          show={true}
          formData={assignmentFormData}
          currentQuestion={currentQuestion}
          onUpdateField={onUpdateAssignmentField}
          onUpdateQuestion={onUpdateQuestion}
          onAddQuestion={onAddQuestion}
          onRemoveQuestion={onRemoveQuestion}
          onCreate={onCreateAssignment}
          onCancel={onCancelAssignment}
        />
      );
    }

    // Nếu đang tạo thông báo mới
    if (activeContent === 'create-announcement' || showCreateAnnouncement) {
      return (
        <CreateAnnouncement
          onSave={onSaveAnnouncement}
          onCancel={onCancelAnnouncement}
        />
      );
    }

    // Nếu đang tải tài liệu lên
    if (activeContent === 'upload-material' || showUploadMaterial) {
      return (
        <UploadMaterial
          onSave={onSaveMaterial}
          onCancel={onCancelMaterial}
        />
      );
    }

    switch (activeContent) {
      case 'welcome':
        return (
          <WelcomeScreen 
            selectedClass={selectedClass}
            onNavigate={onNavigate}
          />
        );

      case 'assignment-list':
        return (
          <AssignmentList
            assignments={selectedClass.assignments}
            onDelete={onDeleteAssignment}
            onExtend={onExtendDeadline}
          />
        );

      case 'student-list':
        return (
          <StudentList
            students={selectedClass.students}
            onRemove={onRemoveStudent}
          />
        );

      case 'announcement-list':
        return (
          <AnnouncementList
            announcements={announcements}
            onDelete={onDeleteAnnouncement}
            onEdit={onEditAnnouncement}
          />
        );

      case 'material-list':
        return (
          <MaterialList
            materials={materials}
            onDelete={onDeleteMaterial}
            onDownload={onDownloadMaterial}
          />
        );

      default:
        return (
          <div className="content-panel">
            <h3>⚠️ Nội dung đang phát triển</h3>
            <p>Chức năng này đang được phát triển...</p>
          </div>
        );
    }
  };

  return (
    <div className="class-content">
      {renderContent()}
    </div>
  );
};

export default ClassContent;
