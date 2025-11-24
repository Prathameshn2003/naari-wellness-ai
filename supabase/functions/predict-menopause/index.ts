import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers } = await req.json();
    
    console.log('Processing Menopause prediction with answers:', answers);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user ID if authenticated
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Simple ML algorithm for Menopause risk calculation
    let riskScore = 0;
    const factors: any[] = [];

    // Age is the primary factor
    const age = parseInt(answers.age) || 0;
    if (age >= 50) {
      riskScore += 35;
      factors.push({ factor: 'Age 50 or above', impact: 'high', score: 35 });
    } else if (age >= 45) {
      riskScore += 25;
      factors.push({ factor: 'Age 45-49', impact: 'high', score: 25 });
    } else if (age >= 40) {
      riskScore += 15;
      factors.push({ factor: 'Age 40-44', impact: 'medium', score: 15 });
    }

    if (answers.irregularPeriods === 'yes') {
      riskScore += 20;
      factors.push({ factor: 'Irregular menstrual cycles', impact: 'high', score: 20 });
    }

    if (answers.hotFlashes === 'yes') {
      riskScore += 20;
      factors.push({ factor: 'Hot flashes or night sweats', impact: 'high', score: 20 });
    }

    if (answers.moodChanges === 'yes') {
      riskScore += 10;
      factors.push({ factor: 'Mood changes', impact: 'medium', score: 10 });
    }

    if (answers.sleepProblems === 'yes') {
      riskScore += 10;
      factors.push({ factor: 'Sleep disturbances', impact: 'medium', score: 10 });
    }

    if (answers.vaginalDryness === 'yes') {
      riskScore += 10;
      factors.push({ factor: 'Vaginal dryness', impact: 'medium', score: 10 });
    }

    if (answers.weightChanges === 'yes') {
      riskScore += 5;
      factors.push({ factor: 'Weight changes', impact: 'low', score: 5 });
    }

    if (answers.familyHistory === 'yes') {
      riskScore += 10;
      factors.push({ factor: 'Family history of early menopause', impact: 'medium', score: 10 });
    }

    // Determine risk level and stage
    let riskLevel = 'low';
    let stage = 'premenopausal';
    let confidence = 0;

    if (riskScore >= 70) {
      riskLevel = 'high';
      stage = 'likely perimenopausal or menopausal';
      confidence = 85;
    } else if (riskScore >= 40) {
      riskLevel = 'moderate';
      stage = 'possible early perimenopause';
      confidence = 75;
    } else {
      riskLevel = 'low';
      stage = 'premenopausal';
      confidence = 70;
    }

    // Save prediction to database
    const { data: prediction, error: dbError } = await supabase
      .from('predictions')
      .insert({
        user_id: userId,
        prediction_type: 'menopause',
        answers: answers,
        risk_score: riskScore,
        risk_level: riskLevel,
        confidence: confidence,
        factors: factors,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    console.log('Menopause prediction saved:', prediction.id);

    // Return prediction results
    return new Response(
      JSON.stringify({
        id: prediction.id,
        riskScore,
        riskLevel,
        stage,
        confidence,
        factors,
        symptomAnalysis: generateSymptomAnalysis(answers),
        recommendations: generateRecommendations(riskLevel, stage),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in Menopause prediction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Prediction failed';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function generateSymptomAnalysis(answers: any) {
  const symptoms = [];
  if (answers.irregularPeriods === 'yes') symptoms.push({ name: 'Irregular Periods', severity: 85 });
  if (answers.hotFlashes === 'yes') symptoms.push({ name: 'Hot Flashes', severity: 90 });
  if (answers.moodChanges === 'yes') symptoms.push({ name: 'Mood Changes', severity: 65 });
  if (answers.sleepProblems === 'yes') symptoms.push({ name: 'Sleep Problems', severity: 70 });
  if (answers.vaginalDryness === 'yes') symptoms.push({ name: 'Vaginal Dryness', severity: 60 });
  
  return symptoms.length > 0 ? symptoms : [{ name: 'No significant symptoms', severity: 20 }];
}

function generateRecommendations(riskLevel: string, stage: string) {
  const baseRecommendations = {
    dietary: [
      'Increase calcium and vitamin D intake',
      'Include soy products for natural phytoestrogens',
      'Stay hydrated and limit caffeine',
    ],
    exercise: [
      'Weight-bearing exercises for bone health',
      'Regular cardiovascular exercise',
      'Pelvic floor exercises',
    ],
    lifestyle: [
      'Maintain a healthy sleep routine',
      'Practice stress management techniques',
      'Avoid smoking and limit alcohol',
    ],
  };

  if (riskLevel === 'high') {
    baseRecommendations.dietary.unshift('Consider discussing hormone therapy with your doctor');
    baseRecommendations.lifestyle.unshift('Schedule an appointment with a gynecologist or menopause specialist');
  }

  return baseRecommendations;
}
