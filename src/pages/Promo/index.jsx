import React, { useEffect, useState } from 'react';

import { Louder } from '../../components/Louder';

import { getPromo, addPromo } from './actions';

export const PromoPage = () => {
  const [promo, setPromo] = useState([]);
  const [newPromo, setNewPromo] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  const [code, setCode] = useState('');
  const [author, setAuthor] = useState('');
  const [sale, setSale] = useState('');

  const toggleForceUpdate = () => setForceUpdate((fU) => !fU);

  const addNewPromo = () => {
    if (code && author && sale) {
      setLoading(true);
      addPromo({ code, author, sale }).then(d => {
        setTimeout(() => {
          setLoading(false);
          setCode('');
          setAuthor('');
          setSale('');
          setNewPromo(false);
          toggleForceUpdate();
        }, 500);
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    getPromo().then((promo) => {
      setPromo(promo);
      setLoading(false);
    });
  }, [forceUpdate]);

  return (
    <div className="promo-page">
      <Louder visible={loading} />
      <span className="input-group-text btn btn-success" onClick={() => setNewPromo(true)}>
        Add
      </span>
      {newPromo ? (
        <div className="card" style={{ marginTop: '8px' }}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <button type="button" className="btn btn-success" onClick={addNewPromo}>create</button>
            <button type="button" className="btn btn-danger" onClick={() => setNewPromo(false)}>x</button>
          </div>
          <div className="card-body">
            <input
              type="text" className="form-control _mb-2" placeholder="Code:"
              value={code} onChange={(e) => setCode(e.target.value)}
            />
            <input
              type="text" className="form-control _mb-2" placeholder="Author:"
              value={author} onChange={(e) => setAuthor(e.target.value)}
            />
            <input
              type="text" className="form-control _mb-2" placeholder="Sale:"
              value={sale} onChange={(e) => setSale(e.target.value)}
            />
          </div>
        </div>
      ) : null}
      <hr />
      {console.log(promo)}
      <div className="_grid _grid-cols-2 _gap-4 ">
        {promo.map((el, i) => (
          <div key={JSON.stringify(el) + i + el.id}>
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">{el.code}</h5>
                <button type="button" className="btn btn-danger">x</button>
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
