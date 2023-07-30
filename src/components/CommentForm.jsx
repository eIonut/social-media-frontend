import React from "react";
import { useState } from "react";

const CommentForm = ({ editComment, comment, userId, deleteComment }) => {
  const [inEditMode, setInEditMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault;
    setInEditMode(false);
  };
  return (
    <>
      {!inEditMode && (
        <div>
          <p>{comment.description}</p>
          {comment.user === userId && (
            <button onClick={() => setInEditMode(true)}>Edit comment</button>
          )}
        </div>
      )}
      {inEditMode && comment.user === userId && (
        <form
          onSubmit={async (e) => {
            handleSubmit(e);
            await editComment(e, comment._id);
          }}
        >
          <input
            name="description"
            type="text"
            defaultValue={comment.description}
          />

          <button type="submit">Save</button>
        </form>
      )}

      {comment.user === userId && (
        <button onClick={deleteComment}>Delete comment</button>
      )}
    </>
  );
};

export default CommentForm;
