"use client";
import React from "react";
import MenuDropdown from "./MenuDropdown";
import Logo from "./logo1.png"
const Navbar = () => {
  const isLogin = localStorage.getItem("login");
  const email = localStorage.getItem("email");
  const Name = localStorage.getItem("Name");
  const authorId = localStorage.getItem("authorId");
  const avatar = localStorage.getItem("avatar");

  var data = {
    user: {
      email,
      Name,
      authorId,
      avatar
    },
  };
 
  if(isLogin === "false"){
    data = null;
  }
  return (
   

    <div className="max-w-full  flex justify-center items-center sticky top-0 z-20">
      <div
        // fluid={true}
        rounded={true}
        className="bg-white px-2 sm:px-4 py-2.5 dark:bg-gray-900 w-full z-20 border-b border-gray-200 dark:border-gray-600"
      >
        <div className="container flex flex-wrap items-center justify-between mx-auto ">
          <a href="/" className="flex items-center">
        <div className="mr-auto place-self-center  content pt-5">
            <h1 className="   font-extrabold tracking-tight leading-none  dark:text-white">
              ChatSystem
            </h1>
            <h1 className="  font-extrabold tracking-tight leading-none  dark:text-white">
              ChatSystem
            </h1>
            
          </div>
          </a>

          <div className="flex gap-2">
            <div className="">
              {data?.user ? (
                <div className="flex flex-row items-center ">
                  <h1 className="dark:text-white"> {data.user.Name}</h1>
                  <MenuDropdown  data={data?.user}/>
                </div>
              ) : (
                <>
                  <a
                    href="/login"
                    className="inline-flex items-center justify-center px-3 py-1.5 mr-3 text-base font-medium text-center dark:text-white  rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
                  >
                    Login
                  </a>

                  <a
                    href="/register"
                    className="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 hover:text-yellow-800 rounded transition duration-300"
                  >
                    Signup
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
