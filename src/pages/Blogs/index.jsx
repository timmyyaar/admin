import React, { useEffect, useState } from "react";
import { request } from "../../utils";
import AddOrEditBlogModal from "./AddOrEditBlogModal";

import "./style.scss";

import { ReactComponent as CalendarIcon } from "./icons/calendar.svg";
import { ReactComponent as TimeIcon } from "./icons/time.svg";
import reactStringReplace from "react-string-replace";
import DeleteModal from "./DeleteModal";
import Controls from "./Controls";
import { Louder } from "../../components/Louder";

const TITLE_REGEXP = /{([^}]*)}/g;

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
          <div className="p-4 border border-secondary border-rounded mb-5">
            <div className="w-100 mb-4 mobile-only">
              <Controls
                setIsAddNewBlogModalOpened={setIsAddNewBlogModalOpened}
                setEditingBlog={setEditingBlog}
                setDeleteId={setDeleteId}
                blog={blog}
              />
            </div>
            <div className="d-flex">
              <div className="card blog main mb-4">
                <div className="card-body">
                  <div className="d-flex">
                    <img src={blog.main_image} alt="" />
                    <div className="d-flex flex-column _ml-2">
                      <div className="font-weight-semi-bold sliced-title text-black">
                        {blog.title}
                      </div>
                      <div className="mt-auto category width-max-content">
                        {blog.category}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-50 mobile-none">
                <Controls
                  setIsAddNewBlogModalOpened={setIsAddNewBlogModalOpened}
                  setEditingBlog={setEditingBlog}
                  setDeleteId={setDeleteId}
                  blog={blog}
                />
              </div>
            </div>
            <div className="card blog">
              <div className="card-body">
                <div className="title text-center mb-4">{blog.title}</div>
                <div className="d-flex justify-content-center gap-4 mb-4">
                  <img src={blog.blog_image_one} alt="" className="image" />
                  <img src={blog.blog_image_two} alt="" className="image" />
                </div>
                <div className="text-wrapper">
                  <div className="mb-4 gap-3 d-flex text-black font-weight-semi-bold">
                    <div className="d-flex align-items-center">
                      <CalendarIcon className="_mr-2" />
                      {blog.date}
                    </div>
                    <div className="d-flex align-items-center">
                      <TimeIcon className="_mr-2" />
                      {blog.read_time}
                    </div>
                  </div>
                  <div className="text-black white-space-pre-wrap">
                    {reactStringReplace(blog.text, TITLE_REGEXP, (match) => (
                      <span className="font-weight-semi-bold">{match}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
