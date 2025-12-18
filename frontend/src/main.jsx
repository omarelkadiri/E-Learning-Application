import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import keycloak from "./keycloak";

keycloak
    .init({
        onLoad: "login-required",
        checkLoginIframe: false,
        pkceMethod: "S256",
    })
    .then((authenticated) => {
        if (!authenticated) {
            keycloak.login();
            return;
        }

        // Refresh auto comme dans le cours
        setInterval(() => {
            keycloak.updateToken(30).catch(() => {
                keycloak.login();
            });
        }, 10000);

        console.log("Access Token :", keycloak.token);
        console.log("ID Token :", keycloak.idToken);

        const root = ReactDOM.createRoot(document.getElementById("root"));
        root.render(<App keycloak={keycloak} />);
    })
    .catch((e) => console.error("Keycloak init error:", e));
