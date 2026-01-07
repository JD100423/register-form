"use client";
import React, { useState } from "react"; 
import { useRouter } from "next/navigation";
import styles from "../../../components/VisitorForm.module.css";
import Footer from "@/components/Footer";
import Link from "next/link";

type StoredVisitor = {
    fecha: string;
    horaEntrada: string;
    nombre: string;
    cedula: string;
    empresa: string;
    correo: string;
    area: string;
    servicio: string;
    carnetVisita: boolean;
    horaSalida: string;
    firmaDataUrl: string | null;
    savedAt?: string;
};

function getVisitorFromStorage(cedula: string): StoredVisitor | null {
    try {
        const raw = localStorage.getItem("visitors") || "{}";
        const visitors = JSON.parse(raw);
        return visitors[cedula] || null;
    } catch (err) {
        console.error(err);
        return null;
    }
}

function saveExitForCedula(cedula: string, horaSalida: string) {
    try {
        const raw = localStorage.getItem("visitors") || "{}";
        const visitors = JSON.parse(raw);
        if (!visitors[cedula]) return false;
        visitors[cedula].horaSalida = horaSalida;
        visitors[cedula].savedAt = new Date().toISOString();
        localStorage.setItem("visitors", JSON.stringify(visitors));
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export default function SalidaPage() {
    const router = useRouter();
    const [cedula, setCedula] = useState("");
    const [visitor, setVisitor] = useState<StoredVisitor | null>(null);
    const [horaSalida, setHoraSalida] = useState("");

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        const found = getVisitorFromStorage(cedula.trim());
        if (!found) {
            alert("No se encontró visitante para esa cédula.");
            setVisitor(null);
            return;
        }
        setVisitor(found);

        const now = new Date();
        setHoraSalida(now.toTimeString().slice(0,5));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!visitor) return;
      if (!horaSalida) {
        alert("Ingrese la hora de salida.");
        return;
      }

      try {
        const res = await fetch('/api/visitors', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cedula: visitor.cedula, horaSalida }),
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || `HTTP ${res.status}`);
        }
        alert('Salida registrada en servidor.');
        router.push('/');
      } catch (err) {
        console.error('API PATCH failed, falling back to localStorage', err);
        const ok = saveExitForCedula(visitor.cedula, horaSalida);
        if (ok) {
          alert('Salida registrada localmente.');
          router.push('/');
        } else {
          alert('Error al registrar la salida.');
        }
      }
    };
    return (
      <>
      <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
            <nav style={{ marginBottom: 12 }}>
              <Link href="/" style={{ color: "#fff", background: "#667eea", padding: "8px 12px", borderRadius: 6, textDecoration: "none" }}>
                Volver
              </Link>
            </nav>
        </div>
      
        <div className={styles.formContainer}>

          <div className={styles.visitorForm}>
            <h1 style={{ marginBottom: 16, fontWeight: 600, fontSize: 20, textAlign: "center"}}>Registrar salida</h1>
            <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input
                value={cedula}
                onChange={e => setCedula(e.target.value)}
                placeholder="Ingrese cédula"
                style={{ padding: 8 }}
              />
              <button type="submit" className={styles.btnPrimary}>Buscar</button>
            </form>

            {visitor && (
              <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 700 }}>
                <div>
                  <strong>Nombre:</strong> <div>{visitor.nombre}</div>
                </div>
                <div>
                  <strong>Empresa:</strong> <div>{visitor.empresa}</div>
                </div>
                <div>
                  <strong>Fecha entrada:</strong> <div>{visitor.fecha} {visitor.horaEntrada}</div>
                </div>

                <label>
                  Hora de salida:
                  <input type="time" value={horaSalida} onChange={e => setHoraSalida(e.target.value)} required />
                </label>

                <div style={{ display: "flex", gap: 8 }}>
                  <button type="submit" className={styles.btnPrimary}>Registrar salida</button>
                  <button type="button" className={styles.btnSecondary} onClick={() => { setVisitor(null); setCedula(""); }}>Cancelar</button>
                </div>
              </form>
            )}
          </div>
          <Footer />
        </div>
        </>
    );
}