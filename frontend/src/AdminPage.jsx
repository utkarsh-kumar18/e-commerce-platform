import { useEffect, useState } from "react";

const API_URL = "https://e-commerce-platform-2qvq.onrender.com/api";

function getUserRole() {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
}

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token || getUserRole() !== "admin") {
      window.location.href = "/";
      return;
    }

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load products");
      }

      setProducts(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      stock: "",
    });

    setEditingId(null);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setMessage("Product name is required");
      return;
    }

    if (Number(form.price) < 0 || Number(form.stock) < 0) {
      setMessage("Price and stock cannot be negative");
      return;
    }

    const url = editingId
      ? `${API_URL}/products/${editingId}`
      : `${API_URL}/products`;

    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          category: form.category,
          image: form.image,
          stock: Number(form.stock),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      setMessage(
        editingId
          ? "Product updated successfully"
          : "Product added successfully"
      );

      resetForm();
      await fetchProducts();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const editProduct = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      category: product.category || "",
      image: product.image || "",
      stock: product.stock ?? "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete product");
      }

      setMessage("Product deleted successfully");

      if (editingId === id) {
        resetForm();
      }

      await fetchProducts();
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (!token || getUserRole() !== "admin") {
    return null;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Inventory Management</p>
        </div>

        <div className="admin-header-buttons">
          <button
            className="admin-home-button"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            ← Store
          </button>

          <button
            className="admin-logout-button"
            onClick={() => {
              sessionStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {message && (
        <div className="admin-message">
          {message}
        </div>
      )}

      <div className="admin-form-card">
        <div className="admin-form-header">
          <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>

          {editingId && (
            <button
              className="admin-cancel-button"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-grid">
            <div className="admin-field">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-field">
              <label>Category</label>
              <input
                type="text"
                name="category"
                placeholder="e.g. Electronics"
                value={form.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-field">
              <label>Price (A$)</label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-field">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                min="0"
                step="1"
                placeholder="0"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="admin-field">
            <label>Image URL</label>
            <input
              type="url"
              name="image"
              placeholder="https://example.com/product-image.jpg"
              value={form.image}
              onChange={handleChange}
            />
          </div>

          <div className="admin-field">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter product description"
              value={form.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <button
            className="admin-submit-button"
            type="submit"
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      <div className="admin-products-card">
        <div className="admin-products-header">
          <h2>Inventory</h2>
          <span>{products.length} Products</span>
        </div>

        {loading ? (
          <p className="admin-loading">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="admin-empty">No products available.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.name}</strong>
                      <small>
                        ID: #{product.id}
                      </small>
                    </td>

                    <td>
                      <span className="admin-category">
                        {product.category || "Uncategorized"}
                      </span>
                    </td>

                    <td>
                      A${Number(product.price).toFixed(2)}
                    </td>

                    <td>
                      <span
                        className={
                          Number(product.stock) === 0
                            ? "stock-out"
                            : Number(product.stock) <= 5
                            ? "stock-low"
                            : "stock-good"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td>
                      <div className="admin-actions">
                        <button
                          className="edit-product-button"
                          onClick={() => editProduct(product)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-product-button"
                          onClick={() =>
                            deleteProduct(product.id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;