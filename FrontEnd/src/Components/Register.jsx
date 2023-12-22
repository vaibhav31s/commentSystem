import React from 'react'
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

const { REACT_APP_BACKEND_URL } = process.env;
const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("https://api.multiavatar.com/vaibhav");
    const [role, setRole] = useState("user");
    const [rollno, setRollno] = useState("");
    // const images: string[] = [];
    const options = {
        multi: false,
      
        styles: {
          colors: {
            primary: "#377dff",
          },
          
        },
      };
  
      const handleRegister = async () => {
        if(password !== password2){
            toast.error("Passwords do not match");
            return;
        }
        if (name === "" || email === "" || password === "") {
            toast.error("Please fill all the fields");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be atleast 6 characters");
            return;
        }
        
        setAvatar("https://api.multiavatar.com/" + name.split(" ").join + ".png");
        const res = await fetch(`${REACT_APP_BACKEND_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
                avatar,
            }),
            })
            .then((res) => res.json())
            .then((data) => {
            if (data.error) {
                toast.error(data.error);
            } else {
                toast.success(data.message);
            }
            }
            )
            .catch((err) => {
            toast.error(err);
            }
            );
        }

  return (
    <div>
           <section className="">
      <div className="px-0 mx-auto py-10 max-w-7xl sm:px-4">
  
        <h1 className="text-4xl antialiased font-bold dark:text-white text-center">
              Welcome
            </h1>
        <div className="w-full px-4 pt-5 pb-6 mx-auto mt-8 mb-6 bg-white rounded-none shadow-xl sm:rounded-lg sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-4/12 sm:px-6">
          <h1 className="mb-4 text-lg font-semibold text-left text-gray-900">
            Registration:
          </h1>
          <div className="mb-8 space-y-4">
            <label className="block py-1">
              
              <input
                className="form-input"
                type="text"
                placeholder="Enter Your Name"
                required
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </label>
          
            <label className="block py-1">
              
              <input
                className="form-input"
                type="email"
                placeholder="Enter Your Email"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </label>
            <label className="block py-1">
              
              <input
                className="form-input "
                type="password"
                placeholder="Your Password"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </label>

            <label className="block py-1">
              <input
                className="form-input "
                type="password2"
                placeholder="Confirm Password"
                onChange={(e) => {
                    setPassword2(e.target.value);
                }
                }
                required
              />
            </label>
            {/* <label className="block justify-center items-center flex mg-4  antialiased hover:bg-blue-500 border-r-2 p-2 rounded-md bg-transparent border"> */}
              {/* <BsCloudUpload /> */}
              {/* <UploadButton
                
                
              >
                {({ onClick }) => (
                  <button onClick={onClick}>
                     Upload Your Profile picture...
                  </button>
                )}
              </UploadButton> */}
            {/* </label> */}
  

            <input
              type="submit"
              className="bg-blue-200 w-full py-3 mt-1 justify-center btn btn-primary"
              value="Register"
              onClick={() => handleRegister() }
            />
          </div>
          <div className="space-y-8">
            <div className="text-center border-b border-gray-200">
              <span className="p-2 text-xs font-semibold tracking-wide text-gray-600 uppercase bg-white ">
                Or
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                // onClick={}
                className="py-3 btn btn-icon btn-google "
              >
                <FaGoogle className="mr-1 text-2xl" />
                <span className="sr-only">Continue with</span> Google
              </button>
              <a href="#" className="py-3 btn btn-icon btn-dark">
                <FaGithub className="mr-1 text-2xl" />
                <span className="sr-only">Continue with</span> Github
              </a>
            </div>
          </div>
        </div>
        <p className="mb-4  text-xs text-center text-black dark:text-purpl">
          <a
            href="/login"
            className=" underline hover:text-blue-700"
          >
            Have An Account ? Login
          </a>
          · ·
          <a href="#" className=" underline hover:text-blue-700">
            Privacy & Terms
          </a>
        </p>
      </div>
    </section>
    </div>
  )
}

export default Register