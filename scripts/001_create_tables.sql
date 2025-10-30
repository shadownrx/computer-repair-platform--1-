-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create computers table
CREATE TABLE IF NOT EXISTS public.computers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  serial_number TEXT,
  issue_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'needs_repair')),
  technician_notes TEXT,
  estimated_cost DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on computers
ALTER TABLE public.computers ENABLE ROW LEVEL SECURITY;

-- Computers policies - users can only see their own computers
CREATE POLICY "Users can view their own computers"
  ON public.computers FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own computers"
  ON public.computers FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own computers"
  ON public.computers FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own computers"
  ON public.computers FOR DELETE
  USING (auth.uid() = owner_id);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  computer_id UUID REFERENCES public.computers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for computers table
DROP TRIGGER IF EXISTS update_computers_updated_at ON public.computers;
CREATE TRIGGER update_computers_updated_at
  BEFORE UPDATE ON public.computers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to auto-create notification when computer status changes
CREATE OR REPLACE FUNCTION notify_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (user_id, computer_id, title, message)
    VALUES (
      NEW.owner_id,
      NEW.id,
      'Estado de computadora actualizado',
      'El estado de tu ' || NEW.brand || ' ' || NEW.model || ' ha cambiado a: ' || NEW.status
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status change notifications
DROP TRIGGER IF EXISTS computer_status_change ON public.computers;
CREATE TRIGGER computer_status_change
  AFTER UPDATE ON public.computers
  FOR EACH ROW
  EXECUTE FUNCTION notify_status_change();
