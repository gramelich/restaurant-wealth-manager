import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Overview } from "@/components/dashboard/Overview";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { BillList } from "@/components/dashboard/BillList";
import { ChartOfAccountsForm } from "@/components/dashboard/ChartOfAccountsForm";
import { PaymentMethodForm } from "@/components/dashboard/PaymentMethodForm";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [transactions, setTransactions] = useState([]);
  const [bills, setBills] = useState([]);
  const [chartOfAccountsOpen, setChartOfAccountsOpen] = useState(false);
  const [paymentMethodOpen, setPaymentMethodOpen] = useState(false);
  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
    account: "",
    supplier: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/");
      }
    });

    fetchTransactions();
    fetchBills();
  }, [navigate, filter]);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .gte("date", filter.startDate)
      .lte("date", filter.endDate)
      .ilike("account", `%${filter.account}%`)  // Filtro por plano de contas
      .ilike("supplier", `%${filter.supplier}%`) // Filtro por fornecedor
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
      .gte("due_date", filter.startDate)
      .lte("due_date", filter.endDate)
      .ilike("account", `%${filter.account}%`)  // Filtro por plano de contas
      .ilike("supplier", `%${filter.supplier}%`) // Filtro por fornecedor
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

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="bg-gray-200 w-64 p-4">
        <Button onClick={() => setActiveTab("overview")}>Visão Geral</Button>
        <Button onClick={() => setActiveTab("transactions")}>Transações</Button>
        <Button onClick={() => setActiveTab("bills")}>Contas</Button>
      </div>

      <div className="flex-1 p-6">
        <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Filtros de data e categoria */}
        <div className="mb-6 flex space-x-4">
          <div>
            <label>Período:</label>
            <div className="flex space-x-2">
              <input
                type="date"
                name="startDate"
                value={filter.startDate}
                onChange={handleFilterChange}
                className="p-2 border rounded"
              />
              <span>até</span>
              <input
                type="date"
                name="endDate"
                value={filter.endDate}
                onChange={handleFilterChange}
                className="p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label>Plano de Contas:</label>
            <input
              type="text"
              name="account"
              value={filter.account}
              onChange={handleFilterChange}
              className="p-2 border rounded"
            />
          </div>

          <div>
            <label>Fornecedor:</label>
            <input
              type="text"
              name="supplier"
              value={filter.supplier}
              onChange={handleFilterChange}
              className="p-2 border rounded"
            />
          </div>
        </div>

        {/* Exibição das transações e contas */}
        {activeTab === "overview" && <Overview transactions={transactions} bills={bills} />}
        {activeTab === "transactions" && <TransactionList transactions={transactions} />}
        {activeTab === "bills" && <BillList bills={bills} />}
      </div>

      <ChartOfAccountsForm
        open={chartOfAccountsOpen}
        onOpenChange={setChartOfAccountsOpen}
        onSuccess={() => window.location.reload()}
      />
      <PaymentMethodForm
        open={paymentMethodOpen}
        onOpenChange={setPaymentMethodOpen}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
};

export default Dashboard;
