import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

interface BillListProps {
  bills: any[];
}

export const BillList = ({ bills }: BillListProps) => {
  const columns = [
    {
      accessorKey: "due_date",
      header: "Vencimento",
      cell: ({ row }) => new Date(row.getValue("due_date")).toLocaleDateString(),
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
      accessorKey: "paid",
      header: "Status",
      cell: ({ row }) => (row.getValue("paid") ? "Pago" : "Em aberto"),
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
          <h2 className="text-xl font-semibold text-gray-900">
            Contas a Pagar
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            Lista de todas as contas a pagar
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button>Nova Conta</Button>
        </div>
      </div>
      <div className="mt-8">
        <DataTable columns={columns} data={bills} />
      </div>
    </div>
  );
};