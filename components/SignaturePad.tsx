'use client';
import React, { useRef, useEffect } from "react";

type SignaturePadProps = {
    width?: number;
    height?: number;
    onChange?: (dataUrl: string | null) => void;
};

export default function SignaturePad({ width = 600, height = 150, onChange}: SignaturePadProps) {
   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const drawing = useRef(false);
   const last = useRef<{ x: number; y: number } | null>(null);
   
   useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "#111";

    const ratio = window.devicePixelRatio || 1;
    canvas.width= width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(ratio, ratio);
   }, []);

   function getPos(e: PointerEvent) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
   }

   function pointerDown (e: PointerEvent) {
    drawing.current = true;
    last.current = getPos(e);
   }

   function pointerMove (e: PointerEvent) {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e);
    if (last.current) {
        ctx.beginPath();
        ctx.moveTo(last.current.x, last.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        last.current = pos;
    }
   }

   function pointerUp (e: PointerEvent) {
    drawing.current = false;
    last.current = null;
    if (onChange) onChange(canvasRef.current!.toDataURL());
   }

   useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointermove", pointerMove);
    window.addEventListener("pointerup", pointerUp);
    return () => {
        canvas.removeEventListener("pointerdown", pointerDown);
        canvas.removeEventListener("pointermove", pointerMove);
        window.removeEventListener("pointerup", pointerUp);
    };

   }, []);

   function clear() {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (onChange) onChange(null);
   }

   function download() {
    const data = canvasRef.current!.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = data;
    a.download = "firma.png";
    a.click();
   }

   return(
    <div style={{ border: "1px solid #ddd", padding: 8, display: "inline-block" }}>
        <canvas ref={canvasRef} style={{ display: "block", background: "#fff", touchAction: "none" }} />
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button type="button" onClick={clear}>Limpiar</button>
            <button type="button" onClick={download}>Descargar</button>
        </div>
    </div>
   )
}