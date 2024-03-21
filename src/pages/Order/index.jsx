import React, { useEffect, useState } from 'react';

import { Louder } from '../../components/Louder';

import { getOrders, deleteOrder } from './actions';

export const OrderPage = ({ subscription = false }) => {
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
      setOrders(data.order.filter(el => {
        if (subscription) return el.title === 'Subscription';
        else return el.title !== 'Subscription';
      }));
      setLoading(false);
    });
  }, [subscription, forceUpdate]);

  return (
    <div className="order-page">
      <Louder visible={loading} />
      <div className="_mt-8">
        {orders.map(el => (
          <div className="card _mb-3" key={el.id}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">#️⃣️ {el.id}</h5>
              <button type="button" className="btn btn-danger" onClick={() => onDeleteOrder(el.id)}>x</button>
            </div>
            <div className="card-body">
              <div>
                <div>
                  <p className="card-text _flex _flex-col">🦄 {el.name}</p>
                  <p className="card-text _flex _flex-col">📲 {el.number}</p>
                  <p className="card-text _flex _flex-col">📩 {el.email}</p>
                  <p className="card-text _flex _flex-col">📆 {el.date}</p>
                  <p className="card-text _flex _flex-col">📍 {el.address}</p>
                  <p className="card-text">💾 - {el.personaldata ? '✅' : '❌'}</p>
                  {el.requestpreviouscleaner ? '🧹предыдущий клинер' : null}
                  <p className="card-text">🔖 {el.price} zl {el.promo ? `(${el.promo})` : null}</p>
                  <p className="card-text">💸 {el.onlinepayment ? 'Online' : 'Cash'}</p>
                  <p className="card-text">⏳ {el.estimate}</p>
                  <br />
                </div>
                <div>
                  <p className="card-text">{el.title}:</p>
                  <p className="card-text">{el.counter}</p>
                  <p className="card-text">{el.subservice}</p>
                  {el.sectitle ? (
                    <div>
                      <p className="card-text">{el.sectitle}:</p>
                      <p className="card-text">{el.seccounter}</p>
                      <p className="card-text">{el.secsubservice}</p>
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
