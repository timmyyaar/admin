import React, { useEffect, useState } from "react";
import { request } from "../../utils";
import AddOrEditBlogModal from "./AddOrEditBlogModal";

import "./style.scss";

import DeleteModal from "./DeleteModal";
import { Louder } from "../../components/Louder";
import Blog from "./blog/Blog";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [isBlogsLoading, setIsBlogsLoading] = useState(false);
  const [isAddNewBlogModalOpened, setIsAddNewBlogModalOpened] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const getBlogs = async () => {
    try {
      setIsBlogsLoading(true);

      const blogsResponse = await request({ url: "blogs" });

      setBlogs(blogsResponse);
    } finally {
      setIsBlogsLoading(false);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  return (
    <div className="blogs-wrapper mt-4">
      <Louder visible={isBlogsLoading} />
      <button
        className="btn btn-primary mb-4"
        onClick={() => setIsAddNewBlogModalOpened(true)}
      >
        Add blog
      </button>
      {isAddNewBlogModalOpened && (
        <AddOrEditBlogModal
          onClose={() => {
            setEditingBlog(null);
            setIsAddNewBlogModalOpened(false);
          }}
          setBlogs={setBlogs}
          blog={editingBlog}
        />
      )}
      {deleteId && (
        <DeleteModal
          onClose={() => setDeleteId(null)}
          id={deleteId}
          setBlogs={setBlogs}
        />
      )}
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <Blog
            blog={blog}
            setIsAddNewBlogModalOpened={setIsAddNewBlogModalOpened}
            setEditingBlog={setEditingBlog}
            setDeleteId={setDeleteId}
          />
        ))
      ) : (
        <div className="text-warning font-weight-semi-bold">
          No blogs found...
        </div>
      )}
    </div>
  );
}

export default Blogs;
