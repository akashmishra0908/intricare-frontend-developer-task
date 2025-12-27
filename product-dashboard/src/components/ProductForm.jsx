import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";

const ProductForm = ({ open, onClose, onSubmit, selectedProduct }) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
  });

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        title: selectedProduct.title || "",
        price: selectedProduct.price || "",
        category: selectedProduct.category || "",
        description: selectedProduct.description || "",
      });
    } else {
      setFormData({
        title: "",
        price: "",
        category: "",
        description: "",
      });
    }
  }, [selectedProduct, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {selectedProduct ? "Edit Product" : "Add Product"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {selectedProduct ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;
