import { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://trello.vimlc.uz:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
       
        console.log('Login successful:', data);
        localStorage.setItem('authToken', data.token); 
        alert('Login successful!');
      } else {
        
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred during login. Please try again later.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-2">Login Page</h2>
        <p className="text-gray-500 text-center mb-4">Login into your account</p>
        
        <div className="flex justify-center mb-4">
          <button className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center mr-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/9b/Google_Icons_Logo.png" alt="Google" className="h-5 mr-2"/>
            Google
          </button>
          <button className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="h-5 mr-2"/>
            Facebook
          </button>
        </div>

        <hr className="my-4" />
        <p className="text-center mb-4">Or continue with</p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>} 

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-lg w-full p-2 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-lg w-full p-2 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="text-red-500 hover:underline">Recover Password</a>
          </div>

          <button className="bg-gray-500 text-white rounded-lg w-full p-2 hover:bg-gray-600" type="submit">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
