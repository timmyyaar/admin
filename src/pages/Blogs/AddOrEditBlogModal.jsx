import React, { useState } from "react";

import Modal from "../../components/common/Modal";
import DatePicker from "react-datepicker";
import { getDateObjectFromString, getDateString, request } from "../../utils";
import { NUMBER_EMPTY_REGEX } from "../../constants";

const PNG_TYPE = "image/png";

function AddOrEditBlogModal({ onClose, setBlogs, blog }) {
  const [mainImage, setMainImage] = useState(blog?.main_image || null);
  const [title, setTitle] = useState(blog?.title || "");
  const [category, setCategory] = useState(blog?.category || "");
  const [date, setDate] = useState(
    blog?.date ? getDateObjectFromString(blog.date) : null
  );
  const [imageOne, setImageOne] = useState(blog?.blog_image_one || null);
  const [imageTwo, setImageTwo] = useState(blog?.blog_image_two || null);
  const [readTime, setReadTime] = useState(blog?.read_time || "");
  const [text, setText] = useState(blog?.text || "");
  const [isBlogLoading, setIsBlogLoading] = useState(false);
  const [blogError, setBlogError] = useState("");

  const mainImageSrc = mainImage
    ? typeof mainImage === "string"
      ? mainImage
      : URL.createObjectURL(mainImage)
    : null;
  const imageOneSrc = imageOne
    ? typeof imageOne === "string"
      ? imageOne
      : URL.createObjectURL(imageOne)
    : null;
  const imageTwoSrc = imageTwo
    ? typeof imageTwo === "string"
      ? imageTwo
      : URL.createObjectURL(imageTwo)
    : null;

  const isValid =
    mainImage &&
    title &&
    category &&
    date &&
    imageOne &&
    imageTwo &&
    readTime &&
    text;

  const addOrEditBlog = async () => {
    try {
      setIsBlogLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("date", getDateString(date));
      formData.append("readTime", +readTime);
      formData.append("text", text);
      formData.append("image", mainImage);
      formData.append("imageOne", imageOne);
      formData.append("imageTwo", imageTwo);

      const newOrUpdatedBlog = await request({
        url: `blogs${blog ? `/${blog.id}` : ""}`,
        method: blog ? "PUT" : "POST",
        body: formData,
      });

      setBlogs((prev) =>
        blog
          ? prev.map((item) => (item.id === blog.id ? newOrUpdatedBlog : item))
          : [...prev, newOrUpdatedBlog]
      );

      onClose();
    } catch (error) {
      setBlogError(error.message);
    } finally {
      setIsBlogLoading(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      isActionButtonDisabled={!isValid || isBlogLoading}
      errorMessage={blogError}
      isLoading={isBlogLoading}
      onActionButtonClick={addOrEditBlog}
      actionButtonText={blog ? "Edit" : "Add"}
    >
      <h5 className="mb-4 text-center">{blog ? "Edit" : "Add"} blog</h5>
      <div className="_inline-grid _gap-4 _w-full grid-two-columns-max-auto align-items-center select-none">
        <label className="_mr-2">Title:</label>
        <input
          className="form-control"
          value={title}
          onChange={({ target: { value } }) => setTitle(value)}
        />
        <label className="_mr-2">Main image:</label>
        <input
          className="form-control"
          type="file"
          onChange={({ target: { files } }) => {
            if (files[0]?.type === PNG_TYPE) {
              setMainImage(files[0]);
            } else {
              setMainImage(null);
            }
          }}
        />
        {mainImageSrc && (
          <>
            <label className="_mr-2">Image preview:</label>
            <img src={mainImageSrc} alt="" />
          </>
        )}
        <label className="_mr-2">Category:</label>
        <input
          className="form-control"
          value={category}
          onChange={({ target: { value } }) => setCategory(value)}
        />
        <label className="_mr-2">Date:</label>
        <div>
          <DatePicker
            selected={date}
            onChange={(newDate) => setDate(newDate)}
            dateFormat="d/MM/yyyy"
          />
        </div>
        <label className="_mr-2">Blog image one:</label>
        <input
          className="form-control"
          type="file"
          onChange={({ target: { files } }) => {
            if (files[0]?.type === PNG_TYPE) {
              setImageOne(files[0]);
            } else {
              setImageOne(null);
            }
          }}
        />
        {imageOneSrc && (
          <>
            <label className="_mr-2">Blog 1 preview:</label>
            <img src={imageOneSrc} alt="" />
          </>
        )}
        <label className="_mr-2">Blog image two:</label>
        <input
          className="form-control"
          type="file"
          onChange={({ target: { files } }) => {
            if (files[0]?.type === PNG_TYPE) {
              setImageTwo(files[0]);
            } else {
              setImageTwo(null);
            }
          }}
        />
        {imageTwoSrc && (
          <>
            <label className="_mr-2">Blog 2 preview:</label>
            <img src={imageTwoSrc} alt="" />
          </>
        )}
        <label className="_mr-2">Read time:</label>
        <input
          className="form-control"
          value={readTime}
          onChange={({ target: { value } }) => {
            if (NUMBER_EMPTY_REGEX.test(value)) {
              setReadTime(value);
            }
          }}
        />
        <label className="_mr-2">Text {`{Title like this}`}:</label>
        <textarea
          className="form-control"
          value={text}
          onChange={({ target: { value } }) => setText(value)}
        />
      </div>
    </Modal>
  );
}

export default AddOrEditBlogModal;
