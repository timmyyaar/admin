import React, { useState } from "react";

function Payment() {
  const [price, setPrice] = useState("10");
  const [name, setName] = useState("Test");
  const [additional, setAdditional] = useState("Additional test");

  return (
    <div>
      <form method="get" action="https://sklep.przelewy24.pl/zakup.php">
        <input
          type="hidden"
          name="z24_id_sprzedawcy"
          value={process.env.REACT_APP_PAYMENT_ID}
        />
        <input
          type="hidden"
          name="z24_crc"
          value={process.env.REACT_APP_PAYMENT_ORDER_ID}
        />
        <input
          type="hidden"
          name="z24_return_url"
          value="https://www.takeutime.pl"
        />
        <input type="hidden" name="z24_language" value="pl" />
        <table>
          <tr>
            <td align="right">Введи название продукта:</td>
            <td>
              <input
                className="form-control"
                type="text"
                name="z24_nazwa"
                value={name}
                onChange={({ target: { value } }) => setName(value)}
              />
            </td>
          </tr>
          <tr>
            <td align="right">Введи чё-то ещё (додатковое):</td>
            <td>
              <textarea
                className="form-control"
                name="z24_opis"
                value={additional}
                onChange={({ target: { value } }) => setAdditional(value)}
              />
            </td>
          </tr>
          <tr>
            <td align="right">Введи гроши:</td>
            <td>
              <input
                className="form-control"
                type="text"
                name="z24_kwota"
                value={price}
                onChange={({ target: { value } }) => setPrice(value)}
              />
            </td>
          </tr>
        </table>
        <input
          className="btn btn-primary"
          type="submit"
          value="Плоти за миф"
        />
      </form>
    </div>
  );
}

export default Payment;
