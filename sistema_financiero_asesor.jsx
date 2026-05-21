import { useState, useCallback } from "react";

// ─── PALETA & CONSTANTES ───────────────────────────────────────────────────
const C = {
  bg: "#f5f2ec",
  paper: "#ffffff",
  ink: "#18150f",
  muted: "#6b6359",
  faint: "#edeae3",
  border: "#d6d0c6",
  green: "#1a6645",
  greenLight: "#e6f4ee",
  red: "#8b1a1a",
  redLight: "#fdf0f0",
  gold: "#8b6914",
  goldLight: "#fdf7e8",
  blue: "#1a3d6b",
  blueLight: "#edf3fb",
  purple: "#4b2d8b",
  purpleLight: "#f0ecfb",
};

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

// ─── PLANES DEL NEGOCIO ────────────────────────────────────────────────────
const PLANES = {
  basico: { nombre: "Plan Básico", precio: "1,200–2,500", setup: "4,000–5,000", color: C.blue, icon: "📊" },
  premium: { nombre: "Plan Premium", precio: "2,500–6,000", setup: "5,000–8,000", color: C.purple, icon: "🚀" },
};

// ─── DATOS POR DEFECTO ─────────────────────────────────────────────────────
const defaultInputs = {
  empresa: "Mi Empresa S.A. de C.V.",
  rfc: "MEM250101AAA",
  giro: "Servicios",
  responsable: "Director General",
  plan: "basico",
  mes: 5, año: 2025,
  // Estado de Resultados
  ventasNetas: 950000,
  devolucionesDescuentos: 18000,
  costoMercancia: 420000,
  costoManoObra: 95000,
  costoGastosFabricacion: 38000,
  gastosAdministracion: 65000,
  gastosVentas: 42000,
  gastosMarketing: 28000,
  gastosRenta: 30000,
  gastosServicios: 14000,
  gastosDepreciacion: 12000,
  otrosGastosOp: 8000,
  productoFinanciero: 5000,
  gastoFinanciero: 18000,
  otrosIngresos: 9000,
  otrosGastos: 6000,
  tasaIsr: 0.30,
  ptu: 0.10,
  // Balance General — Activo
  cajaEfectivo: 85000,
  bancos: 220000,
  inversiones: 60000,
  cuentasPorCobrar: 180000,
  inventarios: 140000,
  anticipos: 25000,
  otrosActCirc: 15000,
  terrenoEdificio: 500000,
  maquinaria: 250000,
  mobiliario: 80000,
  equipo: 60000,
  vehiculos: 120000,
  depreciacionAcum: -145000,
  otrosActFijo: 30000,
  activosDiferidos: 40000,
  otrosActLP: 20000,
  // Balance General — Pasivo & Capital
  proveedores: 95000,
  acreedoresDiversos: 35000,
  impuestosXPagar: 48000,
  anticClientes: 22000,
  otrosPasCirc: 18000,
  deudasLargoPlazo: 320000,
  otrosPasLP: 45000,
  capitalSocial: 600000,
  reservaLegal: 80000,
  utilidadesAnteriores: 220000,
  // Flujo de Efectivo
  cobranzaClientes: 920000,
  pagosProveedores: -490000,
  pagosNomina: -145000,
  pagosImpuestos: -72000,
  otrosOpFlujo: -18000,
  compraActivos: -85000,
  ventaActivos: 12000,
  inversionesFlujo: -40000,
  otrosInvFlujo: 0,
  prestamosRecibidos: 50000,
  pagoDeudas: -35000,
  dividendosPagados: -20000,
  aportacionesSocios: 0,
  efectivoInicial: 280000,
  // Comparativo mes anterior
  ventasNetasMesAnt: 875000,
  utilidadNetaMesAnt: 98000,
  efectivoMesAnt: 265000,
};

// ─── CÁLCULOS ─────────────────────────────────────────────────────────────
function calcAll(d) {
  const ventasNetas = d.ventasNetas - d.devolucionesDescuentos;
  const costoVentas = d.costoMercancia + d.costoManoObra + d.costoGastosFabricacion;
  const utilidadBruta = ventasNetas - costoVentas;
  const margenBruto = ventasNetas ? (utilidadBruta / ventasNetas) * 100 : 0;
  const gastosOperativos = d.gastosAdministracion + d.gastosVentas + d.gastosMarketing + d.gastosRenta + d.gastosServicios + d.gastosDepreciacion + d.otrosGastosOp;
  const ebitda = utilidadBruta - (gastosOperativos - d.gastosDepreciacion);
  const utilidadOperativa = utilidadBruta - gastosOperativos;
  const margenOperativo = ventasNetas ? (utilidadOperativa / ventasNetas) * 100 : 0;
  const ebitdaMargen = ventasNetas ? (ebitda / ventasNetas) * 100 : 0;
  const resultadoFinanciero = d.productoFinanciero - d.gastoFinanciero;
  const otrosNeto = d.otrosIngresos - d.otrosGastos;
  const uaipt = utilidadOperativa + resultadoFinanciero + otrosNeto;
  const isr = uaipt > 0 ? uaipt * d.tasaIsr : 0;
  const ptuCalc = uaipt > 0 ? uaipt * d.ptu : 0;
  const utilidadNeta = uaipt - isr - ptuCalc;
  const margenNeto = ventasNetas ? (utilidadNeta / ventasNetas) * 100 : 0;

  const activoCirculante = d.cajaEfectivo + d.bancos + d.inversiones + d.cuentasPorCobrar + d.inventarios + d.anticipos + d.otrosActCirc;
  const activoFijo = d.terrenoEdificio + d.maquinaria + d.mobiliario + d.equipo + d.vehiculos + d.depreciacionAcum + d.otrosActFijo;
  const activoLP = d.activosDiferidos + d.otrosActLP;
  const totalActivo = activoCirculante + activoFijo + activoLP;
  const pasivoCirculante = d.proveedores + d.acreedoresDiversos + d.impuestosXPagar + d.anticClientes + d.otrosPasCirc;
  const pasivoLP = d.deudasLargoPlazo + d.otrosPasLP;
  const totalPasivo = pasivoCirculante + pasivoLP;
  const capitalContable = d.capitalSocial + d.reservaLegal + d.utilidadesAnteriores + utilidadNeta;
  const totalPasivoCapital = totalPasivo + capitalContable;
  const cuadra = Math.abs(totalActivo - totalPasivoCapital) < 1;

  const razonCirculante = pasivoCirculante ? activoCirculante / pasivoCirculante : 0;
  const pruebaAcida = pasivoCirculante ? (activoCirculante - d.inventarios) / pasivoCirculante : 0;
  const endeudamiento = totalActivo ? (totalPasivo / totalActivo) * 100 : 0;
  const capitalizacion = totalActivo ? (capitalContable / totalActivo) * 100 : 0;
  const roe = capitalContable ? (utilidadNeta / capitalContable) * 100 : 0;
  const roa = totalActivo ? (utilidadNeta / totalActivo) * 100 : 0;

  const flujoOperacion = d.cobranzaClientes + d.pagosProveedores + d.pagosNomina + d.pagosImpuestos + d.otrosOpFlujo;
  const flujoInversion = d.compraActivos + d.ventaActivos + d.inversionesFlujo + d.otrosInvFlujo;
  const flujoFinanciamiento = d.prestamosRecibidos + d.pagoDeudas + d.dividendosPagados + d.aportacionesSocios;
  const varEfectivo = flujoOperacion + flujoInversion + flujoFinanciamiento;
  const efectivoFinal = d.efectivoInicial + varEfectivo;

  const capitalInicio = d.capitalSocial + d.reservaLegal + d.utilidadesAnteriores;
  const reservaEjercicio = utilidadNeta * 0.05;

  const roi = (costoVentas + gastosOperativos) ? (utilidadNeta / (costoVentas + gastosOperativos)) * 100 : 0;
  const rotacionInventario = d.inventarios ? costoVentas / d.inventarios : 0;
  const diasInventario = rotacionInventario ? 365 / rotacionInventario : 0;
  const rotacionCxC = d.cuentasPorCobrar ? ventasNetas / d.cuentasPorCobrar : 0;
  const diasCobranza = rotacionCxC ? 365 / rotacionCxC : 0;

  // Variaciones vs mes anterior
  const varVentas = d.ventasNetasMesAnt ? ((d.ventasNetas - d.ventasNetasMesAnt) / d.ventasNetasMesAnt) * 100 : 0;
  const varUtilidad = d.utilidadNetaMesAnt ? ((utilidadNeta - d.utilidadNetaMesAnt) / Math.abs(d.utilidadNetaMesAnt)) * 100 : 0;
  const varEfectivoMes = d.efectivoMesAnt ? ((efectivoFinal - d.efectivoMesAnt) / Math.abs(d.efectivoMesAnt)) * 100 : 0;

  return {
    ventasNetas, costoVentas, utilidadBruta, margenBruto,
    gastosOperativos, ebitda, ebitdaMargen, utilidadOperativa, margenOperativo,
    resultadoFinanciero, otrosNeto, uaipt, isr, ptu: ptuCalc, utilidadNeta, margenNeto,
    activoCirculante, activoFijo, activoLP, totalActivo,
    pasivoCirculante, pasivoLP, totalPasivo, capitalContable, totalPasivoCapital, cuadra,
    razonCirculante, pruebaAcida, endeudamiento, capitalizacion, roe, roa,
    flujoOperacion, flujoInversion, flujoFinanciamiento, varEfectivo, efectivoFinal,
    capitalInicio, reservaEjercicio, capitalFin: capitalContable,
    roi, rotacionInventario, diasInventario, rotacionCxC, diasCobranza,
    varVentas, varUtilidad, varEfectivoMes,
  };
}

// ─── HELPERS ──────────────────────────────────────────────────────────────
const fmt = n => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
const fmtD = n => n.toFixed(2);
const pct = n => n.toFixed(1) + "%";

// ─── COMPONENTES BASE ──────────────────────────────────────────────────────
function Row({ label, value, indent = 0, subtotal, total, neg, color }) {
  const isNeg = typeof value === "number" && value < 0;
  const textColor = color || (total ? C.blue : subtotal ? C.ink : isNeg || neg ? C.red : C.ink);
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: `${total ? 9 : subtotal ? 7 : 5}px ${total ? 14 : 10}px`,
      marginLeft: indent * 14,
      background: total ? C.blueLight : subtotal ? C.faint : "transparent",
      borderRadius: total || subtotal ? 6 : 0,
      borderTop: total ? `2px solid ${C.blue}` : subtotal ? `1px solid ${C.border}` : "none",
      marginBottom: 2,
    }}>
      <span style={{ fontSize: 12.5, color: textColor, fontWeight: subtotal || total ? 600 : 400 }}>{label}</span>
      {value !== undefined && (
        <span style={{ fontSize: 12.5, color: textColor, fontWeight: subtotal || total ? 700 : 400, fontFamily: "monospace", minWidth: 108, textAlign: "right" }}>
          {typeof value === "number" ? fmt(value) : value}
        </span>
      )}
    </div>
  );
}

function Section({ title, color, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ background: color || C.ink, color: "#fff", padding: "5px 12px", borderRadius: "6px 6px 0 0", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "monospace" }}>
        {title}
      </div>
      <div style={{ border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 6px 6px", padding: "10px 8px", background: C.paper }}>
        {children}
      </div>
    </div>
  );
}

function KPICard({ label, value, sub, good, neutral }) {
  const color = neutral ? C.gold : (good ? C.green : C.red);
  return (
    <div style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", borderLeft: `4px solid ${color}` }}>
      <div style={{ fontSize: 10, color: C.muted, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4, fontFamily: "monospace" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: "Georgia, serif" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function VarBadge({ val }) {
  const up = val >= 0;
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: up ? C.green : C.red, background: up ? C.greenLight : C.redLight, padding: "2px 7px", borderRadius: 20, fontFamily: "monospace" }}>
      {up ? "▲" : "▼"} {Math.abs(val).toFixed(1)}%
    </span>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: active ? C.ink : "transparent",
      color: active ? "#fff" : C.muted,
      border: `1px solid ${active ? C.ink : C.border}`,
      padding: "7px 16px", borderRadius: 6, cursor: "pointer",
      fontSize: 12, fontWeight: active ? 600 : 400, letterSpacing: 0.4,
      fontFamily: "monospace", transition: "all 0.15s",
    }}>
      {children}
    </button>
  );
}

function Field({ label, field, inputs, setInputs, type = "number", prefix = "$", options }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 3 }}>{label}</label>
      {options ? (
        <select value={inputs[field]} onChange={e => setInputs(p => ({ ...p, [field]: e.target.value }))}
          style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 8px", fontSize: 13, fontFamily: "monospace", color: C.ink, background: C.paper }}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <div style={{ display: "flex", alignItems: "center", border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden", background: C.paper }}>
          {prefix && <span style={{ padding: "6px 8px", background: C.faint, color: C.muted, fontSize: 12, fontFamily: "monospace" }}>{prefix}</span>}
          <input type={type} value={inputs[field]}
            onChange={e => setInputs(p => ({ ...p, [field]: type === "number" ? (parseFloat(e.target.value) || 0) : e.target.value }))}
            style={{ flex: 1, border: "none", outline: "none", padding: "6px 8px", fontSize: 13, fontFamily: "monospace", color: C.ink, background: "transparent" }} />
        </div>
      )}
    </div>
  );
}

// ─── DASHBOARD RESUMEN ────────────────────────────────────────────────────
function Dashboard({ d, f, inputs }) {
  const metrics = [
    { label: "Ventas Netas", value: fmt(f.ventasNetas), var: f.varVentas },
    { label: "Utilidad Bruta", value: fmt(f.utilidadBruta), sub: pct(f.margenBruto) + " margen" },
    { label: "EBITDA", value: fmt(f.ebitda), sub: pct(f.ebitdaMargen) + " margen" },
    { label: "Utilidad Neta", value: fmt(f.utilidadNeta), var: f.varUtilidad, sub: pct(f.margenNeto) + " margen" },
    { label: "Total Activo", value: fmt(f.totalActivo) },
    { label: "Capital Contable", value: fmt(f.capitalContable) },
    { label: "Efectivo Final", value: fmt(f.efectivoFinal), var: f.varEfectivoMes },
    { label: "Endeudamiento", value: pct(f.endeudamiento), sub: f.endeudamiento < 50 ? "✓ Sano" : "⚠ Alto" },
  ];

  // Mini gráfica de barras (CSS puro)
  const barData = [
    { label: "Ventas", val: f.ventasNetas, color: C.blue },
    { label: "Costo V.", val: f.costoVentas, color: C.red },
    { label: "Gastos Op.", val: f.gastosOperativos, color: C.gold },
    { label: "EBITDA", val: f.ebitda, color: C.green },
    { label: "Ut. Neta", val: f.utilidadNeta, color: f.utilidadNeta >= 0 ? C.green : C.red },
  ];
  const maxBar = Math.max(...barData.map(b => Math.abs(b.val)));

  return (
    <div>
      {/* Métricas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, color: C.muted, letterSpacing: 1.1, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 5 }}>{m.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif", marginBottom: 3 }}>{m.value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {m.var !== undefined && <VarBadge val={m.var} />}
              {m.sub && <span style={{ fontSize: 11, color: C.muted }}>{m.sub}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Gráfica */}
      <div style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1.2, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>Estructura de Resultados — {MONTHS[inputs.mes - 1]} {inputs.año}</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160 }}>
          {barData.map((b, i) => {
            const h = maxBar ? Math.max(4, (Math.abs(b.val) / maxBar) * 140) : 4;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 10, color: b.color, fontFamily: "monospace", fontWeight: 700 }}>{fmt(b.val)}</div>
                <div style={{ width: "100%", height: h, background: b.color, borderRadius: "4px 4px 0 0", opacity: 0.85 }} />
                <div style={{ fontSize: 10, color: C.muted, textAlign: "center", fontFamily: "monospace" }}>{b.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Semáforo de salud */}
      <div style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1.2, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14 }}>Diagnóstico Rápido</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { label: "Liquidez", val: f.razonCirculante, meta: 1.5, fmt: v => v.toFixed(2) + "x" },
            { label: "Margen Neto", val: f.margenNeto, meta: 10, fmt: v => pct(v) },
            { label: "ROE", val: f.roe, meta: 15, fmt: v => pct(v) },
            { label: "Endeudamiento", val: 100 - f.endeudamiento, meta: 50, fmt: _ => pct(f.endeudamiento) },
            { label: "Días Cobranza", val: 45 - f.diasCobranza, meta: 0, fmt: _ => fmtD(f.diasCobranza) + " días" },
            { label: "Flujo Operativo", val: f.flujoOperacion, meta: 0, fmt: v => fmt(v) },
          ].map((item, i) => {
            const ok = item.val >= item.meta;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: ok ? C.greenLight : C.redLight, borderRadius: 8 }}>
                <span style={{ fontSize: 20 }}>{ok ? "✅" : "⚠️"}</span>
                <div>
                  <div style={{ fontSize: 11, color: C.muted }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: ok ? C.green : C.red, fontFamily: "monospace" }}>{item.fmt(item.val)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── ESTADO DE RESULTADOS ─────────────────────────────────────────────────
function EstadoResultados({ d, f }) {
  return (
    <div>
      <Section title="I. Ingresos" color={C.green}>
        <Row label="Ventas Brutas" value={d.ventasNetas} indent={1} />
        <Row label="(−) Devoluciones y Descuentos" value={-d.devolucionesDescuentos} indent={1} neg />
        <Row label="VENTAS NETAS" value={f.ventasNetas} subtotal bold />
      </Section>

      <Section title="II. Costo de Ventas" color={C.red}>
        <Row label="Costo de Mercancía / Materiales" value={d.costoMercancia} indent={1} />
        <Row label="Mano de Obra Directa" value={d.costoManoObra} indent={1} />
        <Row label="Gastos Indirectos de Fabricación" value={d.costoGastosFabricacion} indent={1} />
        <Row label="TOTAL COSTO DE VENTAS" value={f.costoVentas} subtotal />
      </Section>

      <div style={{ padding: "10px 14px", background: C.greenLight, borderRadius: 8, marginBottom: 14, display: "flex", justifyContent: "space-between", border: `1px solid ${C.green}40` }}>
        <span style={{ fontWeight: 700, color: C.green, fontFamily: "Georgia, serif" }}>UTILIDAD BRUTA</span>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontWeight: 700, color: C.green, fontFamily: "monospace", fontSize: 15 }}>{fmt(f.utilidadBruta)}</span>
          <span style={{ fontSize: 11, color: C.muted, marginLeft: 10 }}>Margen: {pct(f.margenBruto)}</span>
        </div>
      </div>

      <Section title="III. Gastos de Operación" color={C.gold}>
        <Row label="Gastos de Administración" value={d.gastosAdministracion} indent={1} />
        <Row label="Gastos de Ventas" value={d.gastosVentas} indent={1} />
        <Row label="Gastos de Marketing" value={d.gastosMarketing} indent={1} />
        <Row label="Renta y Arrendamiento" value={d.gastosRenta} indent={1} />
        <Row label="Servicios Públicos" value={d.gastosServicios} indent={1} />
        <Row label="Depreciación y Amortización" value={d.gastosDepreciacion} indent={1} />
        <Row label="Otros Gastos Operativos" value={d.otrosGastosOp} indent={1} />
        <Row label="TOTAL GASTOS OPERATIVOS" value={f.gastosOperativos} subtotal />
      </Section>

      <div style={{ padding: "9px 14px", background: C.blueLight, borderRadius: 8, marginBottom: 14, display: "flex", justifyContent: "space-between", border: `1px solid ${C.blue}40` }}>
        <span style={{ fontWeight: 700, color: C.blue, fontFamily: "Georgia, serif" }}>EBITDA</span>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontWeight: 700, color: C.blue, fontFamily: "monospace", fontSize: 15 }}>{fmt(f.ebitda)}</span>
          <span style={{ fontSize: 11, color: C.muted, marginLeft: 10 }}>Margen: {pct(f.ebitdaMargen)}</span>
        </div>
      </div>

      <div style={{ padding: "9px 14px", background: C.faint, borderRadius: 8, marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif" }}>UTILIDAD DE OPERACIÓN</span>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontWeight: 700, color: f.utilidadOperativa >= 0 ? C.green : C.red, fontFamily: "monospace", fontSize: 15 }}>{fmt(f.utilidadOperativa)}</span>
          <span style={{ fontSize: 11, color: C.muted, marginLeft: 10 }}>Margen: {pct(f.margenOperativo)}</span>
        </div>
      </div>

      <Section title="IV. Resultado Integral de Financiamiento" color={C.blue}>
        <Row label="(+) Productos Financieros" value={d.productoFinanciero} indent={1} color={C.green} />
        <Row label="(−) Gastos Financieros (intereses)" value={-d.gastoFinanciero} indent={1} neg />
        <Row label="RESULTADO FINANCIERO NETO" value={f.resultadoFinanciero} subtotal />
      </Section>

      <Section title="V. Otros Ingresos y Gastos" color="#5a5a5a">
        <Row label="Otros Ingresos No Operativos" value={d.otrosIngresos} indent={1} color={C.green} />
        <Row label="Otros Gastos No Operativos" value={-d.otrosGastos} indent={1} neg />
        <Row label="OTROS NETO" value={f.otrosNeto} subtotal />
      </Section>

      <div style={{ padding: "10px 14px", background: C.goldLight, borderRadius: 8, marginBottom: 8, display: "flex", justifyContent: "space-between", border: `1px solid ${C.gold}50` }}>
        <span style={{ fontWeight: 700, color: C.gold, fontFamily: "Georgia, serif" }}>UTILIDAD ANTES DE IMPUESTOS (UAI)</span>
        <span style={{ fontWeight: 700, color: C.gold, fontFamily: "monospace", fontSize: 15 }}>{fmt(f.uaipt)}</span>
      </div>

      <Section title="VI. Impuestos y PTU" color="#4a4a4a">
        <Row label="ISR (30%)" value={-f.isr} indent={1} neg />
        <Row label="PTU (10%)" value={-f.ptu} indent={1} neg />
        <Row label="TOTAL IMPUESTOS Y PTU" value={-(f.isr + f.ptu)} subtotal />
      </Section>

      <div style={{ padding: "14px 18px", background: f.utilidadNeta >= 0 ? C.greenLight : C.redLight, borderRadius: 8, display: "flex", justifyContent: "space-between", border: `2px solid ${f.utilidadNeta >= 0 ? C.green : C.red}`, marginTop: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: f.utilidadNeta >= 0 ? C.green : C.red, fontFamily: "Georgia, serif" }}>UTILIDAD NETA DEL EJERCICIO</span>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: f.utilidadNeta >= 0 ? C.green : C.red, fontFamily: "monospace" }}>{fmt(f.utilidadNeta)}</div>
          <div style={{ fontSize: 11, color: C.muted }}>Margen Neto: {pct(f.margenNeto)}</div>
        </div>
      </div>
    </div>
  );
}

// ─── BALANCE GENERAL ───────────────────────────────────────────────────────
function BalanceGeneral({ d, f }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div>
        <div style={{ textAlign: "center", background: C.green, color: "#fff", padding: "8px", borderRadius: "8px 8px 0 0", fontWeight: 700, fontFamily: "monospace", fontSize: 12, letterSpacing: 1 }}>ACTIVO</div>
        <div style={{ border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: 12, background: C.paper }}>
          <Section title="Activo Circulante" color={C.green}>
            <Row label="Caja y Efectivo" value={d.cajaEfectivo} indent={1} />
            <Row label="Bancos" value={d.bancos} indent={1} />
            <Row label="Inversiones Temporales" value={d.inversiones} indent={1} />
            <Row label="Cuentas por Cobrar" value={d.cuentasPorCobrar} indent={1} />
            <Row label="Inventarios" value={d.inventarios} indent={1} />
            <Row label="Anticipos a Proveedores" value={d.anticipos} indent={1} />
            <Row label="Otros Activos Circulantes" value={d.otrosActCirc} indent={1} />
            <Row label="TOTAL ACTIVO CIRCULANTE" value={f.activoCirculante} subtotal />
          </Section>
          <Section title="Activo Fijo Neto" color="#2d5a3d">
            <Row label="Terreno y Edificio" value={d.terrenoEdificio} indent={1} />
            <Row label="Maquinaria y Equipo" value={d.maquinaria} indent={1} />
            <Row label="Mobiliario y Equipo de Oficina" value={d.mobiliario} indent={1} />
            <Row label="Equipo de Cómputo" value={d.equipo} indent={1} />
            <Row label="Vehículos" value={d.vehiculos} indent={1} />
            <Row label="(−) Depreciación Acumulada" value={d.depreciacionAcum} indent={1} neg />
            <Row label="Otros Activos Fijos" value={d.otrosActFijo} indent={1} />
            <Row label="TOTAL ACTIVO FIJO NETO" value={f.activoFijo} subtotal />
          </Section>
          <Section title="Activo L/P y Diferido" color="#405840">
            <Row label="Activos Intangibles / Diferidos" value={d.activosDiferidos} indent={1} />
            <Row label="Otros Activos L/P" value={d.otrosActLP} indent={1} />
            <Row label="TOTAL ACTIVO L/P" value={f.activoLP} subtotal />
          </Section>
          <Row label="TOTAL ACTIVO" value={f.totalActivo} total />
        </div>
      </div>

      <div>
        <div style={{ textAlign: "center", background: C.blue, color: "#fff", padding: "8px", borderRadius: "8px 8px 0 0", fontWeight: 700, fontFamily: "monospace", fontSize: 12, letterSpacing: 1 }}>PASIVO + CAPITAL</div>
        <div style={{ border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: 12, background: C.paper }}>
          <Section title="Pasivo Circulante" color={C.red}>
            <Row label="Proveedores" value={d.proveedores} indent={1} />
            <Row label="Acreedores Diversos" value={d.acreedoresDiversos} indent={1} />
            <Row label="Impuestos por Pagar" value={d.impuestosXPagar} indent={1} />
            <Row label="Anticipos de Clientes" value={d.anticClientes} indent={1} />
            <Row label="Otros Pasivos Circulantes" value={d.otrosPasCirc} indent={1} />
            <Row label="TOTAL PASIVO CIRCULANTE" value={f.pasivoCirculante} subtotal />
          </Section>
          <Section title="Pasivo Largo Plazo" color="#7a1a1a">
            <Row label="Deudas y Créditos L/P" value={d.deudasLargoPlazo} indent={1} />
            <Row label="Otros Pasivos L/P" value={d.otrosPasLP} indent={1} />
            <Row label="TOTAL PASIVO L/P" value={f.pasivoLP} subtotal />
          </Section>
          <Row label="TOTAL PASIVO" value={f.totalPasivo} subtotal />
          <Section title="Capital Contable" color={C.blue}>
            <Row label="Capital Social" value={d.capitalSocial} indent={1} />
            <Row label="Reserva Legal" value={d.reservaLegal} indent={1} />
            <Row label="Utilidades de Ejercicios Anteriores" value={d.utilidadesAnteriores} indent={1} />
            <Row label="Utilidad Neta del Ejercicio" value={f.utilidadNeta} indent={1} color={f.utilidadNeta >= 0 ? C.green : C.red} />
            <Row label="TOTAL CAPITAL CONTABLE" value={f.capitalContable} subtotal />
          </Section>
          <Row label="TOTAL PASIVO + CAPITAL" value={f.totalPasivoCapital} total />
          <div style={{ marginTop: 8, padding: "6px 12px", background: f.cuadra ? C.greenLight : C.redLight, borderRadius: 6, textAlign: "center", fontSize: 12, color: f.cuadra ? C.green : C.red, fontWeight: 700 }}>
            {f.cuadra ? "✓ Balance cuadrado correctamente" : "⚠ El balance no cuadra — revisar datos"}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FLUJO DE EFECTIVO ─────────────────────────────────────────────────────
function FlujoEfectivo({ d, f }) {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: 14, padding: "10px 16px", background: C.faint, borderRadius: 8, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 600, color: C.ink }}>Efectivo al inicio del período</span>
        <span style={{ fontFamily: "monospace", fontWeight: 700 }}>{fmt(d.efectivoInicial)}</span>
      </div>
      {[
        { title: "A. Actividades de Operación (Método Directo)", color: C.green, rows: [
          ["(+) Cobranza a clientes", d.cobranzaClientes],
          ["(−) Pagos a proveedores", d.pagosProveedores],
          ["(−) Pagos de nómina y beneficios", d.pagosNomina],
          ["(−) Pago de impuestos", d.pagosImpuestos],
          ["Otros flujos operativos", d.otrosOpFlujo],
        ], total: ["FLUJO NETO DE OPERACIÓN", f.flujoOperacion] },
        { title: "B. Actividades de Inversión", color: C.gold, rows: [
          ["(−) Compra de activos fijos", d.compraActivos],
          ["(+) Venta de activos", d.ventaActivos],
          ["(−) Inversiones financieras", d.inversionesFlujo],
          ["Otros flujos de inversión", d.otrosInvFlujo],
        ], total: ["FLUJO NETO DE INVERSIÓN", f.flujoInversion] },
        { title: "C. Actividades de Financiamiento", color: C.blue, rows: [
          ["(+) Préstamos recibidos", d.prestamosRecibidos],
          ["(−) Pago de deudas/créditos", d.pagoDeudas],
          ["(−) Dividendos pagados a socios", d.dividendosPagados],
          ["(+) Aportaciones de socios", d.aportacionesSocios],
        ], total: ["FLUJO NETO DE FINANCIAMIENTO", f.flujoFinanciamiento] },
      ].map((s, si) => (
        <Section key={si} title={s.title} color={s.color}>
          {s.rows.map(([label, value], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 20px", borderBottom: `1px solid ${C.faint}` }}>
              <span style={{ fontSize: 12.5, color: C.ink }}>{label}</span>
              <span style={{ fontSize: 12.5, fontFamily: "monospace", color: value >= 0 ? C.green : C.red }}>{fmt(value)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 14px", background: s.color + "14", borderRadius: 6, margin: "6px 0", border: `1px solid ${s.color}30` }}>
            <span style={{ fontWeight: 700, color: s.color, fontFamily: "Georgia, serif", fontSize: 13 }}>{s.total[0]}</span>
            <span style={{ fontWeight: 700, color: s.total[1] >= 0 ? s.color : C.red, fontFamily: "monospace", fontSize: 13 }}>{fmt(s.total[1])}</span>
          </div>
        </Section>
      ))}
      <div style={{ padding: "10px 16px", background: C.faint, borderRadius: 8, display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontWeight: 600, color: C.ink }}>Variación neta en efectivo</span>
        <span style={{ fontFamily: "monospace", fontWeight: 700, color: f.varEfectivo >= 0 ? C.green : C.red }}>{fmt(f.varEfectivo)}</span>
      </div>
      <div style={{ padding: "14px 18px", background: C.blueLight, borderRadius: 8, display: "flex", justifyContent: "space-between", border: `2px solid ${C.blue}` }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: C.blue, fontFamily: "Georgia, serif" }}>EFECTIVO AL FINAL DEL PERÍODO</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: C.blue, fontFamily: "monospace" }}>{fmt(f.efectivoFinal)}</span>
      </div>
    </div>
  );
}

// ─── CAMBIOS EN CAPITAL ────────────────────────────────────────────────────
function CambiosCapital({ d, f }) {
  const rows = [
    { label: "Saldo inicial del período", cs: d.capitalSocial, rl: d.reservaLegal, ur: d.utilidadesAnteriores, un: 0 },
    { label: "Aportaciones de socios", cs: d.aportacionesSocios || 0, rl: 0, ur: 0, un: 0 },
    { label: "Traspaso a reserva legal (5%)", cs: 0, rl: f.reservaEjercicio, ur: 0, un: 0 },
    { label: "Dividendos decretados", cs: 0, rl: 0, ur: d.dividendosPagados || 0, un: 0 },
    { label: "Utilidad neta del ejercicio", cs: 0, rl: 0, ur: 0, un: f.utilidadNeta },
  ];
  const headers = ["Concepto", "Capital Social", "Reserva Legal", "Utilidades Retenidas", "Utilidad Ejercicio", "TOTAL"];
  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
          <thead>
            <tr style={{ background: C.blue }}>
              {headers.map(h => <th key={h} style={{ color: "#fff", padding: "10px 12px", fontSize: 11, textAlign: h === "Concepto" ? "left" : "right", fontFamily: "monospace", letterSpacing: 0.5 }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const total = row.cs + row.rl + row.ur + row.un;
              return (
                <tr key={i} style={{ background: i % 2 === 0 ? C.faint : C.paper }}>
                  <td style={{ padding: "8px 12px", fontSize: 12.5, color: C.ink }}>{row.label}</td>
                  {[row.cs, row.rl, row.ur, row.un, total].map((v, j) => (
                    <td key={j} style={{ padding: "8px 12px", fontSize: 12.5, textAlign: "right", fontFamily: "monospace", color: v < 0 ? C.red : v > 0 ? C.ink : C.muted }}>
                      {v !== 0 ? fmt(v) : "—"}
                    </td>
                  ))}
                </tr>
              );
            })}
            <tr style={{ background: C.blue }}>
              <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700, color: "#fff" }}>SALDO FINAL DEL PERÍODO</td>
              {[d.capitalSocial + (d.aportacionesSocios || 0), d.reservaLegal + f.reservaEjercicio, d.utilidadesAnteriores + (d.dividendosPagados || 0), f.utilidadNeta, f.capitalFin].map((v, j) => (
                <td key={j} style={{ padding: "10px 12px", fontSize: 13, textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#fff" }}>{fmt(v)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[["Capital Inicio", fmt(f.capitalInicio), C.ink], ["Variación Neta", fmt(f.capitalFin - f.capitalInicio), f.capitalFin >= f.capitalInicio ? C.green : C.red], ["Capital Final", fmt(f.capitalFin), C.blue]].map(([l, v, c], i) => (
          <div key={i} style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace", marginBottom: 6, letterSpacing: 1 }}>{l}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: c, fontFamily: "Georgia, serif" }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── KPIs ─────────────────────────────────────────────────────────────────
function Kpis({ f }) {
  const grupos = [
    { titulo: "Rentabilidad", color: C.green, items: [
      { label: "Margen Bruto", value: pct(f.margenBruto), good: f.margenBruto > 30, sub: "Meta PYME: >30%" },
      { label: "Margen EBITDA", value: pct(f.ebitdaMargen), good: f.ebitdaMargen > 15, sub: "Meta: >15%" },
      { label: "Margen Neto", value: pct(f.margenNeto), good: f.margenNeto > 10, sub: "Meta: >10%" },
      { label: "ROI", value: pct(f.roi), good: f.roi > 15, sub: "Meta: >15%" },
    ]},
    { titulo: "Solvencia y Liquidez", color: C.blue, items: [
      { label: "Razón Circulante", value: fmtD(f.razonCirculante) + "x", good: f.razonCirculante > 1.5, sub: "Meta: >1.5x" },
      { label: "Prueba Ácida", value: fmtD(f.pruebaAcida) + "x", good: f.pruebaAcida > 1.0, sub: "Meta: >1.0x" },
      { label: "Endeudamiento", value: pct(f.endeudamiento), good: f.endeudamiento < 50, sub: "Meta: <50%" },
      { label: "Capitalización", value: pct(f.capitalizacion), good: f.capitalizacion > 40, sub: "Meta: >40%" },
    ]},
    { titulo: "Retorno", color: C.purple, items: [
      { label: "ROE", value: pct(f.roe), good: f.roe > 15, sub: "Retorno sobre capital" },
      { label: "ROA", value: pct(f.roa), good: f.roa > 5, sub: "Retorno sobre activos" },
      { label: "Días de Cobranza", value: fmtD(f.diasCobranza) + " días", good: f.diasCobranza < 45, sub: "Meta: <45 días" },
      { label: "Días de Inventario", value: fmtD(f.diasInventario) + " días", good: f.diasInventario < 60, sub: "Meta: <60 días" },
    ]},
  ];
  return (
    <div>
      {grupos.map((g, gi) => (
        <div key={gi} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: g.color, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700, borderBottom: `2px solid ${g.color}`, paddingBottom: 6, marginBottom: 14 }}>{g.titulo}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {g.items.map((item, i) => <KPICard key={i} {...item} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── REPORTE IA ────────────────────────────────────────────────────────────
function ReporteIA({ d, f, inputs }) {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = useCallback(async () => {
    setLoading(true);
    setReport("");
    const prompt = `Eres un Director Financiero (CFO) experto en PYMES mexicanas que también actúa como asesor financiero externo. Analiza integralmente los estados financieros de ${inputs.empresa} (RFC: ${inputs.rfc}, Giro: ${inputs.giro}) para ${MONTHS[inputs.mes - 1]} ${inputs.año}.

ESTADO DE RESULTADOS:
- Ventas Netas: ${fmt(f.ventasNetas)} | Variación vs mes ant: ${f.varVentas.toFixed(1)}%
- Costo de Ventas: ${fmt(f.costoVentas)} (${pct((f.costoVentas/f.ventasNetas)*100)} de ventas)
- Utilidad Bruta: ${fmt(f.utilidadBruta)} | Margen: ${pct(f.margenBruto)}
- EBITDA: ${fmt(f.ebitda)} | Margen: ${pct(f.ebitdaMargen)}
- Utilidad Operativa: ${fmt(f.utilidadOperativa)} | Margen: ${pct(f.margenOperativo)}
- ISR: ${fmt(f.isr)} | PTU: ${fmt(f.ptu)}
- Utilidad Neta: ${fmt(f.utilidadNeta)} | Margen Neto: ${pct(f.margenNeto)}

BALANCE: Activo Total ${fmt(f.totalActivo)} | Pasivo ${fmt(f.totalPasivo)} (${pct(f.endeudamiento)}) | Capital ${fmt(f.capitalContable)}
FLUJO: Operación ${fmt(f.flujoOperacion)} | Inversión ${fmt(f.flujoInversion)} | Financiamiento ${fmt(f.flujoFinanciamiento)} | Final ${fmt(f.efectivoFinal)}
KPIs: RC ${fmtD(f.razonCirculante)}x | PA ${fmtD(f.pruebaAcida)}x | ROE ${pct(f.roe)} | ROA ${pct(f.roa)} | Cobranza ${fmtD(f.diasCobranza)} días | Inventario ${fmtD(f.diasInventario)} días

Plan contratado: ${PLANES[inputs.plan]?.nombre || "Básico"}

Genera un reporte ejecutivo conciso con estas secciones exactas:

## 📊 RESUMEN EJECUTIVO
Diagnóstico integral del período en 2-3 párrafos, usando cifras específicas.

## 💪 FORTALEZAS DETECTADAS
3-5 puntos positivos con cifras de respaldo.

## ⚠️ ALERTAS Y ÁREAS DE MEJORA
3-5 riesgos o problemas con cifras y explicación de impacto.

## 🎯 EVALUACIÓN DE KPIs VS BENCHMARKS PYME MÉXICO
Tabla comparativa con evaluación: ✅ Óptimo / ⚠️ Mejorable / ❌ Crítico.

## 💡 RECOMENDACIONES ESTRATÉGICAS (TOP 5)
5 acciones concretas priorizadas, con estimado de mejora cuantificable.

## 📈 METAS PARA EL PRÓXIMO MES
3-4 objetivos específicos y medibles para el siguiente período.

Sé muy específico. Usa cifras del reporte. Habla como asesor profesional mexicano.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      setReport(data.content?.map(b => b.text || "").join("") || "Sin respuesta.");
    } catch { setReport("Error de conexión con el servidor de IA."); }
    setLoading(false);
  }, [d, f, inputs]);

  const renderMd = (text) => text.split("\n").map((line, i) => {
    if (line.startsWith("## ")) return <h3 key={i} style={{ color: C.blue, fontFamily: "Georgia, serif", fontSize: 15, margin: "22px 0 10px", borderBottom: `2px solid ${C.blue}20`, paddingBottom: 5 }}>{line.replace("## ", "")}</h3>;
    if (line.startsWith("- ") || line.startsWith("• ")) return <li key={i} style={{ color: C.muted, fontSize: 13, marginBottom: 5, marginLeft: 18, lineHeight: 1.65 }}>{line.replace(/^[-•]\s/, "")}</li>;
    if (line.trim() === "") return <br key={i} />;
    return <p key={i} style={{ color: C.muted, fontSize: 13, lineHeight: 1.75, marginBottom: 3 }}>{line.replace(/\*\*/g, "")}</p>;
  });

  return (
    <div>
      {!report && !loading && (
        <div style={{ textAlign: "center", padding: "50px 20px" }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>🤖</div>
          <div style={{ fontSize: 15, color: C.ink, marginBottom: 6, fontFamily: "Georgia, serif" }}>Análisis financiero con inteligencia artificial</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 28, maxWidth: 420, margin: "0 auto 28px" }}>
            El sistema analiza los 4 estados financieros y genera un reporte ejecutivo personalizado para {inputs.empresa}
          </div>
          <button onClick={generate} style={{ background: C.ink, color: "#fff", border: "none", padding: "13px 34px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 14, letterSpacing: 0.4, fontFamily: "monospace" }}>
            🤖 Generar Reporte CFO con IA
          </button>
        </div>
      )}
      {loading && (
        <div style={{ textAlign: "center", padding: "50px 20px" }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>⏳</div>
          <div style={{ color: C.muted, fontFamily: "monospace" }}>El CFO virtual está analizando los estados financieros...</div>
        </div>
      )}
      {report && !loading && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontSize: 11, color: C.muted, fontFamily: "monospace", letterSpacing: 1 }}>REPORTE CFO — {MONTHS[inputs.mes - 1].toUpperCase()} {inputs.año} — {inputs.empresa}</div>
            <button onClick={generate} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, padding: "5px 13px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: "monospace" }}>🔄 Regenerar</button>
          </div>
          <div>{renderMd(report)}</div>
        </div>
      )}
    </div>
  );
}

// ─── PANEL DE DATOS ────────────────────────────────────────────────────────
function PanelDatos({ inputs, setInputs }) {
  const [seccion, setSeccion] = useState("empresa");
  const secciones = [
    ["empresa", "🏢 Empresa"],
    ["er", "📋 Resultados"],
    ["ba", "📦 Activos"],
    ["bp", "💳 Pasivos/Capital"],
    ["fe", "💧 Flujo"],
    ["comp", "📊 Comparativo"],
  ];
  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {secciones.map(([k, l]) => (
          <button key={k} onClick={() => setSeccion(k)} style={{ background: seccion === k ? C.ink : C.faint, color: seccion === k ? "#fff" : C.muted, border: `1px solid ${C.border}`, padding: "6px 13px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: "monospace" }}>{l}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {seccion === "empresa" && <>
          <Field label="Nombre de la empresa" field="empresa" inputs={inputs} setInputs={setInputs} type="text" prefix={null} />
          <Field label="RFC" field="rfc" inputs={inputs} setInputs={setInputs} type="text" prefix={null} />
          <Field label="Giro del negocio" field="giro" inputs={inputs} setInputs={setInputs} type="text" prefix={null} />
          <Field label="Responsable / Director" field="responsable" inputs={inputs} setInputs={setInputs} type="text" prefix={null} />
          <Field label="Plan de servicio" field="plan" inputs={inputs} setInputs={setInputs} type="text" prefix={null}
            options={[{ value: "basico", label: "Plan Básico ($1,200–$2,500/mes)" }, { value: "premium", label: "Plan Premium ($2,500–$6,000/mes)" }]} />
          <Field label="Tasa ISR" field="tasaIsr" inputs={inputs} setInputs={setInputs} prefix="%" />
        </>}
        {seccion === "er" && <>
          <Field label="Ventas Brutas" field="ventasNetas" inputs={inputs} setInputs={setInputs} />
          <Field label="Devoluciones y Descuentos" field="devolucionesDescuentos" inputs={inputs} setInputs={setInputs} />
          <Field label="Costo Mercancía/Materiales" field="costoMercancia" inputs={inputs} setInputs={setInputs} />
          <Field label="Mano de Obra Directa" field="costoManoObra" inputs={inputs} setInputs={setInputs} />
          <Field label="Gastos Indirectos de Fabricación" field="costoGastosFabricacion" inputs={inputs} setInputs={setInputs} />
          <Field label="Gastos de Administración" field="gastosAdministracion" inputs={inputs} setInputs={setInputs} />
          <Field label="Gastos de Ventas" field="gastosVentas" inputs={inputs} setInputs={setInputs} />
          <Field label="Gastos de Marketing" field="gastosMarketing" inputs={inputs} setInputs={setInputs} />
          <Field label="Renta y Arrendamiento" field="gastosRenta" inputs={inputs} setInputs={setInputs} />
          <Field label="Servicios Públicos" field="gastosServicios" inputs={inputs} setInputs={setInputs} />
          <Field label="Depreciación y Amortización" field="gastosDepreciacion" inputs={inputs} setInputs={setInputs} />
          <Field label="Otros Gastos Operativos" field="otrosGastosOp" inputs={inputs} setInputs={setInputs} />
          <Field label="Productos Financieros" field="productoFinanciero" inputs={inputs} setInputs={setInputs} />
          <Field label="Gastos Financieros (intereses)" field="gastoFinanciero" inputs={inputs} setInputs={setInputs} />
          <Field label="Otros Ingresos" field="otrosIngresos" inputs={inputs} setInputs={setInputs} />
          <Field label="Otros Gastos" field="otrosGastos" inputs={inputs} setInputs={setInputs} />
        </>}
        {seccion === "ba" && <>
          <Field label="Caja y Efectivo" field="cajaEfectivo" inputs={inputs} setInputs={setInputs} />
          <Field label="Bancos" field="bancos" inputs={inputs} setInputs={setInputs} />
          <Field label="Inversiones Temporales" field="inversiones" inputs={inputs} setInputs={setInputs} />
          <Field label="Cuentas por Cobrar" field="cuentasPorCobrar" inputs={inputs} setInputs={setInputs} />
          <Field label="Inventarios" field="inventarios" inputs={inputs} setInputs={setInputs} />
          <Field label="Anticipos a Proveedores" field="anticipos" inputs={inputs} setInputs={setInputs} />
          <Field label="Terreno y Edificio" field="terrenoEdificio" inputs={inputs} setInputs={setInputs} />
          <Field label="Maquinaria y Equipo" field="maquinaria" inputs={inputs} setInputs={setInputs} />
          <Field label="Mobiliario" field="mobiliario" inputs={inputs} setInputs={setInputs} />
          <Field label="Equipo de Cómputo" field="equipo" inputs={inputs} setInputs={setInputs} />
          <Field label="Vehículos" field="vehiculos" inputs={inputs} setInputs={setInputs} />
          <Field label="Depreciación Acumulada (negativo)" field="depreciacionAcum" inputs={inputs} setInputs={setInputs} />
          <Field label="Activos Intangibles/Diferidos" field="activosDiferidos" inputs={inputs} setInputs={setInputs} />
        </>}
        {seccion === "bp" && <>
          <Field label="Proveedores" field="proveedores" inputs={inputs} setInputs={setInputs} />
          <Field label="Acreedores Diversos" field="acreedoresDiversos" inputs={inputs} setInputs={setInputs} />
          <Field label="Impuestos por Pagar" field="impuestosXPagar" inputs={inputs} setInputs={setInputs} />
          <Field label="Anticipos de Clientes" field="anticClientes" inputs={inputs} setInputs={setInputs} />
          <Field label="Deudas Largo Plazo" field="deudasLargoPlazo" inputs={inputs} setInputs={setInputs} />
          <Field label="Otros Pasivos L/P" field="otrosPasLP" inputs={inputs} setInputs={setInputs} />
          <Field label="Capital Social" field="capitalSocial" inputs={inputs} setInputs={setInputs} />
          <Field label="Reserva Legal" field="reservaLegal" inputs={inputs} setInputs={setInputs} />
          <Field label="Utilidades Anteriores" field="utilidadesAnteriores" inputs={inputs} setInputs={setInputs} />
        </>}
        {seccion === "fe" && <>
          <Field label="Cobranza a Clientes" field="cobranzaClientes" inputs={inputs} setInputs={setInputs} />
          <Field label="Pagos a Proveedores (negativo)" field="pagosProveedores" inputs={inputs} setInputs={setInputs} />
          <Field label="Pagos de Nómina (negativo)" field="pagosNomina" inputs={inputs} setInputs={setInputs} />
          <Field label="Pago de Impuestos (negativo)" field="pagosImpuestos" inputs={inputs} setInputs={setInputs} />
          <Field label="Compra de Activos (negativo)" field="compraActivos" inputs={inputs} setInputs={setInputs} />
          <Field label="Venta de Activos" field="ventaActivos" inputs={inputs} setInputs={setInputs} />
          <Field label="Inversiones (negativo)" field="inversionesFlujo" inputs={inputs} setInputs={setInputs} />
          <Field label="Préstamos Recibidos" field="prestamosRecibidos" inputs={inputs} setInputs={setInputs} />
          <Field label="Pago de Deudas (negativo)" field="pagoDeudas" inputs={inputs} setInputs={setInputs} />
          <Field label="Dividendos Pagados (negativo)" field="dividendosPagados" inputs={inputs} setInputs={setInputs} />
          <Field label="Efectivo Inicial del Período" field="efectivoInicial" inputs={inputs} setInputs={setInputs} />
        </>}
        {seccion === "comp" && <>
          <Field label="Ventas Netas Mes Anterior" field="ventasNetasMesAnt" inputs={inputs} setInputs={setInputs} />
          <Field label="Utilidad Neta Mes Anterior" field="utilidadNetaMesAnt" inputs={inputs} setInputs={setInputs} />
          <Field label="Efectivo Final Mes Anterior" field="efectivoMesAnt" inputs={inputs} setInputs={setInputs} />
        </>}
      </div>
    </div>
  );
}

// ─── PANEL NEGOCIO ─────────────────────────────────────────────────────────
function PanelNegocio({ inputs }) {
  const plan = PLANES[inputs.plan] || PLANES.basico;
  const clientes = [3, 5, 10, 15, 20];
  return (
    <div>
      {/* Plan activo */}
      <div style={{ background: C.paper, border: `2px solid ${plan.color}`, borderRadius: 14, padding: 24, marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: plan.color, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700 }}>Plan Contratado</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif", marginTop: 4 }}>{plan.icon} {plan.nombre}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>Empresa: <strong>{inputs.empresa}</strong> · RFC: {inputs.rfc}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: C.muted, fontFamily: "monospace" }}>Mensualidad</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: plan.color, fontFamily: "monospace" }}>${plan.precio} MXN</div>
            <div style={{ fontSize: 11, color: C.muted, fontFamily: "monospace" }}>Setup: ${plan.setup} MXN</div>
          </div>
        </div>

        <div style={{ marginTop: 16, borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 10, letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace" }}>Servicios incluidos</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            {[
              "✅ 4 estados financieros mensuales",
              "✅ Dashboard de KPIs en tiempo real",
              "✅ Detección automática de alertas",
              "✅ Reporte ejecutivo con IA (CFO Virtual)",
              inputs.plan === "premium" ? "✅ Asesoría personalizada mensual" : "— Asesoría personalizada (Plan Premium)",
              inputs.plan === "premium" ? "✅ Reuniones de estrategia" : "— Reuniones de estrategia (Plan Premium)",
              inputs.plan === "premium" ? "✅ Planificación financiera anual" : "— Planificación anual (Plan Premium)",
              inputs.plan === "premium" ? "✅ Soporte prioritario WhatsApp" : "— Soporte WhatsApp prioritario (Plan Premium)",
            ].map((item, i) => (
              <div key={i} style={{ fontSize: 12.5, color: item.startsWith("—") ? C.muted : C.ink }}>{item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Proyección de ingresos para el asesor */}
      <div style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1.2, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>Proyección de Ingresos para el Asesor (MXN/mes)</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
            <thead>
              <tr style={{ background: C.faint }}>
                <th style={{ padding: "8px 12px", fontSize: 11, textAlign: "left", fontFamily: "monospace", color: C.muted }}>Clientes</th>
                <th style={{ padding: "8px 12px", fontSize: 11, textAlign: "right", fontFamily: "monospace", color: C.muted }}>Solo Básico</th>
                <th style={{ padding: "8px 12px", fontSize: 11, textAlign: "right", fontFamily: "monospace", color: C.muted }}>Mix 50/50</th>
                <th style={{ padding: "8px 12px", fontSize: 11, textAlign: "right", fontFamily: "monospace", color: C.muted }}>Solo Premium</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((n, i) => (
                <tr key={n} style={{ background: i % 2 === 0 ? C.paper : C.faint }}>
                  <td style={{ padding: "8px 12px", fontSize: 13, fontFamily: "monospace", color: C.ink, fontWeight: 700 }}>{n} clientes</td>
                  <td style={{ padding: "8px 12px", fontSize: 13, fontFamily: "monospace", textAlign: "right", color: C.blue }}>${(n * 1850).toLocaleString()}</td>
                  <td style={{ padding: "8px 12px", fontSize: 13, fontFamily: "monospace", textAlign: "right", color: C.purple }}>${(Math.floor(n/2) * 1850 + Math.ceil(n/2) * 4250).toLocaleString()}</td>
                  <td style={{ padding: "8px 12px", fontSize: 13, fontFamily: "monospace", textAlign: "right", color: C.green }}>${(n * 4250).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>* Promedio de rangos. Básico: $1,850 | Premium: $4,250 promedio mensual.</div>
      </div>

      {/* Propuesta de valor */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {[
          { icon: "💡", title: "Claridad financiera", desc: "El cliente entiende cuánto gana realmente y dónde va su dinero, sin esfuerzo de su parte." },
          { icon: "⏱️", title: "Ahorro de tiempo", desc: "Automatización de reportes mensuales. Lo que tomaba días, se genera en minutos." },
          { icon: "📈", title: "Mejores decisiones", desc: "KPIs y análisis con IA para tomar decisiones basadas en datos, no intuición." },
        ].map((item, i) => (
          <div key={i} style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, fontFamily: "Georgia, serif", marginBottom: 6 }}>{item.title}</div>
            <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ─────────────────────────────────────────────────────────
export default function App() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [tab, setTab] = useState("dashboard");
  const [showData, setShowData] = useState(false);
  const fin = calcAll(inputs);

  const tabs = [
    ["dashboard", "📊 Dashboard"],
    ["er", "📋 Resultados"],
    ["bg", "⚖️ Balance"],
    ["fe", "💧 Flujo"],
    ["cc", "🏛️ Capital"],
    ["kpi", "🎯 KPIs"],
    ["ai", "🤖 CFO Virtual"],
    ["negocio", "💼 Negocio"],
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: C.ink, color: "#fff", padding: "0 28px" }}>
        <div style={{ maxWidth: 1380, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: -0.3 }}>
              Sistema Financiero Automatizado
            </div>
            <div style={{ fontSize: 11, color: "#7a8a8a", fontFamily: "monospace", letterSpacing: 1.2 }}>
              ASESOR FINANCIERO · ESTADOS FINANCIEROS + IA · MXN
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <input value={inputs.empresa} onChange={e => setInputs(p => ({ ...p, empresa: e.target.value }))}
              placeholder="Nombre empresa"
              style={{ background: "#252220", border: "1px solid #3a3632", color: "#fff", padding: "7px 12px", borderRadius: 6, fontSize: 13, width: 200, fontFamily: "monospace", outline: "none" }} />
            <select value={inputs.mes} onChange={e => setInputs(p => ({ ...p, mes: +e.target.value }))}
              style={{ background: "#252220", border: "1px solid #3a3632", color: "#fff", padding: "7px 10px", borderRadius: 6, fontSize: 13, fontFamily: "monospace" }}>
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <select value={inputs.año} onChange={e => setInputs(p => ({ ...p, año: +e.target.value }))}
              style={{ background: "#252220", border: "1px solid #3a3632", color: "#fff", padding: "7px 10px", borderRadius: 6, fontSize: 13, fontFamily: "monospace" }}>
              {[2023, 2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
            </select>
            <button onClick={() => setShowData(!showData)} style={{ background: showData ? "#3a3632" : "transparent", border: "1px solid #3a3632", color: "#ccc", padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: "monospace" }}>
              {showData ? "✕ Cerrar" : "✏️ Datos"}
            </button>
          </div>
        </div>

        {/* Barra de métricas */}
        <div style={{ borderTop: "1px solid #282420", padding: "12px 0", display: "flex", gap: 28, maxWidth: 1380, margin: "0 auto", flexWrap: "wrap" }}>
          {[
            ["Ventas Netas", fmt(fin.ventasNetas), fin.varVentas],
            ["Utilidad Bruta", fmt(fin.utilidadBruta) + " · " + pct(fin.margenBruto), null],
            ["EBITDA", fmt(fin.ebitda) + " · " + pct(fin.ebitdaMargen), null],
            ["Utilidad Neta", fmt(fin.utilidadNeta) + " · " + pct(fin.margenNeto), fin.varUtilidad],
            ["Total Activo", fmt(fin.totalActivo), null],
            ["Efectivo Final", fmt(fin.efectivoFinal), fin.varEfectivoMes],
          ].map(([l, v, va]) => (
            <div key={l}>
              <div style={{ fontSize: 9.5, color: "#6a7a7a", letterSpacing: 1.1, textTransform: "uppercase", fontFamily: "monospace" }}>{l}</div>
              <div style={{ fontSize: 12.5, color: "#e0dcd5", fontFamily: "monospace", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                {v}
                {va !== null && va !== undefined && (
                  <span style={{ fontSize: 10, color: va >= 0 ? "#5a9" : "#c55", fontWeight: 700 }}>
                    {va >= 0 ? "▲" : "▼"}{Math.abs(va).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1380, margin: "0 auto", padding: "22px 24px" }}>
        {/* Panel de datos */}
        {showData && (
          <div style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: 12, padding: 22, marginBottom: 22 }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, marginBottom: 14, color: C.ink }}>Ingresa los datos de tu negocio</div>
            <PanelDatos inputs={inputs} setInputs={setInputs} />
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
          {tabs.map(([k, l]) => <TabBtn key={k} active={tab === k} onClick={() => setTab(k)}>{l}</TabBtn>)}
        </div>

        {/* Contenido principal */}
        <div style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
          {/* Encabezado del estado */}
          {tab !== "dashboard" && tab !== "negocio" && (
            <div style={{ textAlign: "center", marginBottom: 22, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 4 }}>
                {tab === "er" ? "Estado de Resultados" : tab === "bg" ? "Balance General" : tab === "fe" ? "Estado de Flujo de Efectivo" : tab === "cc" ? "Estado de Cambios en el Capital Contable" : tab === "kpi" ? "Indicadores Financieros Clave" : "Análisis y Reporte Ejecutivo"}
              </div>
              <div style={{ fontSize: 19, fontWeight: 700, color: C.ink, fontFamily: "'Playfair Display', Georgia, serif" }}>{inputs.empresa}</div>
              <div style={{ fontSize: 12, color: C.muted, fontFamily: "monospace", marginTop: 4 }}>
                Por el mes terminado al 31 de {MONTHS[inputs.mes - 1]} de {inputs.año} · Cifras en pesos mexicanos (MXN) · RFC: {inputs.rfc}
              </div>
            </div>
          )}

          {tab === "dashboard" && <Dashboard d={inputs} f={fin} inputs={inputs} />}
          {tab === "er" && <EstadoResultados d={inputs} f={fin} />}
          {tab === "bg" && <BalanceGeneral d={inputs} f={fin} />}
          {tab === "fe" && <FlujoEfectivo d={inputs} f={fin} />}
          {tab === "cc" && <CambiosCapital d={inputs} f={fin} />}
          {tab === "kpi" && <Kpis f={fin} />}
          {tab === "ai" && <ReporteIA d={inputs} f={fin} inputs={inputs} />}
          {tab === "negocio" && <PanelNegocio inputs={inputs} />}
        </div>

        <div style={{ textAlign: "center", marginTop: 18, fontSize: 10.5, color: C.muted, fontFamily: "monospace" }}>
          Sistema de Estados Financieros Automatizados · Análisis IA · MXN · {inputs.empresa} · {MONTHS[inputs.mes - 1]} {inputs.año}
        </div>
      </div>
      <style>{`select option { background: #1a1612; }`}</style>
    </div>
  );
}
