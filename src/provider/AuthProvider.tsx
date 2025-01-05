import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../initSupabase";
import { Session } from "@supabase/supabase-js";

type ContextProps = {
  user: null | boolean;
  session: Session | null;
};

const AuthContext = createContext<Partial<ContextProps>>({});

interface Props {
  children: React.ReactNode;
}

const AuthProvider = (props: Props) => {
  // user null = loading
  const [user, setUser] = useState<null | boolean>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Remplacer session() par getSession()
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession(); // Utilisation de getSession()
      setSession(session);
      setUser(session ? true : false);
    };

    fetchSession(); // Récupérer la session au démarrage

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Supabase auth event: ${event}`);
        setSession(session);
        setUser(session ? true : false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
      // Nettoyer l'écouteur lors du démontage du composant
    };
  }, []); // On écoute un seul fois au montage du composant

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
