"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

function esIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function esStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export default function PushSetup() {
  const [estado, setEstado] = useState<
    "cargando" | "no-soportado" | "activar" | "activo" | "denegado" | "activando" | "error"
  >("cargando");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function revisar() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setEstado("no-soportado");
        return;
      }
      if (esIOS() && !esStandalone()) {
        // Safari en iOS solo soporta push si el sitio se agregó a la pantalla
        // de inicio -- fuera de eso pushManager.subscribe truena en silencio.
        setEstado("activar");
        setError("ios-no-instalado");
        return;
      }
      if (Notification.permission === "denied") {
        setEstado("denegado");
        return;
      }
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        const sub = await reg.pushManager.getSubscription();
        setEstado(sub ? "activo" : "activar");
      } catch {
        setEstado("no-soportado");
      }
    }
    revisar();
  }, []);

  async function activar() {
    setEstado("activando");
    setError(null);
    try {
      if (esIOS() && !esStandalone()) {
        throw new Error(
          "En iPhone primero agrega esta página a tu pantalla de inicio (botón compartir → Agregar a inicio) y ábrela desde ahí."
        );
      }

      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error("Notificaciones sin configurar en el servidor. Avísale a soporte.");
      }

      const permiso = await Notification.requestPermission();
      if (permiso !== "granted") {
        setEstado("denegado");
        return;
      }

      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const res = await fetch("/api/crm/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
      if (!res.ok) {
        throw new Error("El servidor no pudo guardar la suscripción. Intenta de nuevo.");
      }

      setEstado("activo");
    } catch (err) {
      setEstado("error");
      setError(err instanceof Error ? err.message : "No se pudo activar. Intenta de nuevo.");
    }
  }

  if (estado === "cargando" || estado === "no-soportado" || estado === "activo") return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex max-w-xs items-center gap-3 rounded-2xl border border-brand-primary/40 bg-brand-surface2 p-4 shadow-2xl">
      <span className="text-2xl">🔔</span>
      <div className="flex-1 text-xs text-brand-text/70">
        {estado === "denegado" ? (
          <>Bloqueaste las notificaciones. Actívalas desde el ícono 🔒 junto a la URL del navegador.</>
        ) : estado === "error" ? (
          <span className="text-red-400">{error}</span>
        ) : error === "ios-no-instalado" ? (
          <>En iPhone: toca compartir → Agregar a inicio, y ábrela desde ahí para poder activar.</>
        ) : (
          <>Activa notificaciones para enterarte al instante cuando te asignen un lead.</>
        )}
      </div>
      {(estado === "activar" || estado === "error" || estado === "activando") && (
        <button
          type="button"
          onClick={activar}
          disabled={estado === "activando"}
          className="shrink-0 rounded-full bg-brand-primary px-3 py-1.5 font-heading text-xs text-brand-bg hover:opacity-90 disabled:opacity-50"
        >
          {estado === "activando" ? "Activando…" : estado === "error" ? "Reintentar" : "Activar"}
        </button>
      )}
    </div>
  );
}
