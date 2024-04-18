import React, { useEffect, useState } from "react";

import { Louder } from "../../components/Louder";

import { request } from "../../utils";
import AddNewPromoModal from "./AddNewPromoModal";

export const PromoPage = () => {
  const [promo, setPromo] = useState([]);
  const [showAddNewPromoModal, setShowAddNewPromoModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [deletingPromoIds, setDeletingPromoIds] = useState([]);

  const onDeletePromo = async (id) => {
    try {
      setDeletingPromoIds((prev) => [...prev, id]);

      await request({ url: `promo/${id}`, method: "DELETE" });

      setPromo((prev) => prev.filter((prevPromo) => prevPromo.id !== id));
    } finally {
      setDeletingPromoIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const getPromo = async () => {
    try {
      setLoading(true);

      const promoResponse = await request({ url: "promo" });

      setPromo(promoResponse);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPromo();
  }, []);

  return (
    <div className="promo-page">
      <Louder visible={loading} />
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowAddNewPromoModal(true)}
      >
        Add
      </button>
      {showAddNewPromoModal && (
        <AddNewPromoModal
          onClose={() => setShowAddNewPromoModal(false)}
          promo={promo}
          setPromo={setPromo}
        />
      )}
      <div className="_grid _grid-cols-2 _gap-4 ">
        {promo.map((el, i) => (
          <div key={el.id}>
            <div className="card">
              <div className="card-header d-flex align-items-center">
                <h5
                  className={`card-title mb-0 ${
                    el.count && el.count_used >= el.count
                      ? "text-danger"
                      : "text-success"
                  }`}
                >
                  {el.code} (
                  {!el.count
                    ? "Infinite"
                    : el.count === 1
                    ? "Single"
                    : `${el.count_used}/${el.count} Usages`}
                  )
                </h5>
                <button
                  type="button"
                  className={`btn btn-danger icon-button _ml-auto ${
                    deletingPromoIds.includes(el.id) ? "loading" : ""
                  }`}
                  disabled={deletingPromoIds.includes(el.id)}
                  onClick={() => onDeletePromo(el.id)}
                >
                  {!deletingPromoIds.includes(el.id) && <>&#10005;</>}
                </button>
              </div>
              <div className="card-body _flex _justify-between">
                <div className="_flex _flex-col _justify-center">
                  <p className="card-text _text-4xl">SALE: {el.sale}%</p>
                </div>
                <div className="_flex _flex-col _justify-end">
                  <p className="card-text _text-2xl">Author: {el.author}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
