import { apiHost, apiHostVersion, apiHostUser } from './api.js'
const token = JSON.parse(localStorage.getItem('token'));

export async function getCommentsFromAPI() {
    try {
      const response = await fetch(`${apiHost}/${apiHostVersion}/${apiHostUser}/comments`);
  
      if (!response?.ok) {
        throw new Error("Ошибка при получении комментариев");
      }
  
      const data = await response.json();
      return data.comments;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  export async function addCommentViaAPI(comment) {
    try {
      const response = await fetch(`${apiHost}/${apiHostVersion}/${apiHostUser}/comments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(comment),
      });
  
      if (!response?.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        } else {
          throw new Error("Ошибка при добавлении комментария");
        }
      }
  
      const data = await response.json();
      console.log("Комментарий успешно добавлен:", data.result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  export async function deleteCommentViaAPI(commentId) {
    try {
      const response = await fetch(`${apiHost}/${apiHostVersion}/${apiHostUser}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response?.ok) {
        throw new Error("Ошибка при удалении комментария");
      }
  
      console.log("Комментарий успешно удален");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

export async function toggleLikeViaAPI(commentId) {
    try {
      const response = await fetch(`${apiHost}/${apiHostVersion}/${apiHostUser}/comments/${commentId}/toggle-like`, {
        method: 'POST',
      });
  
      if (!response?.ok) {
        throw new Error("Ошибка при переключении лайка");
      }
  
      const data = await response.json();
      console.log("Переключение лайка успешно:", data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  