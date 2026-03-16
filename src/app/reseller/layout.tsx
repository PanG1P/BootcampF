import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ResellerLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-100">

      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-bold">Reseller Panel</h1>
      </header>

      <main className="p-6">
        {children}
      </main>

    </div>
  );
}