-- Create predictions table to store all disease risk predictions
CREATE TABLE public.predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  prediction_type TEXT NOT NULL CHECK (prediction_type IN ('pcos', 'menopause')),
  answers JSONB NOT NULL,
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'moderate', 'high')),
  confidence DECIMAL(5,2),
  factors JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own predictions
CREATE POLICY "Users can view their own predictions"
ON public.predictions
FOR SELECT
USING (user_id IS NULL OR auth.uid() = user_id);

-- Create policy for anyone to insert predictions (for anonymous users)
CREATE POLICY "Anyone can create predictions"
ON public.predictions
FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_predictions_user_id ON public.predictions(user_id);
CREATE INDEX idx_predictions_type ON public.predictions(prediction_type);
CREATE INDEX idx_predictions_created_at ON public.predictions(created_at DESC);