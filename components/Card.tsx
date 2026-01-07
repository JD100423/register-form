'use client';
import Link from "next/link";
import React from "react";
import "../app/globals.css";

type CardProps = {
    title: string;
    description: string;
    href: string;
    icon: object | string;
};

export default function Card({ title, description, href, icon}: CardProps) {
    return (
        <Link href={href} className="card-link" aria-label={title}>
            <div className="card" role="button">
                {icon && (
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <img
                        src={icon}
                        alt={`${title} icon`}
                        style={{ width: 64, height:64, objectFit: "contain" }}
                        />
                        <div>
                            <h3>{title}</h3>
                            {description && <p>{description}</p>}
                        </div>
                    </div>
                )}
                {!icon && (
                    <>
                    <h3>{title}</h3>
                    {description && <p>{description}</p>}
                    </>
                )}
            </div>
        </Link>
    );
}