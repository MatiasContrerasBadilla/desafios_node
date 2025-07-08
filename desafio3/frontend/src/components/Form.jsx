import { useState } from "react";

function Form({ addPost }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;
    addPost(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        type="text"
        placeholder="¿En qué estás pensando?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Publicar</button>
    </form>
  );
}

export default Form;