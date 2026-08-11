-- 1. Enable Row Level Security on the transactions table
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 2. Drop any existing permissive policies (if any)
DROP POLICY IF EXISTS "Enable all access" ON public.transactions;
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete their own transactions" ON public.transactions;

-- 3. Create strict policies that enforce user isolation
-- Users can only SELECT their own data
CREATE POLICY "Users can view their own transactions" 
ON public.transactions FOR SELECT 
USING (auth.uid()::text = "userId");

-- Users can only INSERT data where userId matches their authenticated ID
CREATE POLICY "Users can insert their own transactions" 
ON public.transactions FOR INSERT 
WITH CHECK (auth.uid()::text = "userId");

-- Users can only UPDATE their own data
CREATE POLICY "Users can update their own transactions" 
ON public.transactions FOR UPDATE 
USING (auth.uid()::text = "userId")
WITH CHECK (auth.uid()::text = "userId");

-- Users can only DELETE their own data
CREATE POLICY "Users can delete their own transactions" 
ON public.transactions FOR DELETE 
USING (auth.uid()::text = "userId");
