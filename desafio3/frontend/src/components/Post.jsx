function Post({ post, likePost, deletePost }) {
  return (
    <div className="post">
      <p>{post.titulo || post.text}</p>
      <button onClick={() => likePost(post.id)}>
        ❤️ {post.likes}
      </button>
      <button onClick={() => deletePost(post.id)}>
        ❌
      </button>
    </div>
  );
}

export default Post;