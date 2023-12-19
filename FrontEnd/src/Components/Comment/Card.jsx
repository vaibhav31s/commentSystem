import React, { useEffect, useState } from "react";
import {
  BiUpvote,
  BiSolidUpvote,
  BiDownvote,
  BiSolidDownvote,
} from "react-icons/bi";
import { toast } from "react-toastify";

const Card = ({ blog, level }) => {
  console.log("level", level, typeof blog);
  const authorId = localStorage.getItem("authorId");

  console.log("Commments ", blog);
  const fromBookmarked = true;
  const [fromOwnBlog, setFromOwnBlog] = useState(authorId == blog?.authorId);
  const [isBookmarked, setIsBookmarked] = useState(true);
  const [blogDelete, setBlogDelete] = useState(false);
  const [upvote, setUpvote] = useState(false);
  const [downvote, setDownvote] = useState(false);
  const [userEmail, setuserEmail] = useState("");
  const [votes, setVotes] = useState(blog?.upvote || 0);
  const [canReply, setCanReply] = useState(
    localStorage.getItem("login") == "true"
  );
  const [showReply, setShowReply] = useState(false);
  const [commentText, setCommentText] = useState("");

  // {
  //   id: 1,
  //   comment: "this is comment1",
  //   authorName: "Vaibhav Gawad",
  //   timestamp: "2023-12-18 01:00:00",
  //   upvote: 10,
  // },

  const [comments, setComments] = useState(blog);

  const [isOpen, setIsOpen] = useState(false);

  const submitComment = async () => {
    if(commentText.length <= 10) {
      toast.error("Reply should be atleast 10 characters long");
      return;
    }
    comments.replies.push({
      reply: commentText,
      authorId: authorId,
      blogId: localStorage.getItem("blogId"),
      timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
      authorName: localStorage.getItem("Name"),
      replies: [],
    });
    setComments(comments);
    setIsOpen(false);
    setShowReply(true);
  };

  useEffect(() => {
    if (localStorage.getItem("login") == "true") {
      setuserEmail(localStorage.getItem("Email"));
    }
  }, []);
  if (level == 6) {
    return <div></div>;
  }

  return (
    <div>
      <article className="p-3 md:p-6 cursor-pointer bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 md:min-w-[450px]">
        <div className="flex justify-between items-center mb-5 text-gray-500">
          <></>
          <span className="text-sm">{blog.timestamp}</span>
        </div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          <a href={`/blog/${blog?.id}`}>{blog?.Title}</a>
        </h2>
        <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
          {blog && blog.reply && blog.reply.slice(0, 20)}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              className="w-7 h-7 rounded-full"
              src={`https://api.dicebear.com/5.x/personas/svg?seed=${blog?.authors}}`}
              alt="Bonnie Green avatar"
            />
            <span className="text-sm md:text-lg font-medium dark:text-white">
              {blog?.authorName}
            </span>
          </div>

          <div className="flex flex-row items-center space-x-4">
            {upvote ? (
              <BiSolidUpvote
                className="w-5 h-5 text-gray-400 dark:text-gray-300"
                onClick={() => {
                  setUpvote(false);
                  setVotes(votes - 1);
                }}
              />
            ) : (
              <BiUpvote
                onClick={() => {
                  setUpvote(true);
                  setVotes(votes + 1);
                }}
                className="w-5 h-5 text-gray-400 dark:text-gray-300"
              />
            )}
            <span>{votes}</span>

            {downvote ? (
              <BiSolidDownvote
                className="w-5 h-5 text-gray-400 dark:text-gray-300"
                onClick={() => {
                  setDownvote(false);
                  setVotes(votes + 1);
                }}
              />
            ) : (
              <BiDownvote
                className="w-5 h-5 text-gray-400 dark:text-gray-300"
                onClick={() => {
                  setDownvote(true);
                  setVotes(votes - 1);
                }}
              />
            )}

            <div>
              <span className="text-sm md:text-lg font-medium dark:text-white gap-2 p-2">
                {level == 5 ? (
                  <button
                    className="p-2 border border-r-2 "
                    onClick={() => {
                      toast("No more Reply");
                    }}
                  >
                    No more Reply
                  </button>
                ) : isOpen ? (
                  <button
                    className="p-2 border border-r-2 "
                    onClick={() => {
                      setIsOpen(!isOpen);
                    }}
                  >
                    {" "}
                    Cancle{" "}
                  </button>
                ) : (
                  <button
                    className="p-2 border border-r-2 "
                    onClick={() => {
                      setIsOpen(!isOpen);
                    }}
                  >
                    {" "}
                    Reply{" "}
                  </button>
                )}
              </span>
              <button
                className="p-2 border border-r-2 "
                onClick={() => {
                  setShowReply(!showReply);
                }}
              >
                Show {comments.replies.length}{" "}
                {comments.replies.length > 1 ? "replies" : "reply"}
              </button>
            </div>
            {fromOwnBlog && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // deleteBlog();
                }}
                id="theme-toggle"
                type="button"
                className="text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-lg text-sm p-2.5 md:float-right md:mr-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </article>
      {isOpen && (
        <div className="flex flex-col  w-full pl-2 pt-2 ">
          <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <textarea
              id="comment"
              rows={4}
              onChange={(e) => setCommentText(e.target.value)}
              className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800 border-gray-200 "
              placeholder="Write a comment..."
              required
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              onClick={() => submitComment()}
              className=" items-center py-2.5 px-4 text-xs font-medium text-center bg-black  text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
            >
              Post comment
            </button>
          </div>
        </div>
      )}

      {showReply &&
        comments.replies &&
        Array.isArray(comments.replies) &&
        comments.replies.map((comment, id) => {
          let avatar = comment?.text?.split(" ")[0];
          return (

            <article
              key={id}
              className={`pl-10 pt-2 text-base  border-l-2 dark:border-gray-700 dark:bg-gray-900`            }
              >
              <Card blog={comment} level={level + 1} />
            </article>
         
          );
         
        })}
    </div>
  );
};

export default Card;
