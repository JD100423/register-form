'use client';
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

        console.log("Registro visitante:", form);
        alert("Registro guardado.");
    }

    return ( 
        <div className="form-container">
            <header className="form-header">
                <Image src={Logo} alt="Logo Empresa" className="header-logo" />
                <h1>Registro de Visitantes</h1>
                <p className="header-subtitle">Bienvenido al Ministerio de Agricultura</p>
            </header>
            
            <form onSubmit={handleSubmit} className="visitor-form">

            <div className="form-row">
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
                {errors.nombre && <div className="error-message">{errors.nombre}</div>}
            </label>

            <div className="form-row">
                <label>
                    Cédula / Pasaporte:
                    <input type="text" value={form.cedula} onChange={e => handleChange("cedula", e.target.value)} />
                    {errors.cedula && <div className="error-message">{errors.cedula}</div>}
                </label>
                <label>
                    Empresa:
                    <input type="text" value={form.empresa} onChange={e => handleChange("empresa", e.target.value)} />
                    {errors.empresa && <div className="error-message">{errors.empresa}</div>}
                </label>
            </div>

            <label>
                Correo Electrónico:
                <input type="email" value={form.correo} onChange={e => handleChange("correo", e.target.value)} />
                {errors.correo && <div className="error-message">{errors.correo}</div>}
            </label>

            <div className="form-row">
                <label>
                    Área a Visitar:
                    <input type="text" value={form.area} onChange={e => handleChange("area", e.target.value)} />
                    {errors.area && <div className="error-message">{errors.area}</div>}
                </label>
                <label>
                    Servicio a Realizar:
                    <input type="text" value={form.servicio} onChange={e => handleChange("servicio", e.target.value)} />
                    {errors.servicio && <div className="error-message">{errors.servicio}</div>}
                </label>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                {errors.firmaDataUrl && <div className="error-message">{errors.firmaDataUrl}</div>}
            </div>

            <div className="form-actions">
                <button type="submit" className="btn-primary">Guardar Registro</button>
            </div>
            </form>
            
            <Footer />
        </div>
    );
}