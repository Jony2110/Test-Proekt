import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Registr() {
  const [loading, setLoading] = useState(false);
  const userNameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const rePasswordRef = useRef("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    const user = {
      userName: userNameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      rePassword: rePasswordRef.current.value
    };

    const { userName, email, password, rePassword } = user;

    
    if (!userName) {
      alert("Введите имя пользователя");
      return;
    }
    if (!email) {
      alert("Введите email");
      return;
    }
    if (!password) {
      alert("Введите пароль");
      return;
    } else if (password.length < 3) {
      alert("Пароль должен быть не менее 3 символов");
      return;
    }
    if (password !== rePassword) {
      alert("Пароли не совпадают");
      return;
    }

   
    setLoading(true);

    
    fetch('https://reqres.in/api/register', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'eve.holt@reqres.in', 
        password: password           
      })
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.error) {
          alert(data.error);  
          return;
        }

        if (data.token) {
         
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem('token', data.token);
          alert("Регистрация успешна!");
          navigate('/login'); 
        } else {
          alert("Произошла ошибка при регистрации. Попробуйте снова.");
        }
      })
      .catch(err => {
        console.log('Ошибка:', err);
        alert('Произошла ошибка при регистрации');
      })
      .finally(() => {
        setLoading(false);
      });

    console.log("User registered:", user);
  }

  return (
    <div>
      <Link to={"/login"}><button>LOGIN</button></Link>
      <h1>REGISTER PAGE</h1>
      <form onSubmit={handleSubmit}>
        <input ref={emailRef} type="email" placeholder="Введите ваш email..." />
        <input ref={userNameRef} type="text" placeholder="Введите ваше имя пользователя..." />
        <input ref={passwordRef} type="password" placeholder="Введите ваш пароль..." />
        <input ref={rePasswordRef} type="password" placeholder="Подтвердите ваш пароль..." />
        {loading && <button disabled>LOADING.....</button>}
        {!loading && <button type="submit">REGISTER</button>}
      </form>
    </div>
  );
}

export default Registr;
