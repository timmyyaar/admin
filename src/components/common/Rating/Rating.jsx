import { ReactComponent as StarIcon } from "../../../assets/icons/star.svg";
import React, { useState } from "react";

import './index.css'

function Rating({ rating, setRating, isDisabled }) {
  const [hoverIndex, setHoverIndex] = useState(-1);

  const getIsRatingActive = (ratingIndex) =>
    hoverIndex > -1 ? ratingIndex <= hoverIndex : rating >= ratingIndex + 1;

  return (
    <>
      {Array.from({ length: 5 }).map((_, ratingIndex) => (
        <StarIcon
          className={`_cursor-pointer rating-star _mr-1 ${isDisabled ? 'disabled' : ''}`}
          fill={
            isDisabled
              ? "#6c757d"
              : getIsRatingActive(ratingIndex)
              ? "#FCD53F"
              : "white"
          }
          onMouseOver={() => setHoverIndex(ratingIndex)}
          onMouseOut={() => setHoverIndex(-1)}
          onClick={() => setRating(ratingIndex + 1)}
        />
      ))}
    </>
  );
}

export default Rating;
