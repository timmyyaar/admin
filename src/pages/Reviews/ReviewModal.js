import { ReactComponent as StarIcon } from "./icons/star.svg";
import Modal from "../../components/common/Modal";
import React, { useState } from "react";
import { EMAIL_REGEX } from "../../constants";

import { requestAddReview, requestUpdateReview } from "./actions";

function ReviewModal({ onReviewModalClose, setReviews, editingReview }) {
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [rating, setRating] = useState(editingReview?.rating || 0);
  const [name, setName] = useState(editingReview?.name || "");
  const [email, setEmail] = useState(editingReview?.email || "");
  const [text, setText] = useState(editingReview?.text || "");
  const [isVisible, setIsVisible] = useState(editingReview?.visible || false);
  const [isReviewLoading, setIsReviewLoading] = useState(false);

  const addReview = async () => {
    setIsReviewLoading(true);

    try {
      const addedReview = await requestAddReview({
        rating,
        name,
        email,
        text,
        visible: isVisible,
      });

      setReviews((reviews) => [...reviews, addedReview]);
      onReviewModalClose();
    } finally {
      setIsReviewLoading(false);
    }
  };

  const editReview = async () => {
    setIsReviewLoading(true);

    try {
      const updatedReview = await requestUpdateReview(editingReview.id, {
        rating,
        name,
        email,
        text,
        visible: isVisible,
      });

      setReviews((reviews) =>
        reviews.map((review) =>
          review.id === updatedReview.id ? updatedReview : review
        )
      );
      onReviewModalClose();
    } finally {
      setIsReviewLoading(false);
    }
  };

  const getIsRatingActive = (ratingIndex) =>
    hoverIndex > -1 ? ratingIndex <= hoverIndex : rating >= ratingIndex + 1;

  const isEmailInvalid = !EMAIL_REGEX.test(email);
  const isAddReviewButtonEnabled =
    rating && name && email && text && !isEmailInvalid && !isReviewLoading;

  return (
    <Modal
      onClose={onReviewModalClose}
      isActionButtonDisabled={!isAddReviewButtonEnabled}
      errorMessage={email && isEmailInvalid ? "Email is invalid" : ""}
      onActionButtonClick={editingReview ? editReview : addReview}
      actionButtonText={editingReview ? "Edit" : "Add"}
    >
      <>
        <div className="d-flex align-items-center _mb-3">
          <label className="_mr-3 col-2">Rating:</label>
          {Array.from({ length: 5 }).map((_, ratingIndex) => (
            <StarIcon
              className="_cursor-pointer rating-star _mr-1"
              fill={getIsRatingActive(ratingIndex) ? "#FCD53F" : "white"}
              onMouseOver={() => setHoverIndex(ratingIndex)}
              onMouseOut={() => setHoverIndex(-1)}
              onClick={() => setRating(ratingIndex + 1)}
            />
          ))}
        </div>
        <div className="d-flex align-items-center _mb-3">
          <label className="_mr-3 col-2">Name:</label>
          <input
            className="form-control"
            value={name}
            onChange={({ target: { value } }) => setName(value)}
          />
        </div>
        <div className="d-flex align-items-center _mb-3">
          <label className="_mr-3 col-2">Email:</label>
          <input
            className={`form-control ${
              email && isEmailInvalid ? "is-invalid" : ""
            }`}
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
          />
        </div>
        <div className="d-flex align-items-center _mb-3">
          <label className="_mr-3 col-2">Text:</label>
          <input
            className="form-control"
            value={text}
            onChange={({ target: { value } }) => setText(value)}
          />
        </div>
        <div className="d-flex align-items-center">
          <input
            id="visible-checkbox"
            className="_cursor-pointer"
            type="checkbox"
            checked={isVisible}
            onChange={() => setIsVisible(!isVisible)}
          />
          <label htmlFor="visible-checkbox" className="ms-2 _cursor-pointer">
            Visible
          </label>
        </div>
      </>
    </Modal>
  );
}

export default ReviewModal;
