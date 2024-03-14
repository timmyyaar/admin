import React, { useEffect, useState } from 'react';

import { Louder } from '../../components/Louder';

import { getOrders, deleteOrder } from './actions';

export const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  const toggleForceUpdate = () => setForceUpdate((fU) => !fU);

  const onDeleteOrder = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete the order permanently?');

    if (confirmed) {
      console.log(id);
      setLoading(true);
      deleteOrder({ id }).then(() => {
        setLoading(false);
        toggleForceUpdate();
      });
    }
  }

  useEffect(() => {
    setLoading(true);
    getOrders().then((data) => {
      setOrders(data.order);
      setLoading(false);
    });
  }, [forceUpdate]);

  return (
    <div className="order-page">
      <Louder visible={loading} />
      <div className="_mt-8">
        {orders.map(el => (
          <div className="card" key={el.id}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">#️⃣️ {el.id}</h5>
              <button type="button" className="btn btn-danger" onClick={() => onDeleteOrder(el.id)}>x</button>
            </div>
            <div className="card-body">
              <div className='_flex _justify-between'>
                <div>
                  <p className="card-text">📅️ {el.date}</p>
                  <p className="card-text">📍 {el.address}</p>
                  <p className="card-text">🔖 {el.price} zl {el.promo ? `(${el.promo})` : null}</p>
                  <p className="card-text">💸 {el.onlinePayment ? 'Online' : 'Cash'}</p>
                  <p className="card-text">⏳ {el.estimate}</p>
                </div>
                <div>
                  <p className="card-text">{el.title}:</p>
                  <p className="card-text">{el.counter}</p>
                  <p className="card-text">{el.subService}</p>
                  {el.secTitle ? (
                    <div>
                      <p className="card-text">{el.secTitle}:</p>
                      <p className="card-text">{el.secCounter}</p>
                      <p className="card-text">{el.secSubService}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
