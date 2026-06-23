"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      username: fd.get("username"),
      password: fd.get("password"),
      redirect: false,
    });
    if (res?.error) {
      setError("Usuario o contraseña incorrectos.");
      setLoading(false);
    } else {
      window.location.href = "/crm";
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-brand-surface2 p-8"
      >
        <h1 className="font-heading text-2xl text-brand-text">Acceso CRM</h1>
        <p className="mt-1 text-sm text-brand-text/50">Juare Tires</p>

        <div className="mt-6 flex flex-col gap-4">
          <input
            name="username"
            type="text"
            placeholder="Usuario"
            required
            className="rounded-lg border border-white/10 bg-brand-surface px-4 py-3 text-sm text-brand-text placeholder:text-brand-text/30 focus:border-brand-primary focus:outline-none"
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            required
            className="rounded-lg border border-white/10 bg-brand-surface px-4 py-3 text-sm text-brand-text placeholder:text-brand-text/30 focus:border-brand-primary focus:outline-none"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-brand-primary py-3 font-heading text-brand-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </div>
      </form>
    </main>
  );
}
