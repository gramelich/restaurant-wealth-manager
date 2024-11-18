import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { TransactionForm } from "./TransactionForm";

interface TransactionListProps {
  transactions: any[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  const [open, setOpen] = useState(false);

  const columns = [
    {
      accessorKey: "date",
      header: "Data",
      cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString(),
    },
    {
      accessorKey: "description",
      header: "Descrição",
    },
    {
      accessorKey: "amount",
      header: "Valor",
      cell: ({ row }) => `R$ ${Number(row.getValue("amount")).toFixed(2)}`,
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) =>
        row.getValue("type") === "receita" ? "Receita" : "Despesa",
    },
    {
      accessorKey: "category",
      header: "Categoria",
      cell: ({ row }) => {
        const category = row.getValue("category");
        const categories = {
          alimentacao: "Alimentação",
          transporte: "Transporte",
          moradia: "Moradia",
          saude: "Saúde",
          educacao: "Educação",
          lazer: "Lazer",
          outros: "Outros",
        };
        return categories[category as keyof typeof categories] || category;
      },
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900">Transações</h2>
          <p className="mt-2 text-sm text-gray-700">
            Lista de todas as transações realizadas
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button onClick={() => setOpen(true)}>Nova Transação</Button>
        </div>
      </div>
      <div className="mt-8">
        <DataTable columns={columns} data={transactions} />
      </div>
      <TransactionForm
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
};