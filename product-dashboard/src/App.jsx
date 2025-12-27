import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Stack,
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
    if (selectedProduct) {
      await updateProduct(selectedProduct.id, product);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedProduct.id ? { ...product, id: p.id } : p
        )
      );
    } else {
      const res = await addProduct(product);
      setProducts([...products, res.data]);
    }
    closeDialog();
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setProducts(products.filter((p) => p.id !== id));
    if (selectedProduct?.id === id) closeDialog();
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
    </Container>
  );
}

export default App;
