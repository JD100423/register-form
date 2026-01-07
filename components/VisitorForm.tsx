'use client';
import styles from "./VisitorForm.module.css"
import React, { useState } from "react";
import Image from "next/image";
import SignaturePad from "./SignaturePad";
import Footer from "./Footer";
import Logo from "../src/images/logo.png";


type FormState = {
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
};

function saveVisitorToStorage(data: FormState) {
    try {
        const raw = localStorage.getItem("visitors") || "{}";
        const visitors = JSON.parse(raw);
        visitors[data.cedula] = { ...data, savedAt: new Date().toISOString() };
        localStorage.setItem("visitors", JSON.stringify(visitors));
    } catch (err) {
        console.error("Error saving visitor", err);
    }
}

async function postVisitorToApi(data: FormState) {
    try {
        const res = await fetch('/api/visitors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const txt = await res.text();
            throw new Error(txt || `HTTP ${res.status}`);
        }
        return res.json();
    } catch (err) {
        throw err;
    }
}

export default function VisitorForm() {
    const today = new Date().toISOString().slice(0, 10);
    const [form, setForm] = useState<FormState>({
        fecha:today,
        horaEntrada: new Date().toTimeString().slice(0, 5),
        nombre: "",
        cedula: "",
        empresa: "",
        correo: "",
        area: "",
        servicio: "",
        carnetVisita: false,
        horaSalida: "",
        firmaDataUrl: null,
    });

    const[errors, setErrors] = useState<Record<string, string>>({});

    function handleChange<T extends keyof FormState>(key: T, value: FormState[T]) {
        setForm(prev => ({ ...prev, [key]: value}));
    }

    function validate() {
        const e: Record<string, string> = {};
        if (!form.nombre.trim()) e.nombre = "Nombre requerido";
        if (!form.cedula.trim()) e.cedula = "Cédula requerida";
        if (!form.empresa.trim()) e.empresa = "Empresa requerida";
        if (!form.correo.trim()) e.correo = "Correo requerido";
        else if (!/^\S+@\S+\.\S+$/.test(form.correo)) e.correo = "Correo inválido";
        if (!form.area.trim()) e.area = "Área a visitar requerida";
        if (!form.servicio.trim()) e.servicio = "Servicio requerido";
        if (!form.firmaDataUrl) e.firmaDataUrl = "Firma requerida";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        (async () => {
            try {
                await postVisitorToApi(form);
                alert('Registro guardado en servidor.');
            } catch (err) {
                console.error('API POST failed, falling back to localStorage', err);
                saveVisitorToStorage(form);
                alert('Registro guardado localmente (API no disponible).');
            }

            setForm(prev => ({
                ...prev,
                nombre: "",
                cedula: "",
                empresa: "",
                correo: "",
                area: "",
                servicio: "",
                carnetVisita: false,
                horaSalida: "",
                firmaDataUrl: null,
            }));
        })();
    }

    return ( 
        <div className={styles.formContainer}>
            <header className={styles.formHeader}>
                <Image src={Logo} alt="Logo Empresa" className={styles.headerLogo} />
                <h1>Registro de Visitantes</h1>
                <p className={styles.headerSubtitle}>Bienvenido al Ministerio de Agricultura</p>
            </header>
            
            <form onSubmit={handleSubmit} className={styles.visitorForm}>

            <div className={styles.formRow}>
                <label>
                    Fecha:
                    <input type="date" value={form.fecha} onChange={e => handleChange("fecha", e.target.value)} />
                </label>
                <label>
                    Hora de Entrada:
                    <input type="time" value={form.horaEntrada} onChange={e => handleChange("horaEntrada", e.target.value)} />
                </label>
            </div>

            <label>
                Nombre Completo:
                <input type="text" value={form.nombre} onChange={e => handleChange("nombre", e.target.value)} />
                {errors.nombre && <div className={styles.errorMessage}>{errors.nombre}</div>}
            </label>

            <div className={styles.formRow}>
                <label>
                    Cédula / Pasaporte:
                    <input type="text" value={form.cedula} onChange={e => handleChange("cedula", e.target.value)} />
                    {errors.cedula && <div className={styles.errorMessage}>{errors.cedula}</div>}
                </label>
                <label>
                    Empresa:
                    <input type="text" value={form.empresa} onChange={e => handleChange("empresa", e.target.value)} />
                    {errors.empresa && <div className={styles.errorMessage}>{errors.empresa}</div>}
                </label>
            </div>

            <label>
                Correo Electrónico:
                <input type="email" value={form.correo} onChange={e => handleChange("correo", e.target.value)} />
                {errors.correo && <div className={styles.errorMessage}>{errors.correo}</div>}
            </label>
            <div className={styles.formRow}>
                <label>
                    Área a Visitar:
                    <input type="text" value={form.area} onChange={e => handleChange("area", e.target.value)} />
                    {errors.area && <div className={styles.errorMessage}>{errors.area}</div>}
                </label>
                <label>
                    Servicio a Realizar:
                    <input type="text" value={form.servicio} onChange={e => handleChange("servicio", e.target.value)} />
                    {errors.servicio && <div className={styles.errorMessage}>{errors.servicio}</div>}
                </label>
            </div>

            <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={form.carnetVisita} onChange={e => handleChange("carnetVisita", e.target.checked)} />
                Solicita Carnet de Visita
            </label>

            <label>
                Hora de Salida:
                <input type="time" value={form.horaSalida} onChange={e => handleChange("horaSalida", e.target.value)} />
            </label>

            <div>
                <label>Firma (use el mouse):</label>
                <SignaturePad
                    width={600}
                    height={140}
                    onChange={(dataUrl) => handleChange("firmaDataUrl", dataUrl)}
                />
                {errors.firmaDataUrl && <div className={styles.errorMessage}>{errors.firmaDataUrl}</div>}
            </div>

            <div className={styles.formActions}>
                <button type="submit" className={styles.btnPrimary}>Guardar Registro</button>
            </div>
            </form>
        </div>
    );
}