"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const supabase = createBrowserSupabaseClient();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    setLoading(true);
    
    try {
      if (isRegistering) {
        // Supabase Registration
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        // Supabase sends confirmation email by default unless disabled in settings
        if (data.user?.identities?.length === 0) {
           toast.error("An account with this email already exists");
        } else {
           toast.success("Account created! Check your email to confirm if required, or sign in now.");
           setIsRegistering(false);
        }
      } else {
        // Supabase Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast.success("Successfully signed in!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      <div className="absolute bottom-0 left-[-20%] right-[-20%] top-[-10%] h-[500px] w-[140%] rounded-[100%] bg-primary/10 blur-[80px]" />

      {/* Header with Logo */}
      <div className="absolute top-8 left-8 z-20">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo />
        </Link>
      </div>

      <div className="w-full flex items-center justify-center relative z-10 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-3 pb-6">
              <CardTitle className="text-3xl font-bold tracking-tight text-center">
                {isRegistering ? "Create an account" : "Welcome back"}
              </CardTitle>
              <CardDescription className="text-center text-base">
                {isRegistering 
                  ? "Enter your details to get started with LedgerMind."
                  : "Sign in to your account to continue to the dashboard."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-background/50 border-border/50 focus:bg-background transition-colors"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 bg-background/50 border-border/50 focus:bg-background transition-colors"
                      required
                    />
                  </div>
                  {!isRegistering && (
                    <div className="flex justify-end pt-1">
                      <Link href="#" className="text-sm font-medium text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-medium mt-2" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      {isRegistering ? "Creating account..." : "Signing in..."}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {isRegistering ? "Create account" : "Sign In"}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col border-t border-border/50 pt-6 mt-2">
              <div className="text-center text-sm text-muted-foreground w-full">
                {isRegistering ? "Already have an account? " : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
                >
                  {isRegistering ? "Sign in" : "Sign up"}
                </button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
