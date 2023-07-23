import { apiHost } from "./api.js";

// Получение списка пользователей
export async function getUsersAPI() {
    try {
      const response = await fetch(`${apiHost}/user`, {
        method: 'GET'
      });
  
      if (!response?.ok) {
        throw new Error("Ошибка при получении списка пользователей");
      }
  
      const data = await response.json();
      return data.users;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }