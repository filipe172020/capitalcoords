import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    const { email, password, username } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
    }

    const client = await pool.connect();

    const existing = await client.query('SELECT id FROM "users" WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      client.release();
      return NextResponse.json({ error: "Usuário já cadastrado" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
      'INSERT INTO "users" (email, password, name) VALUES ($1, $2, $3) RETURNING id, email',
      [email, hashedPassword, username]
    );

    const user = result.rows[0];
    client.release();

    if (!JWT_SECRET) throw new Error("JWT_SECRET não definido");

    const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: "1h" });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
