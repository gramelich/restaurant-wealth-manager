import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Overview } from "@/components/dashboard/Overview";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { BillList } from "@/components/dashboard/BillList";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [transactions, setTransactions] = useState([]);
  const [bills, setBills] = useState([]);

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
        {activeTab === "overview" && (
          <Overview transactions={transactions} bills={bills} />
        )}
        {activeTab === "transactions" && (
          <TransactionList transactions={transactions} />
        )}
        {activeTab === "bills" && <BillList bills={bills} />}
      </main>
    </div>
  );
};

export default Dashboard;