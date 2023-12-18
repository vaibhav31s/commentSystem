import React from "react";
// import logo from '../assets/logo.png'

const Hero = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <div className="max-w-[1420px] mx-auto flex justify-center items-center p-4 h-screen dark:bg-gray-900">
      <section className="bg-white dark:bg-gray-900 w-full">
        <div className="flex flex-col max-w-screen-xl space-y-12 px-4 py-8 mx-auto space-x-12 lg:grid lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7 content">
            <h2 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
              ChatSystem
            </h2>
            <h2 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
              ChatSystem
            </h2>

            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              Discover the power of storytelling: How writing on your blog can
              change the world.
            </p>
            {isLoggedIn && (
              <a
                href="/create"
                className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
              >
                Get started
                <svg
                  className="w-5 h-5 ml-2 -mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </a>
            )}
            <a
              href="#latest"
              className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              Latest Blogs
            </a>
          </div>
          <div className="self-center lg:mt-0 lg:col-span-5 lg:flex">
            <img
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/mobile-app.svg"
              alt="mockup"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
