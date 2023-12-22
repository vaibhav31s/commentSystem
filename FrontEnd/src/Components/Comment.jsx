import React, { useState, useEffect } from "react";
import Card from "./Comment/Card";
import { toast } from "react-toastify";

const Comment = (blogs) => {
  // console.log("blogs", blogs);
  blogs = blogs.blogs;
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("login") == "true");
  const bid = blogs.id;
  const authorId = localStorage.getItem("authorId");
  const [totalReplies, setTotalReplies] = useState(0);
  const [myVotes, setMyVotes] = useState([]);
  const [totalRepliesAtTop, setTotalRepliesAtTop] = useState(null);

  const [allVotesReply, setAllVotesReply] = useState();

  const [blog, setBlog] = useState(null);
  const fetchVotes = async () => {
    if (blogs.id) {
      const response = await fetch(`http://localhost:8888/blog/${bid}/votes`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setAllVotesReply(data);
          console.log(data);
        })
        .catch((err) => {
          // console.log(err);
          toast.error("Something went wrong");
        });
    }
  };

  const getComment = async () => {
    if (blogs.id) {
      const response = await fetch(`http://localhost:8888/replies/${bid}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setComments(data);
          console.log(data);
        })
        .catch((err) => {
          // console.log(err);
          toast.error("Something went wrong");
        });
    }
  };
  const submitComment = async () => {
    if (comment.length <= 10) {
      toast.error("Comment should be atleast 10 characters long");
      return;
    }
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

    await fetch(`http://localhost:8888/create/reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reply: comment,
        replyId: null,
        authorId: authorId,
        blogId: bid,
        timestamp: timestamp,
        authorName: localStorage.getItem("Name"),
      }),
    })
      .then((res) => res.json())
      .then((data1) => {
        // console.log(data);
        const lastKey = fetch(`http://localhost:8888/reply/getlastkey`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            blogId: bid,
            timestamp: timestamp,
            authorId: authorId,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            comments.push({
              mainReplyId: data[0].id,
              reply: comment,
              authorId: authorId,
              blogId: bid,
              timestamp: timestamp,
              authorName: localStorage.getItem("Name"),
              replies: [],
              votes: { upvotes: 0, downvotes: 0 },
            });
            setComments(comments);
            setComment("");
            toast.success("Comment posted");

            totalRepliesAtTop.push(0);
            setTotalRepliesAtTop(totalRepliesAtTop);
            return data;
          });
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  };

  const getVotes = async () => {
    if (localStorage.getItem("login") != "true") {
      return false;
    }

    if (blogs.id) {
      const response = await fetch(`http://localhost:8888/myvotes/blogid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogId: blogs.id,
          authorId: localStorage.getItem("authorId"),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setMyVotes(data);
        })
        .catch((err) => {
          toast.error("Something went wrong");
        });
    }
  };
  

  useEffect(() => {


    fetchVotes();
    getComment();
    getVotes();
    fetchVotes();
  }, []);

 


  useEffect(() => {
    // Initialize totalRepliesAtTop based on the length of comments
    if (comments && Array.isArray(comments)) {
      setTotalRepliesAtTop(Array.from({ length: comments.length }, () => 0));
      comments.map((comment, id) => {
        if (comment.replies && Array.isArray(comment.replies)) {
          setTotalRepliesAtTop((prev) => {
            const newState = [...prev];
            newState[id] = comment.replyCount;
            return newState;
          });
        }
      });
    }
  }, [comments]);
  
  // const [totalReplies]
  if (totalRepliesAtTop == null) {
    return <h1>Loading...</h1>;
  }

  return (
    <section className="w-full bg-white dark:bg-gray-900 py-8 lg:py-16">
      <div className=" mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
            {totalReplies.length}
            Discussion ({comments?.length})
          </h2>
        </div>
        {isLoggedIn ? (
          <div className="">
            <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <label htmlFor="comment" className="sr-only">
                Your comment
              </label>
              <textarea
                id="comment"
                rows={6}
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                placeholder="Write a comment..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              onClick={() => submitComment()}
              className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center bg-black  text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
            >
              Post comment
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <button
              type="submit"
              onClick={() => window.location.replace("/login")}
              className="inline-flex items-center mb-8 mx-auto py-2.5 px-4 text-xs font-medium text-center text-white bg-black bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
            >
              Login to add a Comment
            </button>
          </div>
        )}

        {comments &&
          Array.isArray(comments) &&
          comments.map((comment, id) => {
            let avatar = comment?.text?.split(" ")[0];
            let totalrrr = comment.replyCount;
            return (
              <article
                key={id}
                className="p-2 text-base bg-white  border-gray-200 dark:border-gray-700 dark:bg-gray-900"
              >
                <Card
                  blog={comment}
                  level={0}
                  myvotes={myVotes}
                  totalRepliesAtTop={totalRepliesAtTop[id]}
                  setTotalRepliesAtTop={(newTotalReplies) => {
               
                    setTotalRepliesAtTop((prev) => {
                      const newState = [...prev];
                      newState[id] = newTotalReplies;
                      return newState;
                    });
                  }}
                  allVotesReply={allVotesReply}
                />
              </article>
            );
          })}
          
      </div>
    </section>
  );
};
export default Comment;
