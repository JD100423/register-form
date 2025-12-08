'use client';
import "../app/globals.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="form-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Direccion de Tecnologias y Comunicaciones (DTIC)</h4>
          <p>Gloria A. Paulus E.</p>
          <p>Ext: 3021</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Todos los derechos reservados.</p>
        <p>Desarrollado por Bartolo Del Rosario M.</p>
      </div>
    </footer>
  );
}
