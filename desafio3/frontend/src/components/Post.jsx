function Post({ post, likePost }) {
  return (
    <div className="post">
      <p>{post.text}</p>
      <button onClick={() => likePost(post.id)}>
        ❤️ {post.likes}
      </button>
    </div>
  );
}

export default Post;