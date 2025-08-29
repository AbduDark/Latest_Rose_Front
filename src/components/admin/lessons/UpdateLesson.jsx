import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

const UpdateLesson = ({ isOpen, onClose, onSuccess, lesson, courses }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course_id: "",
    order: 1,
    is_free: false,
    target_gender: "both"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || "",
        description: lesson.description || "",
        course_id: lesson.course_id || "",
        order: lesson.order || 1,
        is_free: lesson.is_free || false,
        target_gender: lesson.target_gender || "both"
      });
    }
  }, [lesson]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.course_id) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const API_BASE = import.meta.env.VITE_API_BASE;
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE}/admin/lessons/${lesson.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'فشل في تحديث الدرس');
      }

      onSuccess();
    } catch (error) {
      console.error('Update lesson error:', error);
      setError(error.message || 'حدث خطأ أثناء تحديث الدرس');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl border border-gray-700 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">تعديل الدرس</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              عنوان الدرس *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="أدخل عنوان الدرس"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              وصف الدرس
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="أدخل وصف الدرس"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                الكورس *
              </label>
              <select
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              >
                <option value="">اختر الكورس</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ترتيب الدرس
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              الجنس المستهدف
            </label>
            <select
              name="target_gender"
              value={formData.target_gender}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="both">الجميع</option>
              <option value="male">ذكور فقط</option>
              <option value="female">إناث فقط</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_free"
              id="is_free"
              checked={formData.is_free}
              onChange={handleChange}
              className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500"
            />
            <label htmlFor="is_free" className="mr-2 text-sm text-gray-300">
              درس مجاني
            </label>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded p-2">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "جاري التحديث..." : "تحديث الدرس"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateLesson;