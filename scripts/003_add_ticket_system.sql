-- Add ticket number and customer information to computers table
ALTER TABLE public.computers
ADD COLUMN IF NOT EXISTS ticket_number TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- Create index for faster ticket lookups
CREATE INDEX IF NOT EXISTS idx_computers_ticket_number ON public.computers(ticket_number);

-- Create function to generate unique ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  new_ticket TEXT;
  ticket_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate ticket in format: RT-YYYYMMDD-XXXX (RT = RepairTech)
    new_ticket := 'RT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
    -- Check if ticket already exists
    SELECT EXISTS(SELECT 1 FROM public.computers WHERE ticket_number = new_ticket) INTO ticket_exists;
    
    -- If ticket doesn't exist, return it
    IF NOT ticket_exists THEN
      RETURN new_ticket;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate ticket number on insert
CREATE OR REPLACE FUNCTION set_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL THEN
    NEW.ticket_number := generate_ticket_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_computer_ticket_number ON public.computers;
CREATE TRIGGER set_computer_ticket_number
  BEFORE INSERT ON public.computers
  FOR EACH ROW
  EXECUTE FUNCTION set_ticket_number();

-- Add policy to allow public read access by ticket number
CREATE POLICY "Anyone can view computer by ticket number"
  ON public.computers FOR SELECT
  USING (ticket_number IS NOT NULL);
