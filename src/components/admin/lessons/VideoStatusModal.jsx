import React, { useState, useEffect } from "react";
import { FiX, FiVideo, FiRefreshCw, FiCheck, FiAlertCircle } from "react-icons/fi";

const VideoStatusModal = ({ isOpen, onClose, lesson }) => {
  const [statusData, setStatusData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && lesson) {
      fetchVideoStatus();
      const interval = setInterval(fetchVideoStatus, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen, lesson]);

  const fetchVideoStatus = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE}/admin/lessons/${lesson.id}/video/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'فشل في جلب حالة الفيديو');
      }

      setStatusData(data);
      setError("");
    } catch (error) {
      console.error('Status fetch error:', error);
      setError(error.message || 'حدث خطأ أثناء جلب حالة الفيديو');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready':
        return <FiCheck className="w-5 h-5 text-green-400" />;
      case 'processing':
        return <FiRefreshCw className="w-5 h-5 text-yellow-400 animate-spin" />;
      case 'failed':
        return <FiAlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <FiVideo className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'text-green-400 bg-green-900/20';
      case 'processing': return 'text-yellow-400 bg-yellow-900/20';
      case 'failed': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'ready': return 'الفيديو جاهز للمشاهدة';
      case 'processing': return 'جاري معالجة وتشفير الفيديو...';
      case 'failed': return 'فشل في معالجة الفيديو';
      default: return 'لا يوجد فيديو مرفوع';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">حالة معالجة الفيديو</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-white">{lesson.title}</h3>
            <p className="text-gray-400 text-sm">{lesson.course_name}</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <FiRefreshCw className="w-6 h-6 text-pink-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded p-3">
              {error}
            </div>
          ) : statusData ? (
            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                {getStatusIcon(statusData.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(statusData.status)}`}>
                  {getStatusMessage(statusData.status)}
                </span>
              </div>

              {/* Progress Bar (if processing) */}
              {statusData.status === 'processing' && statusData.processing_progress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>تقدم المعالجة</span>
                    <span>{statusData.processing_progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${statusData.processing_progress}%` }}
                    />
                  </div>
                  {statusData.estimated_time_remaining && (
                    <p className="text-xs text-gray-400">
                      الوقت المتوقع للانتهاء: {statusData.estimated_time_remaining}
                    </p>
                  )}
                </div>
              )}

              {/* Video Information */}
              {statusData.video_info && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">معلومات الفيديو</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {statusData.video_info.duration && (
                      <div>
                        <span className="text-gray-400">المدة:</span>
                        <span className="text-white mr-2">{statusData.video_info.duration}</span>
                      </div>
                    )}
                    {statusData.video_info.size && (
                      <div>
                        <span className="text-gray-400">الحجم:</span>
                        <span className="text-white mr-2">{statusData.video_info.size}</span>
                      </div>
                    )}
                    {statusData.video_info.uploaded_at && (
                      <div className="col-span-2">
                        <span className="text-gray-400">تاريخ الرفع:</span>
                        <span className="text-white mr-2">{statusData.video_info.uploaded_at}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quality Information */}
              {statusData.status === 'ready' && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">الجودات المتوفرة</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs">360p</span>
                    <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs">720p</span>
                    <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs">1080p</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    الفيديو متوفر بجودات متعددة للتشغيل التكيفي
                  </p>
                </div>
              )}

              {/* Error Details */}
              {statusData.status === 'failed' && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                  <h4 className="text-red-400 font-medium mb-2">تفاصيل الخطأ</h4>
                  <p className="text-red-300 text-sm">
                    فشل في معالجة الفيديو. يرجى المحاولة مرة أخرى أو التواصل مع الدعم التقني.
                  </p>
                </div>
              )}
            </div>
          ) : null}

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={fetchVideoStatus}
              className="px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <FiRefreshCw className="w-4 h-4" />
              تحديث
            </button>
            
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoStatusModal;