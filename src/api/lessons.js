const API_BASE = import.meta.env.VITE_API_BASE;

export const getLessonsByCourse = async (courseId, token) => {
  if (!courseId) throw new Error("courseId is required");
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/courses/${courseId}/lessons`, {
    method: "GET",
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      (typeof payload === "object" && payload?.message) ||
      (typeof payload === "string"
        ? `Server error (${res.status}): Received non-JSON response. ${payload
            .substring(0, 180)
            .replace(/\n/g, " ")}`
        : "Failed to fetch lessons.");
    throw new Error(message);
  }
  return payload;
};

export const getLessonComments = async (courseId, token) => {
  if (!courseId) throw new Error("lessonId is required");
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/lessons/${courseId}/comments`, {
    method: "GET",
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      (typeof payload === "object" && payload?.message) ||
      (typeof payload === "string"
        ? `Server error (${res.status}): ${payload
            .substring(0, 180)
            .replace(/\n/g, " ")}`
        : `Failed to fetch comments (Status: ${res.status})`);
    throw new Error(message);
  }

  // Extract comments from payload.data.comments
  return payload.data?.comments || [];
};

export const createComment = async ({ lesson_id, content }, token) => {
  if (!lesson_id || !content) {
    throw new Error("lesson_id and content are required");
  }
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/comments`, {
    method: "POST",
    headers,
    body: JSON.stringify({ lesson_id, content }),
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    throw new Error(
      (typeof data === "object" && data?.message) ||
        (typeof data === "string"
          ? `Server error (${res.status}): ${data}`
          : `Failed to create comment (Status: ${res.status})`)
    );
  }
  return data.data?.comment || data;
};

export const deleteComment = async (commentId, token) => {
  if (!commentId) {
    throw new Error("commentId is required");
  }

  const headers = {
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/comments/${commentId}`, {
    method: "DELETE",
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    throw new Error(
      (typeof data === "object" && data?.message) ||
        (typeof data === "string"
          ? `Server error (${res.status}): ${data}`
          : `Failed to delete comment (Status: ${res.status})`)
    );
  }

  return data;
};

// Admin lesson management functions

// Get all lessons (admin function)
export const getAllLessons = async (token) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/admin/lessons`, {
    method: "GET",
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      (typeof payload === "object" && payload?.message) ||
      (typeof payload === "string"
        ? `Server error (${res.status}): ${payload}`
        : "Failed to fetch lessons.");
    throw new Error(message);
  }
  return payload;
};

// Get a specific lesson
export const getLesson = async (id, token) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/lessons/${id}`, {
    method: "GET",
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      (typeof payload === "object" && payload?.message) ||
      (typeof payload === "string"
        ? `Server error (${res.status}): ${payload}`
        : "Failed to fetch lesson.");
    throw new Error(message);
  }
  return payload;
};

// Create a new lesson (admin)
export const createLesson = async (lessonData, token) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/admin/lessons`, {
    method: "POST",
    headers,
    body: JSON.stringify(lessonData),
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      (typeof payload === "object" && payload?.message) ||
      (typeof payload === "string"
        ? `Server error (${res.status}): ${payload}`
        : "Failed to create lesson.");
    throw new Error(message);
  }
  return payload;
};

// Update a lesson (admin)
export const updateLesson = async (id, lessonData, token) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/admin/lessons/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(lessonData),
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      (typeof payload === "object" && payload?.message) ||
      (typeof payload === "string"
        ? `Server error (${res.status}): ${payload}`
        : "Failed to update lesson.");
    throw new Error(message);
  }
  return payload;
};

// Delete a lesson (admin)
export const deleteLesson = async (id, token) => {
  const headers = {
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/admin/lessons/${id}`, {
    method: "DELETE",
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      (typeof payload === "object" && payload?.message) ||
      (typeof payload === "string"
        ? `Server error (${res.status}): ${payload}`
        : "Failed to delete lesson.");
    throw new Error(message);
  }
  return payload;
};

// Delete video for a lesson (admin)
export const deleteVideo = async (lessonId, token) => {
  const headers = {
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/admin/lessons/${lessonId}/video`, {
    method: "DELETE",
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      (typeof payload === "object" && payload?.message) ||
      (typeof payload === "string"
        ? `Server error (${res.status}): ${payload}`
        : "Failed to delete video.");
    throw new Error(message);
  }
  return payload;
};

// Get video processing status (admin)
export const getVideoStatus = async (lessonId, token) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/admin/lessons/${lessonId}/video/status`, {
    method: "GET",
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      (typeof payload === "object" && payload?.message) ||
      (typeof payload === "string"
        ? `Server error (${res.status}): ${payload}`
        : "Failed to get video status.");
    throw new Error(message);
  }
  return payload;
};

// Get video playlist for streaming
export const getVideoPlaylist = async (lessonId, token) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/lessons/${lessonId}/playlist`, {
    method: "GET",
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      (typeof payload === "object" && payload?.message) ||
      (typeof payload === "string"
        ? `Server error (${res.status}): ${payload}`
        : "Failed to get video playlist.");
    throw new Error(message);
  }
  return payload;
};

// Get video encryption key
export const getVideoKey = async (lessonId, keyToken, authToken) => {
  const headers = {
    Accept: "application/json",
  };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const res = await fetch(`${API_BASE}/lessons/${lessonId}/key?token=${keyToken}`, {
    method: "GET",
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      (typeof payload === "object" && payload?.message) ||
      (typeof payload === "string"
        ? `Server error (${res.status}): ${payload}`
        : "Failed to get video key.");
    throw new Error(message);
  }
  return payload;
};
