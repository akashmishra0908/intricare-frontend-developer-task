import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Stack,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductList = ({ products, onEdit, onDelete }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Price</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.title}</TableCell>
            <TableCell>${product.price}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onEdit(product)}
                >
                  <EditIcon />
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => onDelete(product.id)}
                >
                  <DeleteIcon />
                </Button>
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductList;
