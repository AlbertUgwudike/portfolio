import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Root from "./components/Root";
import { createBrowserRouter, createHashRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/HomePage";
import ECGPage from "./components/ECGPage/ECGPage";

const router = createHashRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/CV",
                element: <div></div>,
            },
            {
                path: "/ECGSim",
                element: <ECGPage />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
