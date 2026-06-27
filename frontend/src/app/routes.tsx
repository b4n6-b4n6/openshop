import { Route, Routes, type Location } from "react-router-dom";
import { Splash } from "../screens/Splash";
import { Initial } from "../screens/Initial";
import { BrowseInput } from "../screens/BrowseInput";
import { Connecting } from "../screens/Connecting";
import { BrowseError } from "../screens/BrowseError";
import { CreateShop } from "../screens/CreateShop";
import { ShopOpening } from "../screens/ShopOpening";
// owner
import { MyShop } from "../screens/owner/MyShop";
import { EditShop } from "../screens/owner/EditShop";
import { MyProducts } from "../screens/owner/MyProducts";
import { AddProduct } from "../screens/owner/AddProduct";
import { EditProduct } from "../screens/owner/EditProduct";
import { MyOrders } from "../screens/owner/MyOrders";
// customer
import { ViewShop } from "../screens/customer/ViewShop";
import { Products } from "../screens/customer/Products";
import { PurchaseProduct } from "../screens/customer/PurchaseProduct";
import { OrderScreen } from "../screens/customer/OrderScreen";
import { Orders } from "../screens/customer/Orders";
// shared
import { Chats } from "../screens/shared/Chats";
import { Chat } from "../screens/shared/Chat";

export function AppRoutes({ location }: { location?: Location }) {
  return (
    <Routes location={location}>
      {/* boot & initial */}
      <Route path="/" element={<Splash />} />
      <Route path="/welcome" element={<Initial />} />
      <Route path="/browse" element={<BrowseInput />} />
      <Route path="/browse/connecting" element={<Connecting />} />
      <Route path="/browse/error" element={<BrowseError />} />
      <Route path="/create" element={<CreateShop />} />
      <Route path="/create/opening" element={<ShopOpening />} />

      {/* owner */}
      <Route path="/shop" element={<MyShop />} />
      <Route path="/shop/edit" element={<EditShop />} />
      <Route path="/shop/products" element={<MyProducts />} />
      <Route path="/shop/products/new" element={<AddProduct />} />
      <Route path="/shop/products/:id/edit" element={<EditProduct />} />
      <Route path="/shop/orders" element={<MyOrders />} />
      <Route path="/shop/chats" element={<Chats />} />
      <Route path="/shop/chats/:id" element={<Chat />} />

      {/* customer */}
      <Route path="/s/:onion" element={<ViewShop />} />
      <Route path="/s/:onion/products" element={<Products />} />
      <Route path="/s/:onion/products/:id/purchase" element={<PurchaseProduct />} />
      <Route path="/s/:onion/orders" element={<Orders />} />
      <Route path="/s/:onion/orders/:id" element={<OrderScreen />} />
      <Route path="/s/:onion/chats" element={<Chats />} />
      <Route path="/s/:onion/chats/:id" element={<Chat />} />

      {/* fallback */}
      <Route path="*" element={<Initial />} />
    </Routes>
  );
}
