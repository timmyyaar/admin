export async function getPromo() {
  const response = await fetch(process.env.REACT_APP_API_URL + '/api/promo');
  const data = await response.json();
  return data.promo;
}

export async function addPromo(promo) {
  // const { code, author, sale } = req.body;
  const response = await fetch(process.env.REACT_APP_API_URL + '/api/promo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(promo),
  });

  const data = await response.json();
  return data.promo;
}

export async function deletePromo(id) {
  const response = await fetch(process.env.REACT_APP_API_URL + '/api/promo' + id, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();
  return data;
}
