"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function SessionButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Carregando...</p>;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("github")}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Entrar com GitHub
      </button>
    );
  }

  return (
    <div>
      <p className="mb-2">Olá, {session.user?.name || session.user?.email}!</p>
      <button
        onClick={() => signOut()}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Sair
      </button>
    </div>
  );
}
