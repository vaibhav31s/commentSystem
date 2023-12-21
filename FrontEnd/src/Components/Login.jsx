import React, { useState, useEffect } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import axios from "axios";
import fit from "./loginbanner.webp";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [data, setData] = useState(null);

  if (localStorage.getItem("login") === "true") {
    window.location.href = "/";
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    const res = await toast.promise(
      axios
        .post("http://localhost:8888/login", {
          email,
          password,
        })

        .then((res) => {
          setData(res.data);
          console.log(res.data);

          // Set login credentials to local storage
          localStorage.setItem("login", true);
          localStorage.setItem("email", email);
          localStorage.setItem("Name", res.data.Name);
          localStorage.setItem("authorId", res.data.Id);
          localStorage.setItem("avatar", res.data.avatar);

          //redirect to last route 
          window.location.href = "/";
        })
        .catch((err) => {
          // console.log(err);
          toast.error(err.response.data.message);
        }),
      {
        pending: "Promise is pending",
      }
    );

    //  console.log(res)
  };

  return (
    <section className=" min-h-screen   flex items-center justify-between  w-full">
      <div className=" flex rounded-2xl pt-10 w-full px-8 md:px-20 items-center">
        <div className="md:w-2/3 px-2 md:px-2 sm:w-screen">
          <h1 className="text-4xl antialiased font-bold dark:text-white pb-2 ">
            Welcome to ChatSystem
          </h1>{" "}
          <h1 className="mb-4 text-lg font-semibold text-left dark:text-white  text-gray-900">
            Log in to your account
          </h1>
          <div className="mb-8 space-y-4">
            <label className="block">
              <span className="block mb-1 text-xs font-medium text-gray-700">
                Your Email
              </span>
              <input
                className="form-input"
                type="email"
                placeholder="Ex. james@bond.com"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </label>
            <label className="block">
              <span className="block mb-1 text-xs font-medium text-gray-700">
                Your Password
              </span>
              <input
                className="form-input "
                type="password"
                placeholder="••••••••"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </label>
            <button
              type="submit"
              className="bg-blue-200 w-full py-3 mt-1 justify-center btn btn-primary"
              value="Login"
              onClick={submitHandler}
            >
              Log in
            </button>
          </div>
          <div className="space-y-8">
            <div className="text-center border-b border-gray-200">
              <span className="p-2 text-xs font-semibold tracking-wide text-gray-600 uppercase bg-white ">
                Or
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                // onClick={handleGoogleSignIn}
                className="py-3 btn dark:btn-dark btn-google "
              >
                <FaGoogle className="mr-1 text-2xl" />
                <span className="sr-only">Continue with</span> Google
              </button>
              <a href="#" className="py-3 btn dark:btn-dark  btn-google">
                <FaGithub className="mr-1 text-2xl" />
                <span className="sr-only">Continue with</span> Github
              </a>
            </div>
          </div>
          <p className="mb-4  text-xs text-center text-black  ">
            <a
              href="/register"
              className="text-black dark:text-white underline hover:text-black"
            >
              Create an account
            </a>
            · ·
            <a
              href="#"
              className="text-black dark:text-white underline hover:text-white"
            >
              Privacy & Terms
            </a>
          </p>
        </div>
      </div>

      <div className="md:inline-block hidden w-4/5 mr-5 h-full  rounded-lg  ">
        <img src={fit} width="600" height="500" alt="Banner" />
      </div>
    </section>
  );
};

export default Login;
