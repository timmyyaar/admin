export async function getGifts() {
  const response = await fetch(process.env.REACT_APP_API_URL + "/api/gift", {
    credentials: "include",
  });
  const data = await response.json();
  return data;
}

export async function deleteGift(param) {
  const response = await fetch(process.env.REACT_APP_API_URL + "/api/gift", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(param),
    credentials: "include",
  });

  const data = await response.json();
  return data.gift;
}
