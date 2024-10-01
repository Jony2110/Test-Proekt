import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-[128px] bg-white h-screen p-6 border-r border-gray-200">
      <img src="./img/OctomLogo.svg" alt="Logo" className="w-full mb-16" />

      <ul className="flex flex-col justify-start items-center gap-10 mt-10">
        <li>
          <img
            onClick={() => {
              navigate("/");
            }}
            className="w-6 cursor-pointer"
            src="./img/GridMenu.svg"
            alt="Menu"
          />
        </li>
        <li>
          <img className="w-6" src="./img/Icon2.svg" alt="Icon 2" />
        </li>
        <li>
          <img className="w-6" src="./img/book.svg" alt="Book" />
        </li>
        <li>
          <img
            onClick={() => {
              navigate("/seting");
            }}
            className="w-6 cursor-pointer"
            src="./img/Seting.svg"
            alt="Settings"
          />
        </li>
        <li>
          <img className="w-6" src="./img/Message.svg" alt="Messages" />
        </li>
        <li>
          <img
          onClick={() => {
            navigate("/file");
          }}
          className="w-6" src="./img/File.svg" alt="Files" />
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
