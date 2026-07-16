import { Route, Routes, type Location } from "react-router-dom";
import { BrowseError } from "../screens/BrowseError";
import { BrowseInput } from "../screens/BrowseInput";
import { Connecting } from "../screens/Connecting";
import { CreateShop } from "../screens/CreateShop";
import { Initial } from "../screens/Initial";
import { ShopOpening } from "../screens/ShopOpening";
import { Splash } from "../screens/Splash";
import { AddProduct } from "../screens/owner/AddProduct";
import { EditProduct } from "../screens/owner/EditProduct";
import { EditShop } from "../screens/owner/EditShop";
import { MyOrders } from "../screens/owner/MyOrders";
import { MyProducts } from "../screens/owner/MyProducts";
import { MyShop } from "../screens/owner/MyShop";
import { Chat } from "../screens/shared/Chat";
import { Chats } from "../screens/shared/Chats";

export function LocalRoutes({ location }: { location?: Location }) {
  return (
    <Routes location={location}>
      <Route path="/" element={<Splash />} />
      <Route path="/welcome" element={<Initial />} />
      <Route path="/browse" element={<BrowseInput />} />
      <Route path="/browse/connecting" element={<Connecting />} />
      <Route path="/browse/error" element={<BrowseError />} />
      <Route path="/create" element={<CreateShop />} />
      <Route path="/create/opening" element={<ShopOpening />} />
      <Route path="/shop" element={<MyShop />} />
      <Route path="/shop/edit" element={<EditShop />} />
      <Route path="/shop/products" element={<MyProducts />} />
      <Route path="/shop/products/new" element={<AddProduct />} />
      <Route path="/shop/products/:id/edit" element={<EditProduct />} />
      <Route path="/shop/orders" element={<MyOrders />} />
      <Route path="/shop/chats" element={<Chats />} />
      <Route path="/shop/chats/:id" element={<Chat />} />
      <Route path="*" element={<Initial />} />
    </Routes>
  );
}
