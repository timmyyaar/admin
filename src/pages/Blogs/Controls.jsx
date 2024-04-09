import React from "react";

function Controls({
  setIsAddNewBlogModalOpened,
  setEditingBlog,
  setDeleteId,
  blog,
}) {
  return (
    <div className="d-flex flex-column align-items-end">
      <div className="mb-3 font-weight-semi-bold">ID: {blog.id}</div>
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
