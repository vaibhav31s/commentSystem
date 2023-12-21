import React, { useEffect, useState, useSearchParams } from "react";
import { TextToSpeech, useTts } from "tts-react";
// import Comments from "components/Comments";
import Comments from "./Comment";
import { useParams } from 'react-router-dom';
import { BsBookmarkCheckFill, BsBookmarkDash } from "react-icons/bs";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
const Blogs = (props) => {
    const { id } = useParams();
    // const id = router
    const [blog, setBlog] = useState(null);
    const [recs, setRecs] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [summery, setSummery] = useState("");
    const [scroll, setScroll] = useState(0);
    // const id = 8;
    useEffect(() => {
        const fetchBlog = async () => {
            const response = await fetch(`/api/blog/${id}`);
            const data = await response.json();
            setBlog(data[0]);
        };
        fetchBlog();
    }
    , [id]);

    if(!blog){
        return <h1>Loading...</h1>
    }

  return (
    <div className="flex flex-col">
          {/* <h2>Blog Post {id}</h2> */}
      <div id="progressBarContainer">
        <div
          id="progressBar"
          style={{ transform: `scale(${scroll}, 1)`, opacity: `${scroll}` }}
        />
      </div>
      <div className="flex flex-col flex-grow max-w-6xl mx-auto p-4">
        <div className="mt-20 flex flex-row items-center cursor-pointer">
          <ChevronLeftIcon className="h-4 w-4 text-blue-500 dark:text-white" />
          <div
            // onClick={() => router.back()}
            className="ml-2 text-md font-bold text-blue-500 dark:text-white"
          >
            Back to home
          </div>
        </div>
        <div className="mt-6">
          {blog && blog?.tags && blog?.tags?.length > 0 && (  
            <img
              src={`https://source.unsplash.com/random/?${blog?.tags?.split(",")[0]}`}
              alt=""
              className="w-full max-h-[300px] lg:max-h-[450px] object-cover"
            />
          )}
        </div>
        <div className="flex flex-row mt-6 flex-wrap gap-3 md:gap-1">
          {blog &&
            blog?.tags?.split(",").map((tag, id) => (
              <span
                key={id}
                className="px-4 py-1.5 mr-2 rounded-full text-blue-500 dark:text-white dark:bg-[#213ABF] bg-blue-100 font-semibold text-sm flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease"
              >
                <a href={`/blogs?category=${tag}`}>{tag}</a>
              </span>
            ))}
        </div>
        <div className="mt-4 md:text-5xl text-3xl font-bold dark:text-white">
          {blog?.Title}
        </div>
        {summery && summery.length > 0 && (
          <div className="mt-12">
            <div className="text-2xl font-bold mb-2 dark:text-white">
              Summary
            </div>
            <div className=" dark:text-[#D1CFDB] text-justify">{summery}</div>
          </div>
        )}
        <div className="flex mt-8 justify-between">
          <div className="flex mt-8 ">
            <img
              className="h-20 w-20 rounded-full"
              src={`https://api.dicebear.com/5.x/personas/svg?seed=${blog?.authors}}`}
            />
            <div className="flex flex-col justify-evenly ml-4">
              <div className=""></div>
              <div className="uppercase dark:text-white font-semibold">
                {blog?.authors}
              </div>
              <div className="dark:text-[#D1CFDB] font-semibold">
                {blog?.timestamp}
              </div>
            </div>
          </div>
          {isLiked  ? (
            <BsBookmarkCheckFill
              className="h-10 w-10 dark:text-white"
            //   onClick={() => deleteBookmarked(blog.id)}
            />
          ) : (
            <BsBookmarkDash
              className="h-10 w-10 dark:text-white"
            //   onClick={() => addBookmarked(blog.id)}
            />
          )}
        </div>
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="mt-6 text-justify new-line dark:text-[#D1CFDB]">
          {/*  */}
          <div>
            <TextToSpeech
              align="vertical"
              allowMuting
              markBackgroundColor="#55AD66"
              markColor="white"
              markTextAsSpoken
              onBoundary={function noRefCheck() {}}
              onEnd={function noRefCheck() {}}
              onError={function noRefCheck() {}}
              onPause={function noRefCheck() {}}
              onPitchChange={function noRefCheck() {}}
              onRateChange={function noRefCheck() {}}
              onStart={function noRefCheck() {}}
              onVolumeChange={function noRefCheck() {}}
              position="topLeft"
              rate={1}
              size="medium"
              volume={1}
            >
              {blog?.Description    }
            </TextToSpeech>
          </div>
        </div>
        <div className="mt-8">
          {recs && recs.length > 0 && (
            <div>
              <div className="text-2xl font-bold dark:text-white">
                You May Also Like
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 mt-4 gap-6 justify-between">
                {recs &&
                  recs.length > 0 &&
                  recs.map((rec) => (
                    <div className="" key={rec.id}>
                      <div
                        // onClick={() => onRecClick(rec.id)}
                        className="flex flex-col w-full hover:scale-110 ease-in duration-300 cursor-pointer"
                      >
                        <img
                          src={`https://source.unsplash.com/random/?${rec?.tags.join(
                            ","
                          )}`}
                          alt=""
                          className="aspect-video object-cover"
                        />
                        <div className="flex mt-3">
                          {rec.tags.length > 0 && (
                            <span
                              key={0}
                              className="px-3 py-1 mr-2 rounded-full text-blue-500 dark:text-white dark:bg-[#213ABF] bg-blue-100 font-semibold text-xs flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease"
                            >
                              {rec.tags[0]}
                            </span>
                          )}
                        </div>
                        <div className="text-md mt-2 font-semibold dark:text-white">
                          {rec.title}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        <Comments blogs={blog} />
      </div>
    </div>
  );
};
  

export default Blogs