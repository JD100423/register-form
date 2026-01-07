'use client';
import Link from "next/link";
import Image from "next/image";
import React, { type ReactNode } from "react";
import "../app/globals.css";

type CardProps = {
    title: string;
    description: string;
    href: string;
    icon?: string | ReactNode;
};

export default function Card({ title, description, href, icon}: CardProps) {
    return (
        <Link href={href} className="card-link" aria-label={title}>
            <div className="card" role="button">
                {icon && (
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        {typeof icon === "string" ? (
                            <Image
                                src={icon}
                                alt={`${title} icon`}
                                width={64}
                                height={64}
                                style={{ objectFit: "contain" }}
                            />
                        ) : (
                            <div style={{ width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {icon}
                            </div>
                        )}
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