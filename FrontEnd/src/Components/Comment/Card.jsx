import React, { useEffect, useState } from "react";
import {
  BiUpvote,
  BiSolidUpvote,
  BiDownvote,
  BiSolidDownvote,
} from "react-icons/bi";
import { toast } from "react-toastify";

const Card = ({ blog, level, myvotes, totalRepliesAtTop, setTotalRepliesAtTop, allVotesReply, isModerator} ) => {

  const authorId = localStorage.getItem("authorId");
  const fromBookmarked = true;
  const [fromOwnBlog, setFromOwnBlog] = useState(authorId == blog.authorId);
  const [isBookmarked, setIsBookmarked] = useState(true);
  const [blogDelete, setBlogDelete] = useState(false);

  const [userEmail, setuserEmail] = useState("");
  const [votes, setVotes] = useState(blog?.upvote || 0);
  const [canReply, setCanReply] = useState(
    localStorage.getItem("login") == "true"
  );
  const [showReply, setShowReply] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("login") == "true"
  );
  const [curTime, setCurTime] = useState(new Date().toLocaleString());
  const [curTimeDiff, setCurTimeDiff] = useState(0);
  const [editComment, setEditComment] = useState(false);
  const [comments, setComments] = useState(blog);
  const [isOpen, setIsOpen] = useState(false);
  let myVotedState="";
  const isMyVote = myvotes.some(item =>{ if(item.replyId === comments.mainReplyId) {
    myVotedState = item.voteType;
    

    return true;
  }});
  const [hide, setHide] = useState(false);


  const [upvote, setUpvote] = useState(myVotedState === "up");
  const [downvote, setDownvote] = useState(myVotedState === "down");



  const submitComment = async () => {
    if (commentText.length <= 10) {
      toast.error("Reply should be at least 10 characters long");
     
      return;
    }
    if(totalRepliesAtTop == 50) {
      setCanReply(false);
    }
    if(totalRepliesAtTop >= 50) {
      toast.error("Maximum 50 replies allowed");
      return;
    }
    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
  
      const response = await fetch("http://localhost:8888/create/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reply: commentText,
          replyId: comments.mainReplyId,
          authorId: authorId,
          blogId: comments.blogId,
          timestamp: timestamp,
          authorName: localStorage.getItem("Name"),
         
        }),
      });
  
      const data = await response.json();
  
      const lastKeyResponse = await fetch("http://localhost:8888/reply/getlastkey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId: comments.blogId,
          timestamp: timestamp,
          authorId: authorId,
        }),
      });
  
      const lastKeyData = await lastKeyResponse.json();
  
      toast.success("Reply posted");
  
      comments.replies.push({
        reply: commentText,
        authorId: authorId,
        blogId: comments.blogId,
        timestamp: timestamp,
        authorName: localStorage.getItem("Name"),
        replies: [],
        mainReplyId: lastKeyData[0].id,
       
      });
  
      setComments(comments);
      setCommentText("");
      setIsOpen(false);
      setShowReply(true);
      setTotalRepliesAtTop(totalRepliesAtTop + 1);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };
  
  const deleteReply = async () => {

    if(isModerator) {
      try {
        const response = await fetch("http://localhost:8888/reply/edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ replyId: comments.mainReplyId, reply: "This reply has been deleted (edited by moderator)" }),
        });
    
        const data = await response.json();
        toast.success("Reply deleted");
        blog.reply = "This reply has been deleted (edited by moderator)";
        setBlogDelete(true);
      } catch (err) {
        toast.error("Something went wrong");
      }

      return;
    }


    try {
      const response = await fetch("http://localhost:8888/reply/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyId: comments.mainReplyId }),
      });
  
      const data = await response.json();
      toast.success("Reply deleted");
      blog.reply = "This reply has been deleted";
      setBlogDelete(true);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };
  
  const hideComment = async () => {

    if(isModerator) {
      try {
        const response = await fetch("http://localhost:8888/reply/edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ replyId: comments.mainReplyId, reply: "This comment is hidden by the moderator." }),
        });
    
        const data = await response.json();
        toast.success("Reply hidden");
        blog.reply = "This comment is hidden by the moderator.";
        setHide(true);
        
       
      } catch (err) {
        toast.error("Something went wrong");
      }

      return;
    }

  };
  
  useEffect(() => {
   
    setCurTime(new Date().toLocaleString());
    if (localStorage.getItem("login") == "true") {
      setuserEmail(localStorage.getItem("Email"));
    }
    setCurTimeDiff(
      timeDif(
        new Date(new Date().toISOString().slice(0, 19).replace("T", " ")),
        new Date(blog.timestamp)
      )
    );
    //  console.log("allVotesReply", allVotesReply);
   Array.isArray(allVotesReply) &&  allVotesReply.forEach(item => {
      if(item.replyId === comments.mainReplyId) {
       setVotes(item.up - item.down);
       return true;
      }
   });

  }, []);

  const changeComment = async () => {
    setIsOpen(false);
    if (commentText.length <= 10) {
      toast.error("Reply should be at least 10 characters long");
      return;
    }
    
    if(isModerator) {
      try {
        const response = await fetch("http://localhost:8888/reply/edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ replyId: comments.mainReplyId, reply: commentText + " (edited by moderator)" }),
        });
    
        const data = await response.json();
        toast.success("Reply edited");
        blog.reply = commentText +  " (edited by moderator)" ;
        setEditComment(false);
      } catch (err) {
        toast.error("Something went wrong");
      }

      return;
    } 

    try {
      const response = await fetch("http://localhost:8888/reply/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyId: comments.mainReplyId, reply: commentText }),
      });
  
      const data = await response.json();
      toast.success("Reply edited");
      blog.reply = commentText;
      setEditComment(false);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };
  

  const timeDif = (date2, date1) => {
    const diffTimeInMilliseconds = Math.abs(date2 - date1);
    const diffTimeInMinutes = diffTimeInMilliseconds / (1000 * 60); // converting milliseconds to minutes
    return diffTimeInMinutes;
  };


  if (level == 6) {
    return <div></div>;
  }



  return (
    <div>
      <article className="p-3 md:p-6 cursor-pointer bg-white rounded-lg border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 md:min-w-[450px]">
        <div className="flex flex-row gap-4">
          {/* vote  */}
          {/* {isMyVote && (
          <h1>This is my voted blog and i voted {myVotedState}</h1>
          )  
          } */}
          
          {
            // <h1>{ totalRepliesAtTop }</h1>
            // <h1> {÷}</h1>
          }
          <div className="flex flex-col gap-2 items-center justify-center justify-items-center">
            {upvote ? (
              <BiSolidUpvote
                className="w-5 h-5 text-gray-400 dark:text-gray-300"
                onClick={() => {
                  setUpvote(false);
                  fetch("http://localhost:8888/vote/delete", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      replyId: comments.mainReplyId,
                      authorId: authorId,
                    }),
                  });

                  setVotes(votes - 1);
                }}
              />
            ) : (
              <BiUpvote
                onClick={() => {
                  fetch("http://localhost:8888/reply/votes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      replyId: comments.mainReplyId,
                      authorId: authorId,
                      voteType: "up",
                      blogId: comments.blogId,
                    }),
                  });

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
                  fetch("http://localhost:8888/vote/delete", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      replyId: comments.mainReplyId,
                      authorId: authorId,
                    }),
                  }).then((res) => {
                    setDownvote(false);
                    setVotes(votes + 1);
                  }).then((res) => {
                    setDownvote(false);
                  }).catch((err) => {
                    toast.error("Something went wrong");
                  });
                } }
              />
            ) : (
              <BiDownvote
                className="w-5 h-5 text-gray-400 dark:text-gray-300"
                onClick={() => {
                  fetch("http://localhost:8888/reply/votes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      replyId: comments.mainReplyId,
                      authorId: authorId,
                      voteType: "down",
                      blogId: comments.blogId,
                    }),
                  });

                  setDownvote(true);
                  setVotes(votes - 1);
                }}
              />
            )}
          </div>
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mb-3 text-gray-500">
              <div className="flex flex-row gap-2">
                <img
                  className="w-5 h-5 rounded-full"
                  src={`https://api.dicebear.com/5.x/personas/svg?seed=${blog?.authorName}}`}
                  alt="Bonnie Green avatar"
                />
                <span className="text-sm   dark:text-white">
                  {blog?.authorName}
                </span>
              </div>
              <div className="flex flex-row">
                <span className="text-sm">{blog.timestamp}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="text-xl  font-sans text-gray-500 dark:text-gray-400">
                  {blog && blog.reply && blog.reply}
                </span>
                {(curTimeDiff < 5 || isModerator) && (
                  <button
                    onClick={() => {
                      setEditComment(true);
                      setIsOpen(false);
                    }}
                    className="text-sm md:text-sm font-medium dark:text-white gap-2 p-2 border rounded-xl border-gray-300 dark:border-gray-700  "
                  >
                    Edit
                  </button>
                )}

                {/* {timeDif(
              new Date(new Date().toISOString().slice(0, 19).replace("T", " ")),
              new Date(blog.timestamp)
            )} */}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-row justify-end gap-4">
              <div className="flex flex-row text-sm md:text-sm font-medium dark:text-white gap-2">
                {isModerator && <button onClick={()=>hideComment()} className="p-2 border border-r-2 rounded-lg">Hide</button>}
                {comments.replyId === null ? (
                  <h1 className="p-2 border border-r-2 rounded-lg">
                    {" "}
                    Total Replies : {totalRepliesAtTop}{" "}
                  </h1>
                ) : (
                  <> </>
                )}
                {totalRepliesAtTop < 50 &&  isLoggedIn &&
                  (level == 5 ? (
                    <></>
                  ) : isOpen ? (
                    <button
                      className="p-2 border border-r-2 rounded-lg	"
                      onClick={() => {
                        setIsOpen(!isOpen);
                        setEditComment(false);
                      }}
                    >
                      {" "}
                      Cancle{" "}
                    </button>
                  ) : (
                    <button
                      className="p-2 border border-r-2 rounded-lg	 "
                      onClick={() => {
                        setIsOpen(!isOpen);
                        setEditComment(false);
                      }}
                    >
                      {" "}
                      Reply{" "}
                    </button>
                  ))}

                {comments.replies.length != 0 && (
                  <button
                    className={`p-2 border border-r-2 rounded-lg text-sm text-${
                      showReply ? "gray-400" : "blue-500"
                    } rounded-lg	 border-${showReply ? "gray" : "red"}-500`}
                    onClick={() => {
                      setShowReply(!showReply);
                      setEditComment(false);
                    }}
                  >
                    {!showReply ? "Show" : "Close"} {comments.replies.length}{" "}
                    {comments.replies.length > 1 ? "replies" : "reply"}
                  </button>
                )}
              </div>

              {((blog.reply !== "This reply has been deleted" &&
                isLoggedIn &&
                fromOwnBlog ) || isModerator ) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteReply();
                    }}
                    id="theme-toggle"
                    type="button"
                    className="text-red-500 border dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-lg text-sm p-2 md:float-right md:mr-4"
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

      {editComment && (
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
              onClick={() => changeComment()}
              className=" items-center py-2.5 px-4 text-xs font-medium text-center bg-black  text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
            >
              Edit comment
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
              className={`pl-10 pt-2 text-base  border-l-2 dark:border-gray-700 dark:bg-gray-900`}
            > 
              <Card blog={comment} level={level + 1} myvotes={myvotes} totalRepliesAtTop={totalRepliesAtTop} setTotalRepliesAtTop={setTotalRepliesAtTop} allVotesReply={allVotesReply} isModerator={isModerator}/>
            </article>
          );
        })}
    </div>
  );
};

export default Card;