import { useEffect, useState } from "react";
import { CartContextValue } from "./ContextProvider";
import { httpPostwithToken } from "./HttpConfig";
import { useNavigate } from "react-router-dom";
export default function CheckoutCart() {
  const [cartData, dispatch] = CartContextValue();
  const [paytype,setPaytype ]=useState("");
  const [address,setAddress]=useState("");
  const [optionData, setOptionData] = useState([
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
  ]);
  let history = useNavigate();
  const getTotalAmount = () => {
    return cartData.cartItems.reduce(
      (prevValue, currentValue) => prevValue + currentValue.price,
      0
    );
  };
  const getSubTotal = () => {
    return cartData.cartItems.map((obj) => obj.price);
  };
  const qty_change = (cartObj, e) => {
    // console.log(cartObj,e.target.value);
    // cartObj.qty
    let price = cartObj.price * e.target.value;
    let obj = { cartId: cartObj.id, qty: e.target.value, price: price };
    httpPostwithToken("addtocart/updateQtyForCart", obj)
      .then((res) => {
        res.json().then((data) => {
          if (res.ok) {
            dispatch({
              type: "add_cart",
              data: data,
            });
            alert("Successfully updated..");
          } else {
            alert(data.message);
          }
        });
      })
      .catch(function (res) {
        console.log("Error ", res);
        //alert(error.message);
      });
  };
  const checkout_order = () => {
    // console.log(cartObj,e.target.value);
    // cartObj.qty
    let totalAmount = getTotalAmount();

    var obj = {
      total_price: totalAmount, // geting total form here
      pay_type: paytype,
      deliveryAddress: address,
    };
    httpPostwithToken("order/checkout_order", obj)
      .then((res) => {
        res.json().then((data) => {
          if (res.ok) {
            alert("Order successfully placed....");
            history.push("/");
          } else {
            alert(data.message);
          }
        });
      })
      .catch(function (res) {
        console.log("Error ", res);
        //alert(error.message);
      });
  };
  return (
    <div className="typo codes icons main-grid-border">
      <div className="container">
        <div>
          <h1>Checkout Cart</h1>
              
          <div
            style={{ display: "block" }}
            id="w3lssbmincart"
            className="check-out-cart-wrap"
          >
            <ul>
              {cartData.cartItems.map((cartObj) => (
                <li
                  key={cartObj.id}
                  className="sbmincart-item sbmincart-item-changed"
                >
                  <div className="sbmincart-details-name">
                    <a className="sbmincart-name">{cartObj.productName}</a>
                    <ul className="sbmincart-attributes"></ul>
                  </div>
                  <div className="sbmincart-details-quantity">
                    <select
                      value={cartObj.qty}
                      onChange={(e) => qty_change(cartObj, e)}
                    >
                      {optionData.map((d) => (
                        <option>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sbmincart-details-remove">
                    <button
                      type="button"
                      className="sbmincart-remove"
                      data-sbmincart-idx="0"
                    >
                      ×
                    </button>
                  </div>
                  <div className="sbmincart-details-price">
                    <span className="sbmincart-price">{cartObj.price}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="sbmincart-footer">
              <div className="sbmincart-subtotal radio-wrap">
                <input
                  name="pay_type"
                  type="radio"
                  value="online"
                  onChange={(e) => setPaytype(e.target.value)}
                />
                <span>Online</span>
                <input
                  type="radio"
                  name="pay_type"
                  value="COD"
                  onChange={(e) => setPaytype(e.target.value)}
                />
                <span>Cash on Delivery</span>
              </div>
              <div className="sbmincart-subtotale">
                <label> Address </label>
                <br></br>
                <textarea
                  type="text"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="sbmincart-subtotal">
                Total : {getTotalAmount()}
                <div>
                  <br />
                  <button onClick={() => checkout_order()}>Place Order</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
