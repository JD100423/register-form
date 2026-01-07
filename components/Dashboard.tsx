import React from "react";
import "../app/globals.css";
import Card from "./Card";
import Footer from "./Footer";


export default function Dashboard() {
    return (
        <div>
        <main className="dashboard" style={{ 
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            alignItems: "start",
        }}>
            <div className="dashboard-grid">
                <Card
                title="Registrar entrada"
                description="Registrar la llegada del visitante y su informacion."
                href="/registrar/entrada"
                icon="/icons/entrada.png"
            />

            <Card
                title="Registrar salida"
                description="Registrar la salida del visitante y hora de salida."
                href="/registrar/salida"
                icon="/icons/salida.png"
            />
            </div>
        </main>
        <Footer />
        </div>
    )
}