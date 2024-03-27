import React, { useEffect, useState } from "react";

import { Louder } from "../../components/Louder";

import { request } from "../../utils";

export const PromoPage = () => {
  const [promo, setPromo] = useState([]);
  const [newPromo, setNewPromo] = useState(false);
  const [loading, setLoading] = useState(false);

  const [code, setCode] = useState("");
  const [author, setAuthor] = useState("");
  const [sale, setSale] = useState("");
  const [deletingPromoIds, setDeletingPromoIds] = useState([]);
  const [isAddPromoLoading, setIsAddPromoLoading] = useState(false);

  const isAddNewPromoEnabled = code && author && sale;

  const addNewPromo = async () => {
    if (isAddNewPromoEnabled) {
      try {
        setIsAddPromoLoading(true);

        const newPromo = await request({
          url: "promo",
          method: "POST",
          body: { code, author, sale },
        });

        setPromo((prev) => [...prev, newPromo]);
        setNewPromo(false);
      } finally {
        setIsAddPromoLoading(false);
      }
    }
  };

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
      <span
        className="input-group-text btn btn-success"
        onClick={() => setNewPromo(true)}
      >
        Add
      </span>
      {newPromo ? (
        <div className="card" style={{ marginTop: "8px" }}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <button
              type="button"
              className={`btn btn-success d-flex align-items-center ${
                isAddPromoLoading ? "loading" : ""
              }`}
              disabled={isAddPromoLoading || !isAddNewPromoEnabled}
              onClick={addNewPromo}
            >
              Create
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setNewPromo(false)}
            >
              &#10005;
            </button>
          </div>
          <div className="card-body">
            <input
              type="text"
              className="form-control _mb-2"
              placeholder="Code:"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <input
              type="text"
              className="form-control _mb-2"
              placeholder="Author:"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <input
              type="text"
              className="form-control _mb-2"
              placeholder="Sale:"
              value={sale}
              onChange={(e) => setSale(e.target.value)}
            />
          </div>
        </div>
      ) : null}
      <hr />
      <div className="_grid _grid-cols-2 _gap-4 ">
        {promo.map((el, i) => (
          <div key={JSON.stringify(el) + i + el.id}>
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">{el.code}</h5>
                <button
                  type="button"
                  className={`btn btn-danger icon-button ${
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
