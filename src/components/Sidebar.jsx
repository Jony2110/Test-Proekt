
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-32 bg-white h-screen p-6 border-r">
      <img src="./img/OctomLogo.svg" alt="Logo" />

      <ul className="mt-[9.438rem] flex flex-col justify-center items-center gap-[2.813rem]">
        <li>
          <img
            onClick={() => {
              navigate("/");
            }}
            className="w-5 cursor-pointer"
            src="./img/GridMenu.svg"
            alt=""
          />
        </li>
        <li>
          <img className="w-5" src="./img/Icon2.svg" alt="" />
        </li>
        <li>
          <img className="w-5" src="./img/book.svg" alt="" />
        </li>
        <li>
          <img
            onClick={() => {
              navigate("/seting");
            }}
            className="w-5 cursor-pointer "
            src="./img/Seting.svg"
            alt=""
          />
        </li>
        <li>
          <img className="w-5" src="./img/Message.svg" alt="" />
        </li>
        <li>
          <img className="w-5" src="./img/File.svg" alt="" />
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
