import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

interface CrmUserRow {
  id: number;
  username: string;
  password_hash: string;
  nombre: string;
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
          "SELECT id, username, password_hash, nombre FROM crm_usuarios WHERE username = $1 AND activo = true",
          [username]
        );
        const user = rows[0];
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return null;

        return { id: String(user.id), name: user.nombre, email: user.username };
      },
    }),
  ],
  pages: { signIn: "/crm/login" },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
