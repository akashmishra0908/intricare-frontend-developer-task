import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Stack,
  Snackbar
} from "@mui/material";

import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "./services/api";

import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      setProducts(res.data);
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (product) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, product);

        setProducts((prev) =>
          prev.map((p) =>
            p.id === selectedProduct.id ? { ...product, id: p.id } : p
          )
        );

        setSnackbar({
          open: true,
          message: "Product updated successfully",
          severity: "success",
        });
      } else {
        const res = await addProduct(product);
        setProducts([...products, res.data]);

        setSnackbar({
          open: true,
          message: "Product added successfully",
          severity: "success",
        });
      }

      closeDialog();
    } catch {
      setSnackbar({
        open: true,
        message: "Something went wrong",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));

      if (selectedProduct?.id === id) closeDialog();

      setSnackbar({
        open: true,
        message: "Product deleted successfully",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to delete product",
        severity: "error",
      });
    }
  };

  const closeDialog = () => {
    setSelectedProduct(null);
    setOpen(false);
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Product Dashboard</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Product
        </Button>
      </Stack>

      <TextField
        fullWidth
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <ProductList
          products={filteredProducts}
          onEdit={(p) => {
            setSelectedProduct(p);
            setOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      <ProductForm
        open={open}
        onClose={closeDialog}
        onSubmit={handleSave}
        selectedProduct={selectedProduct}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
