import React from "react";

function Controls({
  setIsAddNewBlogModalOpened,
  setEditingBlog,
  setDeleteId,
  blog,
}) {
  return (
    <div className="d-flex flex-column align-items-end">
      <button
        className="btn btn-primary width-max-content mb-3"
        onClick={() => {
          setIsAddNewBlogModalOpened(true);
          setEditingBlog(blog);
        }}
      >
        Edit blog
      </button>
      <button
        className="btn btn-danger width-max-content"
        onClick={() => setDeleteId(blog.id)}
      >
        Delete blog
      </button>
    </div>
  );
}

export default Controls;
