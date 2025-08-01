import { useState } from "react";
import { IoIosArrowBack, IoIosLogOut } from "react-icons/io";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuthUtils } from "../auth/utils/authUtils";
import {
  authorizedMenuItems,
  getFirstName,
  getRoleTitle,
  getUserName,
  sideBarOpenduration,
  UserAvatar,
} from "./sideBarUtils";

const SideBar = () => {
  const { handleLogOut } = useAuthUtils();
  const [isOpen, setIsOpen] = useState(false);
  const { user, claims } = useSelector((state) => state.auth);



  return (
    <aside
      className={`z-50 backdrop-blur-sm bg-[#ffe49f4f] h-[100%] pt-8 box-border flex justify-between flex-col p-3 ${
        isOpen ? "w-72" : "w-20"
      } relative duration-${sideBarOpenduration}`}
    >
      {/* toggle button */}
      <div
        className={`absolute cursor-pointer -right-1 top-2 w-6 h-6 p-[2px] text-[#b08c54]
           border-1 border-cyan-950 rounded-full text-s flex items-center justify-center ${
             !isOpen && "rotate-180"
           } transition-all ease-in-out duration-${sideBarOpenduration}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <IoIosArrowBack />
      </div>

      <div>
        {/* Logo and title section */}
        <div
          className={`inline-flex items-center duration-${sideBarOpenduration} ${
            !isOpen && "pl-[8px] "
          }`}
        >
          <img
            src="./MagicPostOp-logo-symbol.png"
            alt=""
            className={`h-[40px]  rounded-full cursor-pointer block float-left mr-4 duration-${sideBarOpenduration} ${
              isOpen && "ml-2"
            } ${!isOpen && "ml-[4px]"}`}
          />

          <h1
            className={`text-[#b08c54] origin-left font-medium text-xl duration-${sideBarOpenduration} 
            ${!isOpen && "scale-0 overflow-hidden whitespace-nowrap text-0"}`}
          >
            Magic Post Op
          </h1>
        </div>

        <div className="sidebar-links">
          <ul className="pt-6 space-y-0.5 list-none flex flex-col gap-4">
            {authorizedMenuItems(claims).map((item, index) => (
              <li
                className={`group text-[#ffffff] text-sm flex items-center gap-x-4 cursor-pointer p-2 bg-[#cab06d] hover:bg-[#b79d59] hover:shadow-md hover:shadow-[#b79d59] rounded-md mt-2 transition-all ease-in-out duration-${sideBarOpenduration}`}
                key={index}
              >
                <Link
                  to={item.url}
                  className="gap-x-0 relative w-full flex gap-3 rounded-s-lg justify-start items-center transition-[background] delay-200 ease-in-out"
                >
                  <div
                    className={`flex items-end w-[100%] ${
                      !isOpen ? "gap-0 pl-[2px]" : "gap-4"
                    } duration-${sideBarOpenduration}`}
                  >
                    <span className="text-3xl block float-left">
                      {item.icon}
                    </span>

                    <span
                      className={`${
                        !isOpen &&
                        "scale-0 overflow-hidden whitespace-nowrap text-0"
                      } text-base font-medium flex-1 origin-left duration-${sideBarOpenduration} text-[#ffffff]`}
                    >
                      {item.title}
                    </span>

                    {/* Tooltip - only shown when sidebar is collapsed AND hovering the li */}
                    {!isOpen && (
                      <span className="absolute invisible bg-[#cab06d] text-[#ffffff] text-center rounded-[6px] px-3 py-1.5 z-10 left-[3.5rem] after:absolute after:top-1/2 after:left-0 after:-ml-[9px] after:-mt-[5px] after:border-[5px] after:border-solid after:border-r-[#cab06d] after:border-y-transparent after:border-l-transparent after:content-[' '] group-hover:visible pointer-events-none">
                        {item.title}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="sidebar__profile flex items-start  pb-4">
        <div
          className={` w-[50px] rounded-full flex flex-col cursor-pointer mr-2 duration-${sideBarOpenduration}  ${
            !isOpen && "pl-[8px] "
          }`}
        >
          {/* <div className="h-[50px] w-[50px] block box-border cursor-pointer userAvatar"> */}
          <UserAvatar
            className="h-[90px] w-[90px]  block box-border"
            name={getFirstName(user)}
            imgSrc={user?.photoURL || ""}
          />

          <span className="logout ml-[12px] mt-[5px] hide">
            <IoIosLogOut
              className="logOutIcon icon icon-tabler icon-tabler-logout"
              onClick={handleLogOut}
            />
          </span>
        </div>

        <div
          className={`text-[#474747] origin-left font-medium text-sm duration-${sideBarOpenduration} 
            ${!isOpen && "scale-0  overflow-hidden whitespace-nowrap text-0"}`}
        >
          {/* <div className="avatar__name hide "> */}
          <div className="user-name">{getUserName(user)}</div>
          <div className="role">{getRoleTitle(claims)}</div>
          <div className="email">{user?.email}</div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
