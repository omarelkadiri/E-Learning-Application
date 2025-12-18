import React, { useEffect, useState } from "react";

function App({ keycloak }) {
    const [me, setMe] = useState(null);
    const [courses, setCourses] = useState([]);

    // Charger /me
    useEffect(() => {
        fetch("http://localhost:8081/me", {
            headers: {
                Authorization: "Bearer " + keycloak.token,
            },
        })
            .then((res) => res.json())
            .then((data) => setMe(data))
            .catch((err) => console.error("Erreur /me:", err));
    }, [keycloak.token]);

    // Charger /courses
    useEffect(() => {
        fetch("http://localhost:8081/courses", {
            headers: {
                Authorization: "Bearer " + keycloak.token,
            },
        })
            .then((res) => {
                if (res.status === 403) {
                    console.warn("Accès interdit à /courses");
                    return [];
                }
                return res.json();
            })
            .then((data) => setCourses(data))
            .catch((err) => console.error("Erreur /courses:", err));
    }, [keycloak.token]);

    const logout = () => {
        keycloak.logout({ redirectUri: "http://localhost:3000" });
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Plateforme e-learning (demo Keycloak)</h1>

            <button onClick={logout}>Se déconnecter</button>

            <h2>Infos utilisateur (/me)</h2>
            <pre>{JSON.stringify(me, null, 2)}</pre>

            <h2>Mes cours (/courses)</h2>
            <ul>
                {courses.map((c) => (
                    <li key={c.id}>
                        {c.title} — {c.student}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
