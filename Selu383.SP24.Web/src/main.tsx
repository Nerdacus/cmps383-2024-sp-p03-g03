import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CachePolicies, Provider } from "use-http";

import Login from "./routes/auth-pages/login";
import MainLayout from "./routes/_layout";
import Signup from "./routes/auth-pages/signup";
import FindHotel from "./routes/hotel-pages/find-hotels";
import RoomListComponent from "./routes/hotel-pages/rooms";
import BookingForm from "./routes/hotel-pages/booking";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/find-hotel", element: <FindHotel /> },
  { path: "/rooms", element: <RoomListComponent /> },
  { path: "/booking", element: <BookingForm /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider options={{ cache: CachePolicies.NO_CACHE, cacheLife: 16 }}>
    <RouterProvider router={router} />
  </Provider>
);
