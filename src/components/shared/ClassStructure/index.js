import React, {useState, useCallback, useEffect} from 'react';
import useClassNavigation from '../../../hooks/useClassNavigation.js';
import useAssignmentForm from '../../../hooks/useAssignmentForm.js';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { getClassAnnouncementsAPI,
  createClassAnnouncementAPI,
  getClassAssignmentsAPI,
  createClassAssignmentAPI,
  getClassMembersAPI // <--- Import thêm hàm này
} from '../../../services/classManagerService.js';
import { ClassHeader, ClassSidebar, ClassContent } from './layout/index.js';
import '../../../styles/components/class-structure.css';

const ClassStructure = ({ selectedClass, onBack, onUpdateClass, userRole }) => {
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [showUploadMaterial, setShowUploadMaterial] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [activeContent, setActiveContent] = useState('welcome');
  const [announcements, setAnnouncements] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);

  const fetchAnnouncements = useCallback(async () => {
    if (selectedClass && selectedClass.id) {
      try {
        const data = await getClassAnnouncementsAPI(selectedClass.id);
        setAnnouncements(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      }
    }
  }, [selectedClass]);
  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);
  // Assignment form state
  const fetchAssignments = useCallback(async () => {
    if (selectedClass && selectedClass.id) {
      try {
        const data = await getClassAssignmentsAPI(selectedClass.id);
        setAssignments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
      }
    }
  }, [selectedClass]);

  useEffect(() => {
    fetchAnnouncements();
    fetchAssignments(); // <--- Gọi thêm hàm này
  }, [fetchAnnouncements, fetchAssignments]);

  const [assignmentFormData, setAssignmentFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    duration: '',
    maxScore: 100,
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    content: '',
    score: 10,
    modelAnswer: ''
  });

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const navigate = (content) => {
    setActiveContent(content);
    if (content === 'create-assignment') {
      setShowCreateAssignment(true);
      setShowCreateAnnouncement(false);
      setShowUploadMaterial(false);
    } else if (content === 'create-announcement') {
      setShowCreateAnnouncement(true);
      setShowCreateAssignment(false);
      setShowUploadMaterial(false);
    } else if (content === 'upload-material') {
      setShowUploadMaterial(true);
      setShowCreateAssignment(false);
      setShowCreateAnnouncement(false);
    } else {
      setShowCreateAssignment(false);
      setShowCreateAnnouncement(false);
      setShowUploadMaterial(false);
    }
  };

  const updateAssignmentField = (field, value) => {
    setAssignmentFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateQuestion = (field, value) => {
    setCurrentQuestion(prev => ({ ...prev, [field]: value }));
  };

  const addQuestion = () => {
    if (currentQuestion.content && currentQuestion.content.trim()) {
      setAssignmentFormData(prev => ({
        ...prev,
        questions: [...prev.questions, { ...currentQuestion, id: Date.now() }]
      }));
      setCurrentQuestion({ content: '', score: 10, modelAnswer: '' });
    } else {
      alert('Vui lòng nhập nội dung câu hỏi!');
    }
  };

  const removeQuestion = (questionId) => {
    setAssignmentFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const resetAssignmentForm = () => {
    setAssignmentFormData({
      title: '',
      description: '',
      dueDate: '',
      duration: '',
      maxScore: 100,
      questions: []
    });

    setCurrentQuestion({ content: '', score: 10, modelAnswer: '' });
  };

  const handleNavigate = useCallback((content) => {
    navigate(content);
  }, []);


  const handleCreateAssignment = useCallback(async (formData) => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description,

        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        duration: parseInt(formData.duration), // Backend: Integer duration
        maxScore: parseInt(formData.maxScore),  // Backend: Integer maxScore


        questions: formData.questions.map(q => ({
          content: q.content,
          modelAnswer: q.modelAnswer,
          score: parseInt(q.score)

        }))
      };

      console.log("Sending Assignment Payload:", payload);


      await createClassAssignmentAPI(selectedClass.id, payload);


      await fetchAssignments();


      setShowCreateAssignment(false);
      resetAssignmentForm();
      setActiveContent('assignment-list');
      alert('Tạo bài tập thành công!');

    } catch (error) {
      console.error("Error creating assignment:", error);
      alert('Lỗi khi tạo bài tập: ' + (error.response?.data?.message || error.message));
    }
  }, [selectedClass, fetchAssignments]);

  const handleCancelAssignment = useCallback(() => {
    setShowCreateAssignment(false);
    resetAssignmentForm();
    setActiveContent('welcome');
  }, []);

  const handleDeleteAssignment = useCallback((assignmentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài tập này?')) {
      const updatedClass = {
        ...selectedClass,
        assignments: selectedClass.assignments.filter(a => a.id !== assignmentId)
      };
      onUpdateClass(updatedClass);
    }
  }, [selectedClass, onUpdateClass]);

  const handleExtendDeadline = useCallback((assignmentId) => {
    const newDeadline = prompt('Nhập thời gian gia hạn (format: YYYY-MM-DDTHH:mm):');
    if (newDeadline) {
      const updatedClass = {
        ...selectedClass,
        assignments: selectedClass.assignments.map(a =>
          a.id === assignmentId ? { ...a, deadline: newDeadline } : a
        )
      };
      onUpdateClass(updatedClass);
    }
  }, [selectedClass, onUpdateClass]);

  // Student handlers
  // const handleRemoveStudent = useCallback((studentId) => {
  //   if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này khỏi lớp?')) {
  //     const updatedClass = {
  //       ...selectedClass,
  //       students: selectedClass.students.filter(s => s.id !== studentId)
  //     };
  //     onUpdateClass(updatedClass);
  //   }
  // }, [selectedClass, onUpdateClass]);

  // Announcement handlers
  const handleSaveAnnouncement = useCallback(async (announcement) => {
    try {

      const payload = {
        title: announcement.title,
        content: announcement.content,
        priority: announcement.priority,
        sendEmail: announcement.sendEmail
      };


      await createClassAnnouncementAPI(selectedClass.id, payload);


      await fetchAnnouncements();

      setShowCreateAnnouncement(false);
      setActiveContent('announcement-list');
      alert('Đăng thông báo thành công!');
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert('Lỗi khi đăng thông báo: ' + (error.response?.data?.message || error.message));
    }
  }, [selectedClass, fetchAnnouncements]);

  const handleDeleteAnnouncement = useCallback((announcementId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
      setAnnouncements(prev => prev.filter(a => a.id !== announcementId));
    }
  }, []);

  const handleEditAnnouncement = useCallback((announcementId) => {
    // TODO: Implement edit functionality
    console.log('Edit announcement:', announcementId);
  }, []);

  const handleCancelAnnouncement = useCallback(() => {
    setShowCreateAnnouncement(false);
    setActiveContent('welcome');
  }, []);


  const handleSaveMaterial = useCallback((newMaterials) => {
    setMaterials(prev => [...newMaterials, ...prev]);
    setShowUploadMaterial(false);
    setActiveContent('material-list');
    alert('Tải tài liệu lên thành công!');
  }, []);

  const handleDeleteMaterial = useCallback((materialId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      setMaterials(prev => prev.filter(m => m.id !== materialId));
    }
  }, []);

  const handleDownloadMaterial = useCallback((materialId) => {
    const material = materials.find(m => m.id === materialId);
    if (material && material.file) {
      const url = URL.createObjectURL(material.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = material.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert('Không thể tải file này');
    }
  }, [materials]);

  const handleCancelMaterial = useCallback(() => {
    setShowUploadMaterial(false);
    setActiveContent('welcome');
  }, []);

  if (!selectedClass) {
    return (
      <div className="class-structure">
        <div className="error-state">
          <span>⚠️</span>
          <p>Không tìm thấy thông tin lớp học</p>
        </div>
      </div>
    );
  }

  const fetchClassMembers = useCallback(async () => {
    if (selectedClass && selectedClass.id) {
      try {
        const data = await getClassMembersAPI(selectedClass.id);
        const studentList = Array.isArray(data)
            ? data.filter(member => member.role === 'STUDENT')
            : [];
        setStudents(studentList);
      } catch (error) {
        console.error("Failed to fetch class members:", error);
      }
    }
  }, [selectedClass]);

  useEffect(() => {
    fetchAnnouncements();
    fetchAssignments();
    fetchClassMembers();
  }, [fetchAnnouncements, fetchAssignments, fetchClassMembers]);

  const handleRemoveStudent = useCallback((studentId) => {
    // TODO: Gọi API xóa học sinh (nếu cần backend hỗ trợ)
    if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này khỏi lớp?')) {

      setStudents(prev => prev.filter(s => s.id !== studentId));
    }
  }, []);

  const handleStartAssignment = (assignmentId) => {
    navigate(`/assignment/${assignmentId}`);
  };

  return (
    <div className="class-structure">
      <ClassHeader 
        selectedClass={selectedClass} 
        onBack={onBack} 
      />
      
      <div className="class-layout">
        <ClassSidebar
          expandedFolders={expandedFolders}
          onToggleFolder={toggleFolder}
          onNavigate={handleNavigate}
        />
        
        <ClassContent
          activeContent={activeContent}
          selectedClass={selectedClass}
          showCreateAssignment={showCreateAssignment}
          showCreateAnnouncement={showCreateAnnouncement}
          showUploadMaterial={showUploadMaterial}
          assignmentFormData={assignmentFormData}
          assignments={assignments}
          onStartAssignment={userRole === 'STUDENT' ? handleStartAssignment : null}
          currentQuestion={currentQuestion}
          announcements={announcements}
          materials={materials}
          onNavigate={handleNavigate}
          onDeleteAssignment={handleDeleteAssignment}
          onExtendDeadline={handleExtendDeadline}
          onUpdateAssignmentField={updateAssignmentField}
          onUpdateQuestion={updateQuestion}
          onAddQuestion={addQuestion}
          onRemoveQuestion={removeQuestion}
          onCreateAssignment={handleCreateAssignment}
          onCancelAssignment={handleCancelAssignment}
          onSaveAnnouncement={handleSaveAnnouncement}
          onDeleteAnnouncement={handleDeleteAnnouncement}
          onEditAnnouncement={handleEditAnnouncement}
          onCancelAnnouncement={handleCancelAnnouncement}
          onSaveMaterial={handleSaveMaterial}
          onDeleteMaterial={handleDeleteMaterial}
          onDownloadMaterial={handleDownloadMaterial}
          onCancelMaterial={handleCancelMaterial}
          students={students}
          onRemoveStudent={handleRemoveStudent}
        />
      </div>
    </div>
  );
};

export default ClassStructure;
