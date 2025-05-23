import { CadastroForm } from "@/components/cadastro-form";


export default function Cadastro() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <CadastroForm />
      </div>
    </div>
  )
}