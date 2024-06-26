import React, { useEffect, useState } from "react";
import { ReactComponent as StarIcon } from "./icons/star.svg";

import { Louder } from "../../components/Louder";

import {
  requestGetReviews,
  requestUpdateReview,
  requestDeleteReview,
} from "./actions";
import ReviewModal from "./ReviewModal";

export const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [loadingVisibilityIds, setLoadingVisibilityIds] = useState([]);
  const [loadingDeleteIds, setLoadingDeleteIds] = useState([]);
  const [editingReview, setEditingReview] = useState(null);

  const getReviews = async () => {
    setIsReviewsLoading(true);

    try {
      const reviewsResponse = await requestGetReviews();

      setReviews(reviewsResponse);
    } finally {
      setIsReviewsLoading(false);
    }
  };

  const onDeleteReview = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete the review permanently?"
    );

    if (confirmed) {
      try {
        setLoadingDeleteIds((loadingIds) => [...loadingIds, id]);

        await requestDeleteReview(id);

        setReviews((prevReviews) =>
          prevReviews.filter((prevReview) => prevReview.id !== id)
        );
      } finally {
        setLoadingVisibilityIds((loadingIds) =>
          loadingIds.filter((loadingId) => id !== loadingId)
        );
      }
    }
  };

  const toggleReviewVisibility = async (review) => {
    setLoadingVisibilityIds((loadingIds) => [...loadingIds, review.id]);

    try {
      const updatedReview = await requestUpdateReview(review.id, {
        ...review,
        visible: !review.visible,
      });

      setReviews((prevReviews) =>
        prevReviews.map((prevReview) =>
          prevReview.id === review.id ? updatedReview : prevReview
        )
      );
    } finally {
      setLoadingVisibilityIds((loadingIds) =>
        loadingIds.filter((loadingId) => review.id !== loadingId)
      );
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  const onReviewModalClose = () => {
    setShowAddReview(false);
    setEditingReview(null);
  };

  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={() => setShowAddReview(true)}
      >
        Add new review
      </button>
      {showAddReview && (
        <ReviewModal
          onReviewModalClose={onReviewModalClose}
          setReviews={setReviews}
          editingReview={editingReview}
        />
      )}
      <Louder visible={isReviewsLoading} />
      <div className="_mt-8">
        {reviews.map((review) => (
          <div className="card mb-3" key={review.id}>
            <div className="card-header d-flex align-items-center">
              <h5 className="card-title mb-0 d-flex justify-content-start align-items-center">
                ️#️⃣️ {review.id}
                <div className="_ml-5">
                  {Array.from({ length: 5 }).map((_, ratingIndex) => (
                    <StarIcon
                      className="_mr-1"
                      fill={
                        review.rating >= ratingIndex + 1 ? "#FCD53F" : "white"
                      }
                    />
                  ))}
                </div>
                <div className="_ml-12 form-check">
                  <input
                    id={`${review.id}-review-visible-checkbox`}
                    className="form-check-input _cursor-pointer"
                    type="checkbox"
                    checked={review.visible}
                    onClick={() => toggleReviewVisibility(review)}
                    disabled={loadingVisibilityIds.includes(review.id)}
                  />
                  <label
                    htmlFor={`${review.id}-review-visible-checkbox`}
                    className="form-check-label _cursor-pointer"
                  >
                    Is review visible
                  </label>
                </div>
              </h5>
              <div className="_ml-auto">
                <button
                  type="button"
                  title="Edit review"
                  className="btn btn-primary _mr-2"
                  onClick={() => {
                    setEditingReview(review);
                    setShowAddReview(true);
                  }}
                >
                  &#9998;
                </button>
                <button
                  type="button"
                  title="Delete review"
                  className="btn btn-danger"
                  onClick={() => onDeleteReview(review.id)}
                  disabled={loadingDeleteIds.includes(review.id)}
                >
                  &#10005;
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="_mb-2">
                Customer name:
                <span className="_font-bold _ml-2">{review.name}</span>
              </div>
              <div className="_mb-2">
                Customer email:
                <span className="_font-bold _ml-2">{review.email}</span>
              </div>
              <div>
                Text:<span className="_font-bold _ml-2">{review.text}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
