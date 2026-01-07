import React from "react";
import VisitorForm from "@/components/VisitorForm";
import Link from "next/link";

export default function EntradaPage() {
    return (
        <>
        <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
            <nav style={{ marginBottom: 12 }}>
              <Link href="/" style={{ color: "#fff", background: "#667eea", padding: "8px 12px", borderRadius: 6, textDecoration: "none" }}>
                Volver
              </Link>
            <h1 style={{ marginBottom: 16, fontWeight: 600, fontSize: 20, textAlign: "center"}}>Registrar entrada</h1>
            </nav>
            <VisitorForm />
        </div>
        </>
    );
}