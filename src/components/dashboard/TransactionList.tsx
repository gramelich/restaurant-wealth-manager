import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

interface TransactionListProps {
  transactions: any[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
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
    },
    {
      accessorKey: "category",
      header: "Categoria",
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
          <Button>Nova Transação</Button>
        </div>
      </div>
      <div className="mt-8">
        <DataTable columns={columns} data={transactions} />
      </div>
    </div>
  );
};