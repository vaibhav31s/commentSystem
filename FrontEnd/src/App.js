import logo from "./logo.svg";
import "./App.css";
import Hero from "./Components/Hero";
import PostLists from "./Components/PostLists";
import Latest from "./Components/Latest";
import { Routes, Route } from "react-router-dom";
import Blog from "./Components/Blog";
import Navbar from "./Components/Navbar";
// import LoginTest from "./Components/LoginTest";
import Login from "./Components/Login";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Replies from "./Components/Replies";
function App() {
  return (
    <html lang="en">
      <div className="max-w-screen mx-auto">
        <body className="wrapper flex flex-col dark:bg-[#05091a]">
          <div className="fixed w-screen bg-white dark:bg-[#05091a] z-10">
          <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          theme="light"
          />

          <Navbar />
            <Routes>
              <Route
                path="/"
                element={
                  <div className="">
                    
                    <Hero />
                    <Latest />
                  </div>
                }
              />
              <Route path="/posts" element={<PostLists />} />

              <Route path="/blog/:id" element={<Blog />} />

              <Route path="/replies/:id" element={<Replies />} />

              <Route path="/login" element={<Login />} />
            </Routes>
          </div>{" "}
        </body>
      </div>
    </html>
  );
}

export default App;
