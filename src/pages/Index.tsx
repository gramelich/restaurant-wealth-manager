import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sistema Financeiro para Restaurantes
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Faça login ou crie sua conta
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: "Email",
                password_label: "Senha",
                button_label: "Entrar",
              },
              sign_up: {
                email_label: "Email",
                password_label: "Senha",
                button_label: "Cadastrar",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Index;