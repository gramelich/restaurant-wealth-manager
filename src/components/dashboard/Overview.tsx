interface OverviewProps {
  transactions: any[];
  bills: any[];
}

export const Overview = ({ transactions, bills }: OverviewProps) => {
  return (
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
  );
};