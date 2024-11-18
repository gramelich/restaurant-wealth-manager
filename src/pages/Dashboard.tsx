import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/components/ui/use-toast";
import { LayoutDashboard, Receipt, FileText, LogOut } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [transactions, setTransactions] = useState([]);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/");
      }
    });

    // Fetch transactions and bills
    fetchTransactions();
    fetchBills();
  }, [navigate]);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as transações",
        variant: "destructive",
      });
    } else {
      setTransactions(data || []);
    }
  };

  const fetchBills = async () => {
    const { data, error } = await supabase
      .from("bills")
      .select("*")
      .order("due_date", { ascending: true });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as contas",
        variant: "destructive",
      });
    } else {
      setBills(data || []);
    }
  };

  const transactionColumns = [
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

  const billColumns = [
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  Sistema Financeiro
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`${
                    activeTab === "overview"
                      ? "border-primary text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Visão Geral
                </button>
                <button
                  onClick={() => setActiveTab("transactions")}
                  className={`${
                    activeTab === "transactions"
                      ? "border-primary text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <Receipt className="mr-2 h-4 w-4" />
                  Transações
                </button>
                <button
                  onClick={() => setActiveTab("bills")}
                  className={`${
                    activeTab === "bills"
                      ? "border-primary text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Contas a Pagar
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => supabase.auth.signOut()}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === "overview" && (
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">
                    Total de Transações
                  </h3>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">
                    {transactions.length}
                  </p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">
                    Contas a Pagar
                  </h3>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">
                    {bills.filter((bill) => !bill.paid).length}
                  </p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">
                    Total em Contas
                  </h3>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">
                    R${" "}
                    {bills
                      .reduce((acc, bill) => acc + Number(bill.amount), 0)
                      .toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
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
              <DataTable columns={transactionColumns} data={transactions} />
            </div>
          </div>
        )}

        {activeTab === "bills" && (
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
              <DataTable columns={billColumns} data={bills} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;