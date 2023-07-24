// auth-api.js
import { apiHost } from "./api.js";

export async function loginAPI(formData) {
    const { login, password } = formData;
  
    try {
      const response = await fetch(`${apiHost}/user/login`, {
        method: 'POST',
        body: JSON.stringify({ login, password }),
      });
  
      const { user, error } = await response.json();
  
      if (response?.ok) {
        console.log('Пользователь успешно авторизован:', user.login);
        localStorage.setItem('token', JSON.stringify(user.token));
        return user;
      }
  
      throw new Error(error);
    
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      throw new Error(error);
    }
  }
  
  // Функция для регистрации нового пользователя
  export async function registerUserAPI(formData) {
    const { login, name, password } = formData;
  
    try {
      const response = await fetch(`${apiHost}/user`, {
        method: 'POST',
        body: JSON.stringify({ login, name, password }),
      });
  
      const { user, error } = await response.json();
  
      if (response.status === 201) {
        console.log('Пользователь успешно зарегистрирован:', user);
        localStorage.setItem('token', JSON.stringify(user.token));
        return user;
      } 
  
      throw new Error(error);
  
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      throw new Error(error);
    }
  }