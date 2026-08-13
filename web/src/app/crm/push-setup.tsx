"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export default function PushSetup() {
  const [estado, setEstado] = useState<"cargando" | "no-soportado" | "activar" | "activo" | "denegado">(
    "cargando"
  );

  useEffect(() => {
    async function revisar() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setEstado("no-soportado");
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
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) return;

    const permiso = await Notification.requestPermission();
    if (permiso !== "granted") {
      setEstado("denegado");
      return;
    }

    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    await fetch("/api/crm/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });

    setEstado("activo");
  }

  if (estado === "cargando" || estado === "no-soportado" || estado === "activo") return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex max-w-xs items-center gap-3 rounded-2xl border border-brand-primary/40 bg-brand-surface2 p-4 shadow-2xl">
      <span className="text-2xl">🔔</span>
      <div className="flex-1 text-xs text-brand-text/70">
        {estado === "denegado" ? (
          <>Bloqueaste las notificaciones. Actívalas desde el ícono 🔒 junto a la URL del navegador.</>
        ) : (
          <>Activa notificaciones para enterarte al instante cuando te asignen un lead.</>
        )}
      </div>
      {estado === "activar" && (
        <button
          type="button"
          onClick={activar}
          className="shrink-0 rounded-full bg-brand-primary px-3 py-1.5 font-heading text-xs text-brand-bg hover:opacity-90"
        >
          Activar
        </button>
      )}
    </div>
  );
}
