import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

const formSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.string().min(1, "Valor é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatória"),
  due_date: z.string().min(1, "Data de vencimento é obrigatória"),
  paid: z.boolean().optional(),
  paid_date: z.string().optional(),
  payment_method_id: z.string().optional(),
  actual_amount: z.string().optional(),
  interest_amount: z.string().optional(),
  account_id: z.string().min(1, "Conta contábil é obrigatória"),
});

interface BillFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editData?: any;
}

export const BillForm = ({
  open,
  onOpenChange,
  onSuccess,
  editData,
}: BillFormProps) => {
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: editData?.description || "",
      amount: editData?.amount?.toString() || "",
      category: editData?.category || "",
      due_date: editData?.due_date?.split("T")[0] || new Date().toISOString().split("T")[0],
      paid: editData?.paid || false,
      paid_date: editData?.paid_date?.split("T")[0] || "",
      payment_method_id: editData?.payment_method_id || "",
      actual_amount: editData?.actual_amount?.toString() || "",
      interest_amount: editData?.interest_amount?.toString() || "",
      account_id: editData?.account_id || "",
    },
  });

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const { data } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("active", true);
      setPaymentMethods(data || []);
    };

    const fetchAccounts = async () => {
      const { data } = await supabase
        .from("chart_of_accounts")
        .select("*")
        .eq("active", true);
      setAccounts(data || []);
    };

    fetchPaymentMethods();
    fetchAccounts();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const billData = {
      description: values.description,
      amount: Number(values.amount),
      category: values.category,
      due_date: new Date(values.due_date).toISOString(),
      paid: values.paid,
      paid_date: values.paid_date ? new Date(values.paid_date).toISOString() : null,
      payment_method_id: values.payment_method_id || null,
      actual_amount: values.actual_amount ? Number(values.actual_amount) : null,
      interest_amount: values.interest_amount ? Number(values.interest_amount) : null,
      account_id: values.account_id,
    };

    const { error } = editData
      ? await supabase.from("bills").update(billData).eq("id", editData.id)
      : await supabase.from("bills").insert(billData);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar conta",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: `Conta ${editData ? "atualizada" : "criada"} com sucesso`,
    });
    form.reset();
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Editar" : "Nova"} Conta</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="moradia">Moradia</SelectItem>
                      <SelectItem value="servicos">Serviços</SelectItem>
                      <SelectItem value="impostos">Impostos</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="account_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conta Contábil</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a conta contábil" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.code} - {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Vencimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pago?</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={field.value ? "true" : "false"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Sim</SelectItem>
                      <SelectItem value="false">Não</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("paid") && (
              <>
                <FormField
                  control={form.control}
                  name="paid_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Pagamento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="payment_method_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forma de Pagamento</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a forma de pagamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method.id} value={method.id}>
                              {method.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="actual_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Pago</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="interest_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor dos Juros</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <Button type="submit" className="w-full">
              {editData ? "Atualizar" : "Criar"} Conta
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};