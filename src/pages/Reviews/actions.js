export async function requestGetReviews() {
  const response = await fetch(process.env.REACT_APP_API_URL + "/api/reviews");

  return await response.json();
}

export async function requestAddReview(body) {
  const response = await fetch(process.env.REACT_APP_API_URL + "/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return await response.json();
}

export async function requestUpdateReview(id, body) {
  const response = await fetch(
    process.env.REACT_APP_API_URL + `/api/reviews/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  return await response.json();
}

export async function requestDeleteReview(id) {
  const response = await fetch(
    process.env.REACT_APP_API_URL + `/api/reviews/${id}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  );

  return await response.json();
}
