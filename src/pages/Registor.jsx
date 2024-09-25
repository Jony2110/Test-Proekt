import  { useState } from 'react';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
   
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch('http://trello.vimlc.uz:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: password,
          confirmPassword: confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully');
        setError('');
        
      } else {
        setError(data.message || 'Registration failed');
        setSuccess('');
      }
    } catch (err) {
      setError('An error occurred during registration');
      setSuccess('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center">Register</h2>
        <p className="text-gray-500 text-center mb-4">Getting started is easy</p>

        {/* Social media buttons */}
        <div className="flex justify-center mb-4">
          <button className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center mr-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/9b/Google_Icons_Logo.png"
              alt="Google"
              className="h-5 mr-2"
            />
            Google
          </button>
          <button className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
              alt="Facebook"
              className="h-5 mr-2"
            />
            Facebook
          </button>
        </div>

        <hr className="my-4" />
        <p className="text-center mb-4">Or continue with</p>

        {/* Error and success messages */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border border-gray-300 rounded-lg w-full p-2 mb-4"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border border-gray-300 rounded-lg w-full p-2 mb-4"
            required
          />
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg w-full p-2 mb-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg w-full p-2 mb-4"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 rounded-lg w-full p-2 mb-6"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white rounded-lg w-full p-2 hover:bg-green-600"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
