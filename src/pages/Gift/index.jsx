import React, { useEffect, useState } from "react";

import { Louder } from "../../components/Louder";

import { getGifts, deleteGift } from "./actions";

export const GiftPage = () => {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  const toggleForceUpdate = () => setForceUpdate((fU) => !fU);

  const onDeleteGift = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete the gift permanently?"
    );

    if (confirmed) {
      setLoading(true);
      deleteGift({ id }).then(() => {
        setLoading(false);
        toggleForceUpdate();
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    getGifts().then((data) => {
      setGifts(data.gift);
      setLoading(false);
    });
  }, [forceUpdate]);

  return (
    <div className="career-page">
      <Louder visible={loading} />
      <div className="_mt-8">
        {gifts.map((el, i) => (
          <div className="card _mb-3" key={el.id}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">{"Gift " + (i + 1)}</h5>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => onDeleteGift(el.id)}
              >
                x
              </button>
            </div>
            <div className="card-body">
              <p className="card-text">Phone: {el.email}</p>
              <p className="card-text">Email: {el.phone}</p>
              <p className="card-text">About: {el.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
