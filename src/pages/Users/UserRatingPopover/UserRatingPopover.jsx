import "./index.css";
import { useRef } from "react";
import Rating from "../../../components/common/Rating/Rating";
import useClickOutside from "../../../hooks/useClickOutside";
import { request } from "../../../utils";

function UserRatingPopover({
  onClose,
  id,
  setUsers,
  ratingIdsLoading,
  setRatingIdsLoading,
}) {
  const ref = useRef();
  useClickOutside(ref, onClose);

  const updateRating = async (rating) => {
    try {
      setRatingIdsLoading((prev) => [...prev, id]);

      const updatedUser = await request({
        url: `users/${id}/update-rating`,
        method: "PATCH",
        body: { rating },
      });

      setUsers((prev) =>
        prev.map((item) => (item.id === id ? updatedUser : item))
      );
      onClose();
    } finally {
      setRatingIdsLoading((prev) => prev.filter((item) => item !== id));
    }
  };

  return (
    <div className="users-rating-popover" ref={ref}>
      <Rating
        setRating={updateRating}
        isDisabled={ratingIdsLoading.includes(id)}
      />
    </div>
  );
}

export default UserRatingPopover;
