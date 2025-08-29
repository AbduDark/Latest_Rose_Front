import React, { useState, useEffect } from "react";
import { FiPlus, FiVideo, FiUpload, FiPlay, FiPause, FiTrash2 } from "react-icons/fi";
import { getCourses } from "../../../api/courses";
import { getAllLessons, deleteVideo } from "../../../api/lessons";
import CreateLesson from "./CreateLesson";
import UpdateLesson from "./UpdateLesson";
import DeleteLesson from "./DeleteLesson";
import VideoUploadModal from "./VideoUploadModal";
import VideoStatusModal from "./VideoStatusModal";

const LessonsManager = () => {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isVideoUploadModalOpen, setIsVideoUploadModalOpen] = useState(false);
  const [isVideoStatusModalOpen, setIsVideoStatusModalOpen] = useState(false);
  
  const [currentLesson, setCurrentLesson] = useState(null);
  const [lessonToDelete, setLessonToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = lessons.filter((lesson) => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lesson.course_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = selectedCourse === "all" || lesson.course_id.toString() === selectedCourse;
      return matchesSearch && matchesCourse;
    });
    setFilteredLessons(filtered);
  }, [lessons, searchTerm, selectedCourse]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [coursesResponse, lessonsResponse] = await Promise.all([
        getCourses(),
        fetchAllLessons()
      ]);
      setCourses(coursesResponse.data || []);
      setLessons(lessonsResponse.data || []);
      setError("");
    } catch (err) {
      setError("فشل في تحميل البيانات: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllLessons = async () => {
    const token = localStorage.getItem('token');
    const response = await getAllLessons(token);
    return response;
  };

  const handleVideoUpload = (lesson) => {
    setCurrentLesson(lesson);
    setIsVideoUploadModalOpen(true);
  };

  const handleVideoStatus = (lesson) => {
    setCurrentLesson(lesson);
    setIsVideoStatusModalOpen(true);
  };

  const handleDeleteVideo = async (lesson) => {
    if (window.confirm("هل أنت متأكد من حذف الفيديو؟")) {
      try {
        const token = localStorage.getItem('token');
        await deleteVideo(lesson.id, token);
        fetchData();
      } catch (error) {
        alert("خطأ في حذف الفيديو: " + error.message);
      }
    }
  };

  const getVideoStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'text-green-400 bg-green-900/20';
      case 'processing': return 'text-yellow-400 bg-yellow-900/20';
      case 'failed': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getVideoStatusText = (status) => {
    switch (status) {
      case 'ready': return 'جاهز';
      case 'processing': return 'قيد المعالجة';
      case 'failed': return 'فشل';
      default: return 'لا يوجد فيديو';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">إدارة الدروس</h1>
          <p className="text-gray-400 mt-1">
            إدارة الدروس ومقاطع الفيديو الخاصة بها
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          إضافة درس جديد
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              البحث في الدروس
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن درس..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              تصفية حسب الكورس
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="all">جميع الكورسات</option>
              {courses.map(course => (
                <option key={course.id} value={course.id.toString()}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Lessons Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  الدرس
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  الكورس
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  حالة الفيديو
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  المدة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredLessons.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                    لا توجد دروس متاحة
                  </td>
                </tr>
              ) : (
                filteredLessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{lesson.title}</div>
                      <div className="text-gray-400 text-sm">{lesson.description?.substring(0, 100)}...</div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {lesson.course_name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getVideoStatusColor(lesson.video_status)}`}>
                        {getVideoStatusText(lesson.video_status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {lesson.video_duration ? `${Math.floor(lesson.video_duration / 60)} دقيقة` : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVideoUpload(lesson)}
                          className="text-blue-400 hover:text-blue-300 p-1"
                          title="رفع فيديو"
                        >
                          <FiUpload className="w-4 h-4" />
                        </button>
                        
                        {lesson.video_status && (
                          <button
                            onClick={() => handleVideoStatus(lesson)}
                            className="text-green-400 hover:text-green-300 p-1"
                            title="حالة الفيديو"
                          >
                            <FiVideo className="w-4 h-4" />
                          </button>
                        )}
                        
                        {lesson.video_path && (
                          <button
                            onClick={() => handleDeleteVideo(lesson)}
                            className="text-red-400 hover:text-red-300 p-1"
                            title="حذف الفيديو"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => {
                            setCurrentLesson(lesson);
                            setIsEditModalOpen(true);
                          }}
                          className="text-yellow-400 hover:text-yellow-300 p-1 ml-2"
                          title="تعديل الدرس"
                        >
                          ✏️
                        </button>
                        
                        <button
                          onClick={() => {
                            setLessonToDelete(lesson);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="حذف الدرس"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateLesson 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            fetchData();
            setIsCreateModalOpen(false);
          }}
          courses={courses}
        />
      )}

      {isEditModalOpen && currentLesson && (
        <UpdateLesson 
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentLesson(null);
          }}
          onSuccess={() => {
            fetchData();
            setIsEditModalOpen(false);
            setCurrentLesson(null);
          }}
          lesson={currentLesson}
          courses={courses}
        />
      )}

      {isDeleteModalOpen && lessonToDelete && (
        <DeleteLesson 
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setLessonToDelete(null);
          }}
          onSuccess={() => {
            fetchData();
            setIsDeleteModalOpen(false);
            setLessonToDelete(null);
          }}
          lesson={lessonToDelete}
        />
      )}

      {isVideoUploadModalOpen && currentLesson && (
        <VideoUploadModal 
          isOpen={isVideoUploadModalOpen}
          onClose={() => {
            setIsVideoUploadModalOpen(false);
            setCurrentLesson(null);
          }}
          onSuccess={() => {
            fetchData();
            setIsVideoUploadModalOpen(false);
            setCurrentLesson(null);
          }}
          lesson={currentLesson}
        />
      )}

      {isVideoStatusModalOpen && currentLesson && (
        <VideoStatusModal 
          isOpen={isVideoStatusModalOpen}
          onClose={() => {
            setIsVideoStatusModalOpen(false);
            setCurrentLesson(null);
          }}
          lesson={currentLesson}
        />
      )}
    </div>
  );
};

export default LessonsManager;