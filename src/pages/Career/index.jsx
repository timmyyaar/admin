import React, { useEffect, useState } from "react";

import { Louder } from "../../components/Louder";

import { getCareers, deleteCareers } from "./actions";

export const CareerPage = () => {
  const [career, setCareers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  const toggleForceUpdate = () => setForceUpdate((fU) => !fU);

  const onDeleteCareer = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete the contact permanently?"
    );

    if (confirmed) {
      setLoading(true);
      deleteCareers({ id }).then(() => {
        setLoading(false);
        toggleForceUpdate();
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    getCareers().then((data) => {
      setCareers(data.careers);
      setLoading(false);
    });
  }, [forceUpdate]);

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
                className="btn btn-danger"
                onClick={() => onDeleteCareer(el.id)}
              >
                x
              </button>
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
