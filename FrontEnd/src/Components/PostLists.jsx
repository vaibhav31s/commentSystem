
import React from 'react'
import { useEffect, useState } from "react";
const PostLists = () => {
  // http://localhost:8888/blogs/
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("http://localhost:8888/blogs");
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