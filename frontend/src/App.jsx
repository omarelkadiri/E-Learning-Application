import React, { useEffect, useState } from "react";
import { LogOut, User, BookOpen, Loader, AlertCircle, CheckCircle } from "lucide-react";

function App({ keycloak }) {
    const [me, setMe] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Charger /me
    useEffect(() => {
        fetch("http://localhost:8081/me", {
            headers: {
                Authorization: "Bearer " + keycloak.token,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setMe(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erreur /me:", err);
                setError("Impossible de charger les infos utilisateur");
                setLoading(false);
            });
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <header className="bg-white shadow-lg border-b-4 border-blue-500">
                <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-10 h-10 text-blue-600" />
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            E-Learning Platform
                        </h1>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-all hover:shadow-lg"
                    >
                        <LogOut className="w-5 h-5" />
                        Se déconnecter
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                        <p className="text-red-700 font-semibold">{error}</p>
                    </div>
                )}

                {/* User Info Card */}
                <div className="mb-12">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-6 flex items-center gap-4">
                            <User className="w-12 h-12 text-white" />
                            <h2 className="text-2xl font-bold text-white">Profil Utilisateur</h2>
                        </div>
                        
                        {loading ? (
                            <div className="p-8 flex justify-center">
                                <Loader className="w-8 h-8 text-blue-500 animate-spin" />
                            </div>
                        ) : me ? (
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Nom</p>
                                        <p className="text-xl font-bold text-gray-800">{me.name || "Non disponible"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Email</p>
                                        <p className="text-xl font-bold text-gray-800">{me.email || "Non disponible"}</p>
                                    </div>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Données complètes</p>
                                    <pre className="text-xs text-gray-700 overflow-auto max-h-40 font-mono bg-white p-3 rounded">
                                        {JSON.stringify(me, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                Aucune donnée utilisateur
                            </div>
                        )}
                    </div>
                </div>

                {/* Courses Section */}
                <div>
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-6 flex items-center gap-4">
                            <BookOpen className="w-12 h-12 text-white" />
                            <h2 className="text-2xl font-bold text-white">Mes Cours</h2>
                            <span className="ml-auto bg-white text-green-600 rounded-full px-4 py-2 font-bold text-lg">
                                {courses.length}
                            </span>
                        </div>

                        <div className="p-8">
                            {courses.length === 0 ? (
                                <div className="text-center py-12">
                                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg font-semibold">Aucun cours disponible</p>
                                    <p className="text-gray-400">Vos cours apparaîtront ici</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {courses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <BookOpen className="w-8 h-8 text-green-600" />
                                                <CheckCircle className="w-6 h-6 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-green-700">
                                                {course.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-4">
                                                <span className="font-semibold">Étudiant:</span> {course.student}
                                            </p>
                                            {course.description && (
                                                <p className="text-xs text-gray-500 italic">{course.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-gray-300 mt-16 py-8 border-t-4 border-blue-500">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm">
                        © 2025 E-Learning Platform - Sécurisée par Keycloak OAuth2
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;
