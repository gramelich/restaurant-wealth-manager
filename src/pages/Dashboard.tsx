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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/");
      }
    });

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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-end space-x-4">
          <Button onClick={() => setChartOfAccountsOpen(true)}>
            Novo Plano de Contas
          </Button>
          <Button onClick={() => setPaymentMethodOpen(true)}>
            Nova Forma de Pagamento
          </Button>
        </div>
        {activeTab === "overview" && (
          <Overview transactions={transactions} bills={bills} />
        )}
        {activeTab === "transactions" && (
          <TransactionList transactions={transactions} />
        )}
        {activeTab === "bills" && <BillList bills={bills} />}
      </main>
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