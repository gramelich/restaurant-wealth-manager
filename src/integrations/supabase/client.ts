// Este arquivo é gerado automaticamente. Não edite diretamente.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://nwthziuaddvhbkxuxhtb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53dGh6aXVhZGR2aGJreHV4aHRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5NTc1MzIsImV4cCI6MjA0NzUzMzUzMn0.mGUwY5xqF6muUM5CA1sA872XUuYdlol9FezBOF88drY";

// Importe o cliente supabase assim:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
