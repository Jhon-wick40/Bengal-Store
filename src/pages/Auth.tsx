import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const Auth = () => {
  const [params] = useSearchParams();
  const initialMode = params.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => { if (user) navigate("/"); }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/`, data: { full_name: fullName } }
        });
        if (error) throw error;
        toast.success("Account created — you're signed in");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-md bg-card p-6">
        <h1 className="mb-4 text-2xl font-bold">{mode === "signup" ? "Create account" : "Sign in"}</h1>
        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full name" className="w-full rounded border border-border bg-background px-3 py-2" />
          )}
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full rounded border border-border bg-background px-3 py-2" />
          <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (min 6 chars)" className="w-full rounded border border-border bg-background px-3 py-2" />
          <button disabled={busy} className="w-full rounded-full bg-brand-yellow py-2 font-medium text-background hover:opacity-90 disabled:opacity-50">
            {busy ? "Please wait…" : (mode === "signup" ? "Sign up" : "Sign in")}
          </button>
        </form>
        <div className="mt-4 text-sm text-muted-foreground">
          {mode === "signup" ? (
            <>Already have an account? <button className="text-brand-orange hover:underline" onClick={() => setMode("signin")}>Sign in</button></>
          ) : (
            <>New here? <button className="text-brand-orange hover:underline" onClick={() => setMode("signup")}>Create an account</button></>
          )}
        </div>
        <Link to="/" className="mt-4 inline-block text-sm text-muted-foreground hover:underline">← Back to store</Link>
      </div>
    </div>
  );
};

export default Auth;
