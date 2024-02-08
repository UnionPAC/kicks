import {
  Box,
  IconButton,
  Typography,
  Button,
  Divider,
  Alert,
  AlertTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import styled from "@emotion/styled";
import { useSelector, useDispatch } from "react-redux";
import {
  setIsCartOpen,
  removeFromCart,
  decreaseCount,
  increaseCount,
} from "../../redux/reducers";
import { shades } from "@/theme";
import Link from "next/link";
import { useState } from "react";

// Extending the MUI Box component w/ @emotion/styled: https://emotion.sh/docs/styled
const FlexBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CartMenu = () => {
  const [isAlertActive, setIsAlertActive] = useState(false);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const isCartOpen = useSelector((state) => state.cart.isCartOpen);

  // get the total price of the items in the cart
  const totalPrice = cart.reduce((total, item) => {
    return total + item.count * item.attributes.price;
  }, 0);

  return (
    <Box
      display={isCartOpen ? "block" : "none"}
      bgcolor="rgba(0,0,0,0.4)"
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      zIndex="10"
      overflow="auto"
    >
      <Box
        position="fixed"
        bottom="0"
        right="0"
        height="100%"
        width="max(400px, 30%)"
        bgcolor="white"
      >
        <Box padding="30px" overflow="auto" height="100%">
          {isAlertActive && (
            <Box marginBottom="20px">
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                Must have items in the cart in order to checkout!
              </Alert>
            </Box>
          )}
          {/* Shopping Bag Title & Close Btn */}
          <FlexBox marginBottom="20px">
            <Typography variant="h3">SHOPPING BAG ({cart.length})</Typography>
            <IconButton onClick={() => dispatch(setIsCartOpen({}))}>
              <CloseIcon></CloseIcon>
            </IconButton>
          </FlexBox>
          {/* Cart List */}
          <Box>
            {cart.map((item) => {
              return (
                // example key: name-id
                <Box key={`${item.attributes.name}-${item.id}`}>
                  <FlexBox p="15px 0">
                    <Box flex="1 1 30%" paddingRight="10px">
                      <img
                        alt={item.attributes.name}
                        src={
                          item.attributes.image.data.attributes.formats.medium
                            .url
                        }
                        width={150}
                        height={150}
                      />
                    </Box>
                    <Box flex="1 1 60%">
                      {/* Product Name and Remove Item Btn */}
                      <FlexBox mb="5px">
                        <Typography fontWeight="bold">
                          {item.attributes.name}
                        </Typography>
                        <IconButton
                          onClick={() =>
                            dispatch(removeFromCart({ id: item.id }))
                          }
                          sx={{ padding: "5px" }}
                        >
                          <CloseIcon></CloseIcon>
                        </IconButton>
                      </FlexBox>
                      {/* Product Short Description */}
                      <Typography>
                        {item.attributes.shortDescription[0].children[0].text}
                      </Typography>
                      {/* Toggle Count & Item Price */}
                      <FlexBox m="15px 0">
                        <Box
                          display="flex"
                          alignItems="center"
                          border={`1.5px solid ${shades.neutral[500]}`}
                          p="4px"
                        >
                          <IconButton
                            onClick={() =>
                              dispatch(decreaseCount({ id: item.id }))
                            }
                          >
                            <RemoveIcon
                              sx={{ color: "black", fontSize: "16px" }}
                            />
                          </IconButton>
                          <Typography fontSize="14px" mx="6px">
                            {item.count}
                          </Typography>
                          <IconButton
                            onClick={() =>
                              dispatch(increaseCount({ id: item.id }))
                            }
                          >
                            <AddIcon
                              sx={{ color: "black", fontSize: "16px" }}
                            />
                          </IconButton>
                        </Box>
                        <Typography fontWeight="bold">
                          ${item.attributes.price}
                        </Typography>
                      </FlexBox>
                    </Box>
                  </FlexBox>
                  <Divider />
                </Box>
              );
            })}
          </Box>
          {/* Subtotal & Checkout Btn */}
          <Box m="20px 0">
            <FlexBox m="20px 0">
              <Typography fontWeight="bold">SUBTOTAL</Typography>
              <Typography fontWeight="bold">${totalPrice}</Typography>
            </FlexBox>
            <Link href={cart.length > 0 ? "/checkout" : "/"}>
              <Button
                sx={{
                  backgroundColor: shades.primary[400],
                  color: "white",
                  borderRadius: 0,
                  minWidth: "100%",
                  padding: "20px 40px",
                  m: "20px 0",
                }}
                onClick={() => {
                  if (cart.length > 0) {
                    dispatch(setIsCartOpen({}));
                  } else {
                    setIsAlertActive(true);
                    setTimeout(() => {
                      setIsAlertActive(false);
                    }, 5000);
                  }
                }}
              >
                Checkout
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CartMenu;
