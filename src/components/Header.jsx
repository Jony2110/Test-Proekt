import { useNavigate } from "react-router-dom";

const Header = () => {
const navigate = useNavigate()


function handleRegistor(event) {
  event.preventDefault();
  navigate("/registor")

}


function handleSeting(event) {
  event.preventDefault();
  navigate("/seting")

}

  return (
    <div className=" justify-betwin flex h-[4.75rem] w-full  items-center ">
      <div>
        <label className=" bg-customColor input input-bordered rounded-md flex w-[18.125rem] h-[2.75rem] mr-[26.125rem] ml-[29.875rem] items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Search anything..."
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-6 w-6 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>

      <div className="flex justify-center items-center">
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="./img/ProfileFoto.svg"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li onClick={handleSeting}>
              <a className="justify-between">Profile</a>
            </li>

            <li onClick={handleRegistor}>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
};

export default Header;
