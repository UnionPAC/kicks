import { useState, useEffect } from "react";
import { Box, Typography, Tabs, Tab, useMediaQuery } from "@mui/material";
import Item from "../Item";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "@/redux/reducers";
import { STRAPI_URL } from "@/constants";

const ShoppingList = () => {
  const [value, setValue] = useState("all");
  const items = useSelector((state) => state.cart.items);
  const breakPoint = useMediaQuery("(min-width:600px)");
  const dispatch = useDispatch();

  // https://mui.com/material-ui/react-tabs/
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // we need to get all the items so we can render an Item component for each item
  const getAllItems = async () => {
    try {
      // fetch from strapi cloud
      // const res = await fetch();
      // const data = await res.json();
      // // console.log(data);
      // dispatch(setItems(data.data));

      const res = await fetch(`${STRAPI_URL}api/items?populate=image`);
      const data = await res.json();
      dispatch(setItems(data.data));
    } catch (error) {
      console.log(error);
    }
  };

  // filtered categories
  const newArrivalItems = items.filter(
    (item) => item.attributes.category === "newArrivals"
  );

  const bestSellerItems = items.filter(
    (item) => item.attributes.category === "bestSellers"
  );

  const topRatedItems = items.filter(
    (item) => item.attributes.category === "topRated"
  );

  useEffect(() => {
    getAllItems();
  }, []);

  return (
    <div id="shop">
      <Box width="67%" margin="80px auto">
        <Typography variant="h2" textAlign="center" mb="15px">
          Featured Sneakers
        </Typography>
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          sx={{
            marginBottom: "50px",
            "& .MuiTabs-flexContainer": { flexWrap: "wrap" },
          }}
          indicatorColor="primary"
          textColor="primary"
          TabIndicatorProps={{ sx: { display: breakPoint ? "block" : "none" } }}
        >
          <Tab label="All" value="all" />
          <Tab label="New Arrivals" value="newArrivals" />
          <Tab label="Best Sellers" value="bestSellers" />
          <Tab label="Top Rated" value="topRated" />
        </Tabs>
        <Box
          margin="0 auto"
          display="grid"
          gridTemplateColumns="repeat(auto-fill, 330px)"
          justifyContent="space-around"
          rowGap="100px"
          columnGap="1.5%"
          marginBottom="100px"
        >
          {/* Filter:  All */}
          {value === "all" &&
            items.map((item) => {
              // console.log(item);
              return (
                <Item item={item} key={item.id} width={300} height={300} />
              );
            })}
          {/* Filter:  New Arrivals */}
          {value === "newArrivals" &&
            newArrivalItems.map((item) => (
              <Item item={item} key={item.id} width={300} height={300} />
            ))}
          {/* Filter:  Best Sellers */}
          {value === "bestSellers" &&
            bestSellerItems.map((item) => (
              <Item item={item} key={item.id} width={300} height={300} />
            ))}
          {/* Filter:  Top Rated */}
          {value === "topRated" &&
            topRatedItems.map((item) => (
              <Item item={item} key={item.id} width={300} height={300} />
            ))}
        </Box>
      </Box>
    </div>
  );
};

export default ShoppingList;
