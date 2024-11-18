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
  const [filter, setFilter] = useState({ date: "", type: "" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      .order("date", { ascending: false })
      .match(filter);

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
      .order("due_date", { ascending: true })
      .match(filter);

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

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className={`bg-gray-200 w-64 p-4 transition-transform ${isSidebarOpen ? 'transform-none' : 'transform -translate-x-full'}`}>
        <Button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mb-4">
          ☰
        </Button>
        <div className="space-y-4">
          <Button onClick={() => setActiveTab("overview")}>Visão Geral</Button>
          <Button onClick={() => setActiveTab("transactions")}>Transações</Button>
          <Button onClick={() => setActiveTab("bills")}>Contas</Button>
        </div>
      </div>

      <div className="flex-1 p-6">
        <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="mb-6">
          <input
            type="date"
            onChange={(e) => setFilter((prev) => ({ ...prev, date: e.target.value }))}
            className="p-2 border rounded"
          />
          <select
            onChange={(e) => setFilter((prev) => ({ ...prev, type: e.target.value }))}
            className="p-2 border rounded ml-4"
          >
            <option value="">Tipo</option>
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
          </select>
        </div>

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
