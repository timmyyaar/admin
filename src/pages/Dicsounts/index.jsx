import { Louder } from "../../components/Louder";
import React, { useEffect, useState } from "react";
import { request } from "../../utils";
import AddOrEditDiscountModal from "./AddOrEditDiscountModal";
import './Discounts.css'

function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [isDiscountsLoading, setIsDiscountsLoading] = useState(false);
  const [isAddDiscountModalOpened, setIsAddDiscountModalOpened] =
    useState(false);
  const [deletingDiscountIds, setDeletingDiscountIds] = useState([]);
  const [editingDiscount, setEditingDiscount] = useState(null);

  const getDiscounts = async () => {
    try {
      setIsDiscountsLoading(true);

      const discountsResponse = await request({ url: "discounts" });

      setDiscounts(discountsResponse);
    } finally {
      setIsDiscountsLoading(false);
    }
  };

  useEffect(() => {
    getDiscounts();
  }, []);

  const onDeleteDiscount = async (id) => {
    try {
      setDeletingDiscountIds((prev) => [...prev, id]);

      await request({ url: `discounts/${id}`, method: "DELETE" });

      setDiscounts((prev) => prev.filter((item) => item.id !== id));
    } finally {
      setDeletingDiscountIds((prev) => prev.filter((item) => item !== id));
    }
  };

  return (
    <div>
      <Louder visible={isDiscountsLoading} />
      <button
        className="btn btn-primary mb-3"
        onClick={() => setIsAddDiscountModalOpened(true)}
      >
        Add
      </button>
      {(isAddDiscountModalOpened || editingDiscount) && (
        <AddOrEditDiscountModal
          onClose={() => {
            setIsAddDiscountModalOpened(false);
            setEditingDiscount(null);
          }}
          setDiscounts={setDiscounts}
          editingDiscount={editingDiscount}
        />
      )}
      <div className="discounts-wrapper">
        {discounts.length > 0
          ? discounts.map(({ id, date, value }, i) => (
              <div key={id}>
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">{date}</h5>
                    <div className="d-flex">
                      <button
                        type="button"
                        title="Edit discount"
                        className="btn btn-primary _mr-2"
                        onClick={() => {
                          setEditingDiscount({ id, date, value });
                        }}
                      >
                        &#9998;
                      </button>
                      <button
                        type="button"
                        className={`btn btn-danger icon-button ${
                          deletingDiscountIds.includes(id) ? "loading" : ""
                        }`}
                        disabled={deletingDiscountIds.includes(id)}
                        onClick={() => onDeleteDiscount(id)}
                      >
                        {!deletingDiscountIds.includes(id) && <>&#10005;</>}
                      </button>
                    </div>
                  </div>
                  <div className="card-body _flex _justify-between">
                    <div className="_flex _flex-col _justify-center">
                      <p className="card-text _text-2xl">Discount: {value}%</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : "No discounts found"}
      </div>
    </div>
  );
}

export default Discounts;
