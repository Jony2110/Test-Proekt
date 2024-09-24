import React from 'react';

const Register = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center">Register</h2>
        <p className="text-gray-500 text-center mb-4">Getting started is easy</p>
        
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

        <form>
          <input
            type="text"
            placeholder="Full Name"
            className="border border-gray-300 rounded-lg w-full p-2 mb-4"
            required
          />
          <input
            type="email"
            placeholder="Enter Email"
            className="border border-gray-300 rounded-lg w-full p-2 mb-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-lg w-full p-2 mb-4"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="border border-gray-300 rounded-lg w-full p-2 mb-6"
            required
          />
          <button className="bg-green-500 text-white rounded-lg w-full p-2 hover:bg-green-600">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
