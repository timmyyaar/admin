import { useRef } from "react";
import reactStringReplace from "react-string-replace";
import Controls from "../Controls";
import { ReactComponent as CalendarIcon } from "../icons/calendar.svg";
import { ReactComponent as TimeIcon } from "../icons/time.svg";
import Titles from "./titles/Titles";

const H2_REGEXP = /<h2>(.*?)<\/h2>/g;
const BOLD_REGEXP = /<b>(.*?)<\/b>/g;
const BULLET_REGEXP = /<bullet \/>/g;
const LINK_REGEXP = /<a>(.*?)<\/a>/g;

function Blog({
  blog,
  setIsAddNewBlogModalOpened,
  setEditingBlog,
  setDeleteId,
}) {
  const mainTitleRef = useRef();
  const titlesRefs = useRef({});

  const getReplacedText = (text) => {
    const replacedTextBullets = text.replaceAll(BULLET_REGEXP, "•  ");

    const replacedTextHeaders = reactStringReplace(
      replacedTextBullets,
      H2_REGEXP,
      (match) => (
        <span
          className="font-weight-semi-bold _text-2xl"
          ref={(el) => (titlesRefs.current[match] = el)}
        >
          {match}
        </span>
      ),
    );

    const replacedTextLink = reactStringReplace(
      replacedTextHeaders,
      LINK_REGEXP,
      (match) => (
        <a
          href={process.env.REACT_APP_MAIN_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {match}
        </a>
      ),
    );

    return reactStringReplace(replacedTextLink, BOLD_REGEXP, (match) => (
      <span className="font-weight-semi-bold">{match}</span>
    ));
  };

  const getBlogTitles = (title, text) => {
    const matches = [...text.matchAll(H2_REGEXP)];

    return [
      title,
      ...matches.map((match) =>
        match[0].replace("<h2>", "").replace("</h2>", ""),
      ),
    ];
  };

  return (
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
        <div className="card blog main mb-4 _bg-white _rounded-2xl">
          <div className="_p-4">
            <div className="d-flex _flex-col _gap-3.5">
              <img
                src={blog.main_image}
                alt=""
                className="_rounded-lg _w-full"
              />
              <div className="d-flex flex-column _gap-3.5">
                <div className="font-weight-semi-bold sliced-title text-black _text-lg">
                  {blog.title}
                </div>
                <div className="_flex _flex-col _gap-5">
                  <div className="_flex _gap-2">
                    <div className="mt-auto category width-max-content">
                      {blog.category}
                    </div>
                    <div className="_flex _items-center text-gray">
                      {blog.date}
                    </div>
                  </div>
                  <div className="text-gray">
                    {blog.read_time} minutes to read
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mobile-none _ml-auto">
          <Controls
            setIsAddNewBlogModalOpened={setIsAddNewBlogModalOpened}
            setEditingBlog={setEditingBlog}
            setDeleteId={setDeleteId}
            blog={blog}
          />
        </div>
      </div>
      <div className="blog-content _rounded-2xl _gap-6">
        <Titles
          titles={getBlogTitles(blog.title, blog.text)}
          mainTitleRef={mainTitleRef}
          titlesRefs={titlesRefs}
        />
        <div className="text-black white-space-pre-wrap">
          <div
            className="font-weight-semi-bold _text-2xl _mb-3"
            ref={mainTitleRef}
          >
            {blog.title}
          </div>
          <div className="_flex _gap-3 _mb-5">
            <div className="_p-3 _bg-white _rounded-full _flex _items-center _justify-center _whitespace-nowrap text-gray _text-sm">
              <CalendarIcon className="_mr-1" /> {blog.date}
            </div>
            <div className="_p-3 _bg-white _rounded-full _flex _items-center _justify-center _whitespace-nowrap text-gray _text-sm">
              <TimeIcon className="_mr-1" /> {blog.read_time} minutes
            </div>
          </div>
          <img
            alt=""
            src={blog.main_image}
            className="_w-full _rounded-3xl _mb-6"
          />
          {getReplacedText(blog.text)}
        </div>
      </div>
    </div>
  );
}

export default Blog;
