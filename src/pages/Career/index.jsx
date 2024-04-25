import React, { useEffect, useState } from "react";

import { Louder } from "../../components/Louder";

import { request } from "../../utils";

export const CareerPage = () => {
  const [career, setCareers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingIds, setDeleteLoadingIds] = useState([]);
  const [deleteError, setDeleteError] = useState(false);

  const onDeleteCareer = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete the contact permanently?"
    );

    if (confirmed) {
      try {
        setDeleteLoadingIds((prev) => [...prev, id]);

        await request({ url: `career/${id}`, method: "DELETE" });

        setCareers((prev) => prev.filter((career) => career.id !== id));
      } catch (error) {
        setDeleteError(error.message);
      } finally {
        setDeleteLoadingIds((prev) => prev.filter((item) => item !== id));
      }
    }
  };

  const getCareers = async () => {
    try {
      setLoading(true);

      const careersResponse = await request({ url: "careers" });

      setCareers(careersResponse);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCareers();
  }, []);

  return (
    <div className="career-page">
      <Louder visible={loading} />
      <div className="_mt-8">
        {career.map((el) => (
          <div className="card _mb-3" key={el.id}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">{el.name}</h5>
              <button
                type="button"
                className={`btn btn-danger icon-button ${
                  deleteLoadingIds.includes(el.id) ? "loading" : ""
                }`}
                onClick={() => onDeleteCareer(el.id)}
              >
                {deleteLoadingIds.includes(el.id) ? "" : <>&#10005;</>}
              </button>
              {deleteError && (
                <span className="text-danger">{deleteError}</span>
              )}
            </div>
            <div className="card-body">
              <p className="card-text">Phone: {el.phone}</p>
              <p className="card-text">Email: {el.email}</p>
              <p className="card-text">About: {el.about}</p>
              {el.referral_code && (
                <p className="card-text">Referral code: {el.referral_code}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
