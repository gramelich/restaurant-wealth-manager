import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <button
        onClick={() => supabase.auth.signOut()}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Sair
      </button>
    </div>
  );
};

export default Dashboard;