import React from "react";
import VisitorForm from "../components/VisitorForm";
import Dashboard from "@/components/Dashboard";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight:600, textAlign: "center"}}>Dashboard</h1>
      <Dashboard />
      <Footer />
    </div>
  );
}
