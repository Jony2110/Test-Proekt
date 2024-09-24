import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const Seting = () => {


  const [selectedFile, setSelectedFile] = useState(null); // Состояние для хранения выбранного файла
  const fileInputRef = useRef(null);

  // Функция для открытия окна выбора файла
  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  // Обработка выбранного файла
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Обновляем состояние выбранного файла
      console.log(`Выбран файл: ${file.name}`);
    }
  };



  return (
    <div className="p-6 flex-1 bg-gray-50">
      <div className="relative h-[17.625rem] bg-[url('./img/bg-seting.png')] from-blue-500 to-purple-600 rounded-lg mb-6">
        <img
          className="absolute -bottom-20 left-4 w-[8.563rem] h-[8.563rem] rounded-full border-4 border-white"
          src="./img/ProfileFoto.svg"
          alt="User Avatar"
        />
      </div>

      <div className="flex  justify-between">
        <h2 className="text-3xl font-semibold mb-4 ml-56">Settings</h2>
        <div className="flex justify-end space-x-4">
          <button type="button" className="btn bg-zinc-300">
            Cancel
          </button>
          <button type="button" className="btn text-white btn-primary">
            Save
          </button>
        </div>
      </div>
      <ul className="flex space-x-6 mb-6 mt-10">
        <Link
          to="/"
          className="font-semibold hover:text-[#232360] text-[#6A7181]"
        >
          My details
        </Link>
        <Link
          to="/seting"
          className="font-semibold hover:text-[#232360] text-[#6A7181]"
        >
          Profile
        </Link>
        <Link
          to="/seting"
          className="font-semibold hover:text-[#232360] text-[#6A7181]"
        >
          Password
        </Link>
        <Link
          to="/"
          className="font-semibold hover:text-[#232360] text-[#6A7181]"
        >
          Team
        </Link>
        <Link
          to="/"
          className="font-semibold hover:text-[#232360] text-[#6A7181]"
        >
          Plan
        </Link>
        <Link
          to="/"
          className="font-semibold hover:text-[#232360] text-[#6A7181]"
        >
          Billing
        </Link>
        <Link
          to="/"
          className="font-semibold hover:text-[#232360] text-[#6A7181]"
        >
          Email
        </Link>
        <Link
          to="/"
          className="font-semibold hover:text-[#232360] text-[#6A7181]"
        >
          Natification
        </Link>
      </ul>

      <form className="p-6 rounded-lg  space-y-4">
        <div className="flex  gap-7">
          <div>
            <label className="block text-sm font-medium mb-3">First name</label>
            <input
              type="text"
              className="input input-bordered w-[19.25rem] h-[2.813rem]"
              placeholder="Killan"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-3">Last name</label>
            <input
              type="text"
              className="input input-bordered w-[19.25rem] h-[2.813rem]"
              placeholder="James"
            />
          </div>
        </div>

        <label className="mt-5" htmlFor="email">
          Email
        </label>
        <div className="input input-bordered w-[30rem] flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="killanjames@gmail.com"
          />
        </div>

        <div onClick={openFileDialog} className="w-[34.75rem] max-w-md  border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center text-center">
          <div className="text-gray-400 mb-4">
            <img className="mt-5" src="./img/InputFileLogo.svg" alt="" />
          </div>
          <p className="text-gray-500">Click to upload or drag and drop</p>
          <p className="text-gray-400 mb-5 text-sm">
            SVG, PNG, JPG or GIF (max, 800x400px)
          </p>
          <input
          ref={fileInputRef}
          
          onChange={handleFileChange}
            type="file"
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
            style={{ position: "absolute", zIndex: "-1" }}
          />
          {selectedFile && (
        <p className="text-green-500 mt-2">Выбран файл: {selectedFile.name}</p>
      )}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-3">Role</label>
          <input
            type="text"
            className="input input-bordered w-[19.25rem] h-[2.813rem]"
            placeholder="Product Designer"
          />
          
        </div>
      </form>
    </div>
  );
};

export default Seting;
