import { useState, useEffect } from "react";
import Form from "./components/Form";
import Post from "./components/Post";
import "./index.css";

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  const addPost = (text) => {
    fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: text, 
        img: "",      
        descripcion: "",
      }),
    })
      .then((res) => res.json())
      .then((newPost) => setPosts([newPost, ...posts]));
  };

  const likePost = (id) => {
    fetch(`http://localhost:3000/posts/like/${id}`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then((updatedPost) => {
        setPosts(
          posts.map((post) =>
            post.id === updatedPost.id ? updatedPost : post
          )
        );
      });
  };

  const deletePost = (id) => {
    fetch(`http://localhost:3000/posts/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setPosts(posts.filter((post) => post.id !== id));
      });
  };

  return (
    <div className="container">
      <h1>Like Me</h1>
      <Form addPost={addPost} />
      <div className="posts">
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            likePost={likePost}
            deletePost={deletePost}
          />
        ))}
      </div>
    </div>
  );
}

export default App;