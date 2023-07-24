// main.js
import {
    addCommentViaAPIWrapper,
    renderCommentsFromAPI,
    setCommentInput
  } from './comments.js';
  import { deleteCommentViaAPI, toggleLikeViaAPI } from './comments-api.js';
  import { loginAPI, registerUserAPI } from './auth-api.js';
  import { getUsersAPI } from './users-api.js';
  import format from 'date-fns/format';

  function formatDate(date) {
    return format(new Date(date), 'yyyy-MM-dd HH:mm:ss'); 
  }
  
  // Массив комментариев
  let commentsData = [];
  
  // Переменные для сохранения данных формы
  let commentInputValue = "";
  
  // Добавление комментария
  const nameInput = document.querySelector(".add-form-name");
  const commentInput = document.querySelector(".add-form-text");
  const addButton = document.querySelector(".add-form-button");
  const addCommentsForm = document.querySelector(".add-form");
  const textLoginForm = document.querySelector(".textlogin"); 
  
  // Функция отрисовки и удаления формы регистрации/авторизации
  function switchRenderAuthForm(formHtml = '') {
    textLoginForm.innerHTML = formHtml;
  }
  
  // Event listener для ссылки "авторизуйтесь"
  const loginLink = document.getElementById("login-link");
  loginLink.addEventListener("click", (event) => {
    event.preventDefault();
    // Переключение видимости формы входа
    if (loginLink.textContent.includes('авторизуйтесь')) {
      showLoginForm();
      loginLink.textContent = "скрыть форму"; // Изменяем текст ссылки
    } else {
      switchRenderAuthForm();
      loginLink.textContent = "авторизуйтесь"; // Изменяем текст ссылки
    }
  });
  
  // Функция для отображения формы входа
  function showLoginForm() {
    const loginFormTemplate = `
      <form class="login-form">
        <h2>Вход</h2>
        <input type="text" id="login-input" class="login-input" placeholder="Введите логин" required>
        <input type="password" id="password-input" class="password-input" placeholder="Введите пароль" required>
        <button type="submit" class="login-button">Войти</button>
        <a class="registration-form-link" href="#">Зарегистрируйтесь</a>
      </form>
    `;
    switchRenderAuthForm(loginFormTemplate)
  
    const loginForm = document.querySelector(".login-form");
  
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const userCredentials = {
        login: document.getElementById("login-input").value,
        password: document.getElementById("password-input").value,
      };
  
      const { login } = await loginAPI(userCredentials);
        // Выводим сообщение об успешной регистрации
      console.log(`Пользователь ${login} успешно зарегистрирован!`);
        // Очищаем поля формы
      loginForm.reset();
      addCommentsForm.style.display = 'flex';
      switchRenderAuthForm();
  
      if(login.length) {
        nameInput.setAttribute('readonly', true);
        nameInput.value = login;
      }
    });
  
    const registrationLink = document.querySelector("a.registration-form-link");
    registrationLink.addEventListener("click", (event) => {
      event.preventDefault();
      
      showRegistrationForm();
    });
  }
  // Форма регистрации
  function showRegistrationForm() {
    const registrationFormTemplate = `
      <form id="registration-form" class="registration-form">
        <h2>Регистрация</h2>
        <label for="name-input">Имя</label>
        <input type="text" id="name-input" class="name-input" placeholder="Введите ваше имя" required>
        <label for="login-input">Логин</label>
        <input type="text" id="login-input" class="login-input" placeholder="Введите логин" required>
        <label for="password-input">Пароль</label>
        <input type="password" id="password-input" class="password-input" placeholder="Введите пароль" required>
        <button type="submit" class="register-button">Зарегистрироваться</button>
        <a class="login-form-link" href="#">Авторизация</a>
      </form>
    `;
  
    switchRenderAuthForm(registrationFormTemplate)
  
   // Функция для обработки события отправки формы регистрации
    const registrationForm = document.getElementById('registration-form');
  
    registrationForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const userCredentials = {
        login: document.getElementById("login-input").value,
        name: document.getElementById("name-input").value,
        password: document.getElementById("password-input").value,
      };
  
      const { login } = await registerUserAPI(userCredentials);
        // Выводим сообщение об успешной регистрации
        console.log(`Пользователь ${login} успешно зарегистрирован!`);
        // Очищаем поля формы
        registrationForm.reset();
  
        if (login.length) {
          nameInput.setAttribute('readonly', true);
          nameInput.value = login;
        }
        addCommentsForm.style.display = 'flex';
        switchRenderAuthForm();
    });
  
    const loginLink = document.querySelector("a.login-form-link");
    loginLink.addEventListener("click", (event) => {
      event.preventDefault();
      
      showLoginForm()
    });
  }
  
  // Получение списка пользователей
  async function getUsers() {
    try {
      const users = await getUsersAPI();
      console.log("Список пользователей:", users);
      // Выполните дополнительные действия с полученным списком пользователей
    } catch (error) {
      console.error("Ошибка получения списка пользователей:", error);
      // Обработайте ошибку получения списка пользователей
    }
  }
  
  commentInput.addEventListener("input", (event) => {
    commentInputValue = event.target.value;
  });
  
  setCommentInput(commentInput);
  
  document.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addCommentViaAPIWrapper(commentsData, nameInput.value, commentInputValue);
    }
  });
  
  addButton.addEventListener("click", () => {
    addCommentViaAPIWrapper(commentsData, nameInput.value, commentInputValue, formatDate(new Date()));
  });
  
  // Удаление последнего комментария
  const deleteButton = document.querySelector(".delete-button");
  deleteButton.addEventListener("click", () => {
    const lastComment = commentsData[commentsData.length - 1];
    deleteCommentViaAPI(lastComment.id);
  });
  
  // Лайки
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("like-button")) {
      const index = event.target.dataset.index;
      const comment = commentsData[index];
      toggleLikeViaAPI(comment.id);
    }
  });
  
  // Запуск отрисовки комментариев из API при загрузке страницы
  renderCommentsFromAPI(commentsData);
  getUsers();