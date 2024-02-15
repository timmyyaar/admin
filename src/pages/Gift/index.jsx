import React, { useEffect, useState } from 'react';

import { Louder } from '../../components/Louder';

import { getCareers, deleteCareers } from './actions';

export const GiftPage = () => {
  const [career, setCareers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  const toggleForceUpdate = () => setForceUpdate((fU) => !fU);

  const onDeleteCareer = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete the contact permanently?');

    if (confirmed) {
      setLoading(true);
      deleteCareers({ id }).then(() => {
        setLoading(false);
        toggleForceUpdate();
      });
    }
  }

  useEffect(() => {
    setLoading(true);
    getCareers().then((data) => {
      setCareers(data.gift);
      setLoading(false);
    });
  }, [forceUpdate]);
 // fEmail, fPhone, comment, sEmail, sName
  return (
    <div className="career-page">
      <Louder visible={loading} />
      <div className="_mt-8">
        {career.map((el, i) => (
          <div className="card" key={el.id}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">{'Gift ' + (i + 1)}</h5>
              <button type="button" className="btn btn-danger" onClick={() => onDeleteCareer(el.id)}>x</button>
            </div>
            <div className="card-body">
              <p className="card-text">Phone: {el.fEmail}</p>
              <p className="card-text">Email: {el.fPhone}</p>
              <p className="card-text">About: {el.comment}</p>
              <p className="card-text">Phone: {el.sEmail}</p>
              <p className="card-text">Email: {el.sName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
