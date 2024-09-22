import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [loading, setLoading] = useState(false);
  const userNameRef = useRef("");
  const passwordRef = useRef("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    const userName = userNameRef.current.value;
    const password = passwordRef.current.value;

    if (!userName) {
      alert("Введите имя пользователя");
      return;
    }

    if (!password) {
      alert("Введите пароль");
      return;
    } else if (password.length < 3) {
      alert("Пароль должен быть не менее 3 символов");
      return;
    }

    const user = {
      userName,
      password
    };

    setLoading(true);

    fetch('https://auth-rg69.onrender.com/api/auth/signin', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.message === 'Invalid Username or Password!') {
          alert('Неверное имя пользователя или пароль');
          return;
        }

        if (data.accessToken) {
          alert('Вход выполнен успешно');
          localStorage.setItem('token', data.accessToken);  // Сохранение токена
          navigate('/dashboard'); // Перенаправление
        } else {
          alert('Что-то пошло не так. Попробуйте снова.');
        }
      })
      .catch(err => {
        console.log('Ошибка', err);
        alert('Произошла ошибка при входе');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div>
      <Link to={"/registor"}><button>REGISTER</button></Link>
      <h1>Login page</h1>
      <form className="p-6 rounded-lg space-y-4">
        <div className="flex flex-col gap-7">
          <div>
            <label className="block text-sm font-medium mb-3">User Name</label>
            <input ref={userNameRef} type="text" className="input input-bordered w-[19.25rem] h-[2.813rem]" placeholder="Enter your UserName...." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-3">Password</label>
            <input ref={passwordRef} type="password" className="input input-bordered w-[19.25rem] h-[2.813rem]" placeholder="Enter your password..." />
          </div>
        </div> 
        
        {loading && <button disabled>LOADING.....</button>}
        {!loading && <button onClick={handleSubmit}>LOGIN</button>}
      </form>
    </div>
  );
}

export default Login;
