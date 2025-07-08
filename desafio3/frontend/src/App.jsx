
import { useState } from "react";
import Form from "./components/Form";
import Post from "./components/Post";
import "./index.css";

function App() {

  const [posts, setPosts] = useState([
    
  ]);

  const addPost = (text) => {
    const newPost = {
      id: Date.now(),
      text,
      likes: 0,
    };
    setPosts([newPost, ...posts]);
  };

  const likePost = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  return (
    <div className="container">
      <h1>Like Me</h1>
      <Form addPost={addPost} />
      <div className="posts">
        {posts.map((post) => (
          <Post key={post.id} post={post} likePost={likePost} />
        ))}
      </div>
    </div>
  );
}

export default App;