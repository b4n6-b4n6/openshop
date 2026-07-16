import { Route, Routes, type Location } from "react-router-dom";
import { OrderScreen } from "../screens/customer/OrderScreen";
import { Orders } from "../screens/customer/Orders";
import { Products } from "../screens/customer/Products";
import { PurchaseProduct } from "../screens/customer/PurchaseProduct";
import { ViewShop } from "../screens/customer/ViewShop";
import { Chat } from "../screens/shared/Chat";
import { Chats } from "../screens/shared/Chats";

export function OnionRoutes({ location }: { location?: Location }) {
  return (
    <Routes location={location}>
      <Route path="/" element={<ViewShop />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id/purchase" element={<PurchaseProduct />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/orders/:id" element={<OrderScreen />} />
      <Route path="/chats" element={<Chats />} />
      <Route path="/chats/:id" element={<Chat />} />
      <Route path="*" element={<ViewShop />} />
    </Routes>
  );
}
