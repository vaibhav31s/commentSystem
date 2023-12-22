
import React from 'react'
import { useEffect, useState } from "react";
const { REACT_APP_BACKEND_URL } = process.env;
const PostLists = () => {
  // http://localhost:8888/blogs/
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`${REACT_APP_BACKEND_URL}/blogs`);
      const data = await response.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <h1>hello</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h1>{post.Title}</h1>
          <p>{post.Description}</p>
        </div>
      ))}
    </div>
  )
}

export default PostLists;