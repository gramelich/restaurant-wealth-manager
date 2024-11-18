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
import { Card } from "@/components/ui/card";
import { LineChart } from "@/components/ui/LineChart"; // Supondo que você tenha um componente de gráfico

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [transactions, setTransactions] = useState([]);
  const [bills, setBills] = useState([]);
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
      .ilike("account", `%${filter.account}%`)
      .ilike("supplier", `%${filter.supplier}%`)
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
      .ilike("account", `%${filter.account}%`)
      .ilike("supplier", `%${filter.supplier}%`)
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        <div className="bg-gray-200 w-full lg:w-64 p-4">
          <Button onClick={() => setActiveTab("overview")}>Visão Geral</Button>
          <Button onClick={() => setActiveTab("transactions")}>Transações</Button>
          <Button onClick={() => setActiveTab("bills")}>Contas</Button>
        </div>

        <div className="flex-1 p-6 space-y-6">
          <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="mb-6 flex space-x-4 flex-wrap">
            <div className="flex flex-col">
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

            <div className="flex flex-col">
              <label>Plano de Contas:</label>
              <input
                type="text"
                name="account"
                value={filter.account}
                onChange={handleFilterChange}
                className="p-2 border rounded"
              />
            </div>

            <div className="flex flex-col">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-bold">Receitas vs Despesas</h3>
              <LineChart data={transactions} />
            </Card>
            <Card>
              <h3 className="font-bold">Visão Geral das Contas</h3>
              <LineChart data={bills} />
            </Card>
          </div>

          {/* Exibição das transações e contas */}
          {activeTab === "overview" && <Overview transactions={transactions} bills={bills} />}
          {activeTab === "transactions" && <TransactionList transactions={transactions} />}
          {activeTab === "bills" && <BillList bills={bills} />}
        </div>
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
