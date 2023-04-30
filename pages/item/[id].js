import { Box, Button, IconButton, Typography, Tabs, Tab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Item from "@/components/Item";
import { addToCart } from "../../redux/reducers";
import { useDispatch } from "react-redux";

const ItemPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const itemId = router.query.id;
  const [count, setCount] = useState(1);
  const [value, setValue] = useState("description");
  const [item, setItem] = useState(null);
  const [items, setItems] = useState([]);
  const [clicked, setClicked] = useState(false);

  // how are we going to get the individual item's info?
  const getItem = async () => {
    // /api/items/:id
    // how to get the id?
    // we can use useRouter from next/router
    const res = await fetch(
      `https://strapi-ygb4.onrender.com/api/items/${itemId}?populate=image`,
      { method: "GET" }
    );
    const data = await res.json();
    // console.log(data);
    setItem(data.data);
  };

  // get all items in order to display related products
  const getAllItems = async () => {
    const res = await fetch("https://strapi-ygb4.onrender.com/api/items?populate=image");
    const data = await res.json();
    console.log(data);
    setItems(data.data);
  };

  // https://mui.com/material-ui/react-tabs/
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = () => {
    setClicked(!clicked);
  };

  useEffect(() => {
    getItem();
    getAllItems();
  }, [itemId]);

  return (
    <Box width="80%" margin="120px auto">
      {/* Item Details */}
      <Box display="flex" flex="wrap" columnGap="40px">
        {/* Left: Item Image */}
        <Box flex="1 1 30%" marginBottom="40px">
          <img
            src={`https://strapi-ygb4.onrender.com${item?.attributes?.image?.data?.attributes?.formats?.medium?.url}`}
            alt={item?.attributes?.name}
            width={480}
            height={480}
            style={{ objectFit: "contain" }}
          />
        </Box>
        {/* Right: Item Content */}
        <Box flex="1 1 60%" marginBottom="40px">
          <Box margin="15px 0">
            <Typography variant="h3">{item?.attributes?.name}</Typography>
            <Typography margin="10px 0" fontSize="18px" fontWeight="bold">
              ${item?.attributes?.price}
            </Typography>
            <Typography marginTop="20px" width="80%">
              {item?.attributes?.shortDescription}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" minHeight="50px">
            <Box
              display="flex"
              alignItems="center"
              border="1px solid #e2e1e1"
              marginRight="20px"
              padding="2px 5px"
            >
              <IconButton onClick={() => setCount(Math.max(count - 1, 1))}>
                <RemoveIcon sx={{ fontSize: "17px" }} />
              </IconButton>
              <Typography fontSize="16px" mx="6px">
                {count}
              </Typography>
              <IconButton onClick={() => setCount(count + 1)}>
                <AddIcon sx={{ fontSize: "17px" }} />
              </IconButton>
            </Box>
            <Button
              onClick={() => dispatch(addToCart({ item: { ...item, count } }))}
              sx={{
                backgroundColor: "#222",
                color: "white",
                borderRadius: "0px",
                minWidth: "150px",
                padding: "10px 40px",
              }}
            >
              Add to Cart
            </Button>
          </Box>
          <Box>
            <Typography
              color="rgb(129, 129, 129)"
              fontSize="14px"
              sx={{ letterSpacing: "1px" }}
              margin="20px 0"
            >
              CATEGORY:{" "}
              {item?.attributes?.category
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </Typography>
            <Box display="flex">
              {/* <FavoriteBorderIcon
                onClick={handleClick}
                style={{ color: clicked ? "red" : "black", cursor: "pointer" }}
              /> */}
              {clicked ? (
                <FavoriteIcon
                  style={{ color: "red", cursor: "pointer", fontSize: "26px" }}
                  onClick={handleClick}
                />
              ) : (
                <FavoriteBorderIcon
                  style={{ cursor: "pointer", fontSize: "26px" }}
                  onClick={handleClick}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      {/* Description / Reviews Toggle */}
      <Box margin="10px 0 30px 0">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Description" value="description" />
          <Tab label="Reviews" value="reviews" />
        </Tabs>
      </Box>
      {/* Description/ Reviews Content*/}
      <Box display="flex" flex="wrap" gap="15px">
        {/* {item?.attributes?.longDescription} */}
        {value === "description" && (
          <div>{item?.attributes?.longDescription}</div>
        )}
        {value === "reviews" && (
          <div style={{ marginLeft: "10px" }}>No Reviews Yet</div>
        )}
      </Box>
      {/* Related Products */}
      <Box marginTop="50px" width="100%">
        <Typography
          textTransform="uppercase"
          variant="h3"
          fontWeight="bold"
          marginBottom="40px"
        >
          Recommended For You
        </Typography>
        {/* Map items to Item */}
        <Box
          marginTop="20px"
          display="flex"
          flexWrap="wrap"
          columnGap="1%"
          justifyContent="space-between"
        >
          {items.slice(0, 5).map((item, index) => (
            <Item item={item} key={item.id} width={280} height={280} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ItemPage;
