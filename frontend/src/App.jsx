import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  const path = window.location.pathname;
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetch("https://e-commerce-platform-2qvq.onrender.com/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
        setLoading(false);
      });
  }, []);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        if (existingProduct.quantity >= product.stock) {
          alert("No more stock available");
          return currentCart;
        }

        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      if (product.stock <= 0) {
        alert("Product is out of stock");
        return currentCart;
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const checkout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      // Calculate cart total
      const totalAmount = cart.reduce(
        (total, item) =>
          total + Number(item.price) * item.quantity,
        0
      );

      // 1. Create order
      const orderResponse = await fetch(
        "https://e-commerce-platform-2qvq.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            total_amount: totalAmount,
          }),
        }
      );

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(
          orderData.message || "Failed to create order"
        );
      }

      const orderId = orderData.orderId;

      // 2. Create order items
      for (const item of cart) {
        const itemResponse = await fetch(
          "https://e-commerce-platform-2qvq.onrender.com/api/order-items",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order_id: orderId,
              product_id: item.id,
              quantity: item.quantity,
              price: Number(item.price),
            }),
          }
        );

        const itemData = await itemResponse.json();

        if (!itemResponse.ok) {
          throw new Error(
            itemData.error ||
              itemData.message ||
              "Failed to create order item"
          );
        }
      }

      // 3. Create Stripe Checkout Session
      const paymentResponse = await fetch(
        "https://e-commerce-platform-2qvq.onrender.com/api/payment/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderId,
            amount: totalAmount,
          }),
        }
      );

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(
          paymentData.error ||
            paymentData.message ||
            "Failed to create payment"
        );
      }

      // 4. Redirect to Stripe
      window.location.href = paymentData.url;
    } catch (error) {
      console.error("Checkout error:", error);
      alert(error.message);
    }
  };

  if (path === "/" && !token) {
    return <LoginPage />;
  }

  if (path === "/login") {
    return <LoginPage />;
  }

  if (path === "/register") {
    return <RegisterPage />;
  }

  if (path === "/orders") {
    return <OrdersPage />;
  }

  if (path === "/payment-success") {
    const orderId = new URLSearchParams(window.location.search).get("order_id");

    return (
      <div className="success-page">
        <div className="success-card">

          <div className="success-icon">🎉</div>

          <h1>Payment Successful!</h1>

          <p className="success-message">
            Your payment has been completed successfully.
          </p>

          <div className="success-details">
            {orderId && (
              <p>
                <strong>Order Number:</strong> #{orderId}
              </p>
            )}

            <p>Thank you for your purchase.</p>
            <p>Your order is now being processed.</p>
          </div>

          <div className="success-actions">
            <button
              className="success-primary"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              🛍️ Continue Shopping
            </button>

            <button
              className="success-secondary"
              onClick={() => {
                window.location.href = "/orders";
              }}
            >
              📦 View My Orders
            </button>
          </div>

        </div>
      </div>
    );
  }

  if (path === "/payment-cancel") {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>Payment Cancelled</h1>
        <p>Your payment was cancelled.</p>

        <button onClick={() => (window.location.href = "/")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
    <header className="app-header">  
      <h1 className="main-title">E-Commerce Platform</h1>
      {sessionStorage.getItem("token") ? (
        <>
          <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
            <button onClick={() => {
              sessionStorage.removeItem("token");
              window.location.href = "/login";
            }}>
              Logout
            </button>

            <button onClick={() => {
              window.location.href = "/orders";
            }}>
              📦 My Orders
            </button>
          </div>
        </>
      ) : (
        <button onClick={() => {
          window.location.href = "/login";
        }}>
          Login
        </button>
      )}
    </header>

      <h2 className="section-title">Products</h2>

      <div className="cart-container">
        <h2>
          🛒 Cart:{" "}
          {cart.reduce(
            (total, item) => total + item.quantity,
            0
          )}{" "}
          items
        </h2>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div>
                  <strong>{item.name}</strong>

                  <p>
                    A${Number(item.price).toFixed(2)}
                  </p>

                  <div className="quantity-controls">
                    <button
                      className="quantity-button"
                      onClick={() => {
                        setCart((currentCart) =>
                          currentCart
                            .map((product) =>
                              product.id === item.id
                                ? {
                                    ...product,
                                    quantity: product.quantity - 1,
                                  }
                                : product
                            )
                            .filter((product) => product.quantity > 0)
                        );
                      }}
                    >
                      −
                    </button>

                    <span className="quantity-number">
                      {item.quantity}
                    </span>

                    <button
                      className="quantity-button"
                      onClick={() => {
                        setCart((currentCart) =>
                          currentCart.map((product) => {
                            if (product.id !== item.id) {
                              return product;
                            }

                            if (product.quantity >= product.stock) {
                              alert("No more stock available");
                              return product;
                            }

                            return {
                              ...product,
                              quantity: product.quantity + 1,
                            };
                          })
                        );
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="remove-button"
                  onClick={() => {
                    setCart((currentCart) =>
                      currentCart.filter(
                        (product) => product.id !== item.id
                      )
                    );
                  }}
                >
                  Remove
                </button>
              </div>
            ))}

            <h3 className="cart-total">
              Total: A$
              {cart
                .reduce(
                  (total, item) =>
                    total +
                    Number(item.price) * item.quantity,
                  0
                )
                .toFixed(2)}
            </h3>

            <button
              className="checkout-button"
              onClick={checkout}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="products-grid"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {products.map((product) => {
            const cartItem = cart.find(
              (item) => item.id === product.id
            );

            const remainingStock =
              product.stock -
              (cartItem?.quantity || 0);

            return (
              <div className="product-card" key={product.id}>

                <h3>{product.name}</h3>

                <p className="product-description">
                  {product.description}
                </p>

                <p className="product-price">
                  <strong>
                    A${Number(product.price).toFixed(2)}
                  </strong>
                </p>

                <p className="stock">
                  Stock: {remainingStock}
                </p>

                <button
                  onClick={() => addToCart(product)}
                  disabled={remainingStock <= 0}
                >
                  {remainingStock <= 0
                    ? "Out of Stock"
                    : "Add to Cart"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      window.location.href = "/";
      return;
    }

    fetch("https://e-commerce-platform-2qvq.onrender.com/api/orders/my-orders", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch orders"
          );
        }

        return data;
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch orders:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app-container">

      <div className="orders-container">

        <button
          className="back-button"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          ← Back to Home
        </button>

        <h1 className="orders-title">
          📦 My Orders
        </h1>

        {orders.map((order) => (
          <div className="order-card" key={order.id}>
            <h2>Order #{order.id}</h2>

            <p>
              <strong>Total:</strong> A${order.total_amount}
            </p>

            <p>
              <strong>Order Status:</strong>{" "}
              {order.status}
            </p>

            <p>
              <strong>Payment:</strong>{" "}
              {order.payment_status}
            </p>

            <p>
              <strong>Created:</strong>{" "}
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://e-commerce-platform-2qvq.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      sessionStorage.setItem("token", data.token);

      alert("Login successful!");

      window.location.href = "/";
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
      <h1>🔐 Welcome Back</h1>

      <form onSubmit={login}>
        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="auth-button" type="submit">
          Login
        </button>
        <br />

        <button
          className="auth-secondary"
          type="button"
          onClick={() => {
            window.location.href = "/register";
          }}
        >
          Register
        </button>

      </form>
      </div>
    </div>
  );
}

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://e-commerce-platform-2qvq.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration successful!");

      window.location.href = "/login";
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
      <h1>🛍️ Create Account</h1>

      <form onSubmit={register}>
        <input
          className="auth-input"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <br />
        

        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br />
        

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br />
        <br />

        <button className="auth-button" type="submit">
          Register
        </button>
      </form>

      <button
        className="auth-secondary"
        onClick={() => {
          window.location.href = "/login";
        }}
      >
        Back to Login
      </button>
      </div>
    </div>
  );
}

export default App;