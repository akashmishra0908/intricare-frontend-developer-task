import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Stack,
  Snackbar,
  MenuItem,
  TablePagination,
  IconButton,
  Menu,
  Box,
  useMediaQuery,
  useTheme
} from "@mui/material";

import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddIcon from '@mui/icons-material/Add';

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
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [anchorElSort, setAnchorElSort] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    setPage(0);
  }, [search, category, sortBy]);

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
        const newProduct = { ...res.data, id: Date.now() };
        setProducts([...products, newProduct]);

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

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || product.category === category;

    return matchesSearch && matchesCategory;
  })
    .sort((a, b) => {
      if (sortBy === "priceLowHigh") return a.price - b.price;
      if (sortBy === "priceHighLow") return b.price - a.price;
      return 0;
    });


  return (
    <Container sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={2} alignItems="center">
        <Typography variant="h5">
          {isMobile ? "Products" : "Product Dashboard"}
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          startIcon={!isMobile && <AddIcon />}
          sx={{ minWidth: isMobile ? 40 : 64, px: isMobile ? 1 : 2 }}
        >
          {isMobile ? <AddIcon /> : "Add Product"}
        </Button>
      </Stack>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: isMobile ? 1 : 2 }}
        />

        {isMobile ? (
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <IconButton onClick={(e) => setAnchorElFilter(e.currentTarget)}>
              <FilterListIcon color={category !== 'all' ? 'primary' : 'inherit'} />
            </IconButton>
            <Menu
              anchorEl={anchorElFilter}
              open={Boolean(anchorElFilter)}
              onClose={() => setAnchorElFilter(null)}
              disableScrollLock={true}
            >
              <MenuItem onClick={() => { setCategory("all"); setAnchorElFilter(null); }}>All</MenuItem>
              {[...new Set(products.map((p) => p.category))].map((cat) => (
                <MenuItem key={cat} onClick={() => { setCategory(cat); setAnchorElFilter(null); }}>
                  {cat}
                </MenuItem>
              ))}
            </Menu>

            <IconButton onClick={(e) => setAnchorElSort(e.currentTarget)}>
              <SortIcon color={sortBy !== 'default' ? 'primary' : 'inherit'} />
            </IconButton>
            <Menu
              anchorEl={anchorElSort}
              open={Boolean(anchorElSort)}
              onClose={() => setAnchorElSort(null)}
              disableScrollLock={true}
            >
              <MenuItem onClick={() => { setSortBy("default"); setAnchorElSort(null); }}>Default</MenuItem>
              <MenuItem onClick={() => { setSortBy("priceLowHigh"); setAnchorElSort(null); }}>Price: Low to High</MenuItem>
              <MenuItem onClick={() => { setSortBy("priceHighLow"); setAnchorElSort(null); }}>Price: High to Low</MenuItem>
            </Menu>

            <IconButton onClick={() => {
              setSearch("");
              setCategory("all");
              setSortBy("default");
            }}>
              <RestartAltIcon />
            </IconButton>
          </Stack>
        ) : (
          <Stack direction="row" gap={2}>
            <TextField
              select
              label="Filter by Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
            >
              <MenuItem value="all">All</MenuItem>
              {[...new Set(products.map((p) => p.category))].map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Sort by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
              <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
            </TextField>
            <Button
              variant="outlined"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setSortBy("default");
              }}
              sx={{ height: 56 }}
            >
              Reset
            </Button>
          </Stack>
        )}
      </Box>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <>
          <ProductList
            products={filteredProducts.slice(
              page * rowsPerPage,
              page * rowsPerPage + rowsPerPage
            )}
            onEdit={(p) => {
              setSelectedProduct(p);
              setOpen(true);
            }}
            onDelete={handleDelete}
          />
          <TablePagination
            component="div"
            count={filteredProducts.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
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
