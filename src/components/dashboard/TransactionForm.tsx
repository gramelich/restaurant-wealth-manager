import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";

const TransactionsList = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      // Data de hoje e data 7 dias atrás
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .gte("date", sevenDaysAgo.toISOString().split("T")[0])
        .lte("date", today.toISOString().split("T")[0])
        .order("date", { ascending: false });

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao buscar transações",
          variant: "destructive",
        });
        return;
      }

      setTransactions(data || []);
    };

    fetchTransactions();
  }, [toast]);

  return (
    <div>
      {transactions.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Descrição</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}
    </div>
  );
};

export default TransactionsList;
