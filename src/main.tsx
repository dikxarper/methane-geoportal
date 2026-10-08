import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import "./i18n";
import { AppThemeProvider } from "./theme/AppThemeProvider";

import "./index.css";
import "ol/ol.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ChakraProvider value={defaultSystem}>
            <BrowserRouter>
                <AppThemeProvider>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </AppThemeProvider>
            </BrowserRouter>
        </ChakraProvider>
    </StrictMode>,
);
