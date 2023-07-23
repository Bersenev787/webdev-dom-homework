// api.js
let token = '';
const apiHost = 'https://wedev-api.sky.pro/api';
const apiHostVersion = 'v2';
const apiHostUser = 'maksim-bersenev';

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
    console.log("Комментарий успешно добавлен:", data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

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

export async function deleteCommentViaAPI(commentId) {
  try {
    console.log(token)
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
      token = JSON.parse(localStorage.getItem('token'));
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
      token = JSON.parse(localStorage.getItem('token'));
      return user;
    } 

    throw new Error(error);

  } catch (error) {
    console.error('Ошибка регистрации:', error);
    throw new Error(error);
  }
}

// window.addEventListener("load", async () => {
//   const accessToken = JSON.parse(localStorage.getItem("token"));
//   console.log(accessToken)

//   if (accessToken) {
//     try {
//       const response = await fetch('https://wedev-api.sky.pro/api/user/login', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${accessToken}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();4
//         console.log(data)
//         console.log('Пользователь успешно авторизован:', data);
//         // Здесь вы можете продолжить обработку данных, если нужно
//       } else {
//         console.error('Ошибка при запросе:', response.status);
//         // Здесь вы можете обработать другие статусы ответа, если необходимо
//       }
//     } catch (e) {
//       console.error('Ошибка запроса:', e);
//     }
//   }
// });