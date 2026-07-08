import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

interface CrmUserRow {
  id: number;
  username: string;
  password_hash: string;
  nombre: string;
  rol: string;
}

declare module "next-auth" {
  interface User { rol?: string }
  interface Session { user: { rol?: string; name?: string | null; email?: string | null } }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Usuario" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        const username = credentials?.username;
        const password = credentials?.password;
        if (typeof username !== "string" || typeof password !== "string") return null;

        const { rows } = await query<CrmUserRow>(
          `SELECT id, username, password_hash, nombre, rol
           FROM crm_usuarios WHERE username = $1 AND activo = true`,
          [username]
        );
        const user = rows[0];
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return null;

        return { id: String(user.id), name: user.nombre, email: user.username, rol: user.rol };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.rol = (user as { rol?: string }).rol;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.rol = token.rol as string | undefined;
      return session;
    },
  },
  pages: { signIn: "/crm/login" },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
