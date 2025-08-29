import React, { useState } from "react";
import { FiX, FiUpload, FiVideo, FiLoader } from "react-icons/fi";

const VideoUploadModal = ({ isOpen, onClose, onSuccess, lesson }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['video/mp4', 'video/quicktime', 'video/avi', 'video/webm'];
      if (!allowedTypes.includes(file.type)) {
        setError("نوع الملف غير مدعوم. يرجى اختيار ملف فيديو (mp4, mov, avi, webm)");
        return;
      }

      // Validate file size (200MB max)
      const maxSize = 200 * 1024 * 1024; // 200MB
      if (file.size > maxSize) {
        setError("حجم الملف كبير جداً. الحد الأقصى هو 200 ميجابايت");
        return;
      }

      setVideoFile(file);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      setError("يرجى اختيار ملف فيديو");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError("");

    try {
      const formData = new FormData();
      formData.append('video', videoFile);

      const API_BASE = import.meta.env.VITE_API_BASE;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE}/admin/lessons/${lesson.id}/video/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'فشل في رفع الفيديو');
      }

      setUploadProgress(100);
      setTimeout(() => {
        onSuccess();
      }, 1000);

    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'حدث خطأ أثناء رفع الفيديو');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">رفع فيديو للدرس</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            disabled={isUploading}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-white">{lesson.title}</h3>
            <p className="text-gray-400 text-sm">{lesson.course_name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              اختيار ملف الفيديو
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <FiVideo className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-gray-400 text-sm text-center">
                  {videoFile ? videoFile.name : "اضغط لاختيار ملف فيديو"}
                </span>
                {videoFile && (
                  <span className="text-gray-500 text-xs mt-1">
                    {formatFileSize(videoFile.size)}
                  </span>
                )}
              </label>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded p-2">
              {error}
            </div>
          )}

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-300">
                <span>جاري الرفع...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-pink-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 text-center">
                سيتم معالجة الفيديو وتشفيره بعد اكتمال الرفع
              </p>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              إلغاء
            </button>
            <button
              onClick={handleUpload}
              disabled={!videoFile || isUploading}
              className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  جاري الرفع
                </>
              ) : (
                <>
                  <FiUpload className="w-4 h-4" />
                  رفع الفيديو
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadModal;