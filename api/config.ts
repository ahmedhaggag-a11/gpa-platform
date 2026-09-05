import { supabase } from "@/lib/supabaseClient";


export const getAccessToken = async () => {
  const token = (await supabase.auth.getSession())?.data.session?.access_token
  return  token
};
