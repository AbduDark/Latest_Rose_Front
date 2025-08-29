import React, { useState } from "react";
import { FiX, FiAlertTriangle } from "react-icons/fi";

const DeleteLesson = ({ isOpen, onClose, onSuccess, lesson }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const API_BASE = import.meta.env.VITE_API_BASE;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE}/admin/lessons/${lesson.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'فشل في حذف الدرس');
      }

      onSuccess();
    } catch (error) {
      console.error('Delete lesson error:', error);
      setError(error.message || 'حدث خطأ أثناء حذف الدرس');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">حذف الدرس</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-yellow-400 bg-yellow-900/20 border border-yellow-800 rounded p-3">
            <FiAlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-medium">تحذير!</p>
              <p className="text-sm">هذا الإجراء لا يمكن التراجع عنه</p>
            </div>
          </div>

          <div>
            <p className="text-gray-300">
              هل أنت متأكد من حذف هذا الدرس؟
            </p>
            <div className="bg-gray-700 rounded-lg p-3 mt-2">
              <p className="text-white font-medium">{lesson.title}</p>
              <p className="text-gray-400 text-sm">{lesson.course_name}</p>
            </div>
          </div>

          <div className="bg-red-900/20 border border-red-800 rounded p-3">
            <p className="text-red-300 text-sm">
              سيتم حذف الدرس وجميع مقاطع الفيديو المرتبطة به نهائياً من النظام.
            </p>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded p-2">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              إلغاء
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "جاري الحذف..." : "حذف الدرس"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteLesson;