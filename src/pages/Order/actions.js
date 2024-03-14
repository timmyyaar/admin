export async function getOrders() {
  const response = await fetch(process.env.REACT_APP_API_URL + '/api/order');
  const data = await response.json();
  return data;
}

export async function deleteOrder(param) {
  const response = await fetch(process.env.REACT_APP_API_URL + '/api/order', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(param),
  });
  const data = await response.json();
  return data;
}
