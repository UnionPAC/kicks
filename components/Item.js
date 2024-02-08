import { useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducers";

const Item = ({ item, width, height }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [count, setCount] = useState(1);
  const { category, name, price, image } = item.attributes;

  const dispatch = useDispatch();

  return (
    <Box width={width}>
      <Box
        position="relative"
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
      >
        <Link href={`/item/${item.id}`}>
          <img
            src={image.data.attributes.formats.medium.url}
            alt={name}
            width={width}
            height={height}
            style={{ cursor: "pointer" }}
          />
        </Link>
        <Box
          display={isHovered ? "block" : "none"}
          position="absolute"
          bottom="10%"
          left="0"
          width="100%"
          padding="0 5%"
        >
          <Box display="flex" justifyContent="space-between">
            <Box
              display="flex"
              alignItems="center"
              bgcolor="#f5f5f5"
              borderRadius="4px"
              border="2px solid black"
              p="4px"
            >
              {/* Decrease count (not below 1) */}
              <IconButton onClick={() => setCount(Math.max(count - 1, 1))}>
                <RemoveIcon sx={{ color: "black", fontSize: "16px" }} />
              </IconButton>
              <Typography fontSize="14px" mx="6px">
                {count}
              </Typography>
              {/* Increase count */}
              <IconButton onClick={() => setCount(count + 1)}>
                <AddIcon sx={{ color: "black", fontSize: "16px" }} />
              </IconButton>
            </Box>
            {/* Add Item To Cart (including the count) */}
            <Button
              onClick={() => {
                dispatch(addToCart({ item: { ...item, count } }));
              }}
              sx={{
                backgroundColor: "#333",
                color: "white",
                fontSize: "12px",
                "&:hover": {
                  backgroundColor: "black",
                },
              }}
            >
              Add to Cart
            </Button>
          </Box>
        </Box>
      </Box>
      <Box mt="5px">
        <Typography
          color="rgb(129, 129, 129)"
          fontSize="14px"
          sx={{ letterSpacing: "1px" }}
        >
          {category
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())}
        </Typography>
        <Typography fontSize="16px" my="4px">
          {name}
        </Typography>
        <Typography
          fontWeight="bold"
          fontSize="16px"
          sx={{ letterSpacing: "1px" }}
        >
          ${price}
        </Typography>
      </Box>
    </Box>
  );
};

export default Item;
