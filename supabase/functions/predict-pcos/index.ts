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
    
    console.log('Processing PCOS prediction with answers:', answers);

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

    // Simple ML algorithm for PCOS risk calculation
    // Based on common risk factors for PCOS
    let riskScore = 0;
    const factors: any[] = [];

    // Question scoring logic
    if (answers.irregularPeriods === 'yes') {
      riskScore += 25;
      factors.push({ factor: 'Irregular menstrual cycles', impact: 'high', score: 25 });
    }

    if (answers.weightGain === 'yes') {
      riskScore += 15;
      factors.push({ factor: 'Unexplained weight gain', impact: 'medium', score: 15 });
    }

    if (answers.acne === 'yes') {
      riskScore += 10;
      factors.push({ factor: 'Persistent acne', impact: 'medium', score: 10 });
    }

    if (answers.hairGrowth === 'yes') {
      riskScore += 15;
      factors.push({ factor: 'Excess facial/body hair', impact: 'medium', score: 15 });
    }

    if (answers.hairLoss === 'yes') {
      riskScore += 10;
      factors.push({ factor: 'Hair thinning or loss', impact: 'medium', score: 10 });
    }

    if (answers.darkPatches === 'yes') {
      riskScore += 10;
      factors.push({ factor: 'Dark skin patches', impact: 'low', score: 10 });
    }

    if (answers.familyHistory === 'yes') {
      riskScore += 15;
      factors.push({ factor: 'Family history of PCOS', impact: 'high', score: 15 });
    }

    // Determine risk level
    let riskLevel = 'low';
    let confidence = 0;

    if (riskScore >= 70) {
      riskLevel = 'high';
      confidence = 85;
    } else if (riskScore >= 40) {
      riskLevel = 'moderate';
      confidence = 75;
    } else {
      riskLevel = 'low';
      confidence = 70;
    }

    // Save prediction to database
    const { data: prediction, error: dbError } = await supabase
      .from('predictions')
      .insert({
        user_id: userId,
        prediction_type: 'pcos',
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

    console.log('PCOS prediction saved:', prediction.id);

    // Return prediction results
    return new Response(
      JSON.stringify({
        id: prediction.id,
        riskScore,
        riskLevel,
        confidence,
        factors,
        symptomAnalysis: generateSymptomAnalysis(answers),
        recommendations: generateRecommendations(riskLevel),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in PCOS prediction:', error);
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
  if (answers.irregularPeriods === 'yes') symptoms.push({ name: 'Irregular Periods', severity: 90 });
  if (answers.weightGain === 'yes') symptoms.push({ name: 'Weight Gain', severity: 70 });
  if (answers.acne === 'yes') symptoms.push({ name: 'Acne', severity: 60 });
  if (answers.hairGrowth === 'yes') symptoms.push({ name: 'Excess Hair Growth', severity: 75 });
  if (answers.hairLoss === 'yes') symptoms.push({ name: 'Hair Loss', severity: 65 });
  
  return symptoms.length > 0 ? symptoms : [{ name: 'No significant symptoms', severity: 20 }];
}

function generateRecommendations(riskLevel: string) {
  const baseRecommendations = {
    dietary: [
      'Focus on whole foods and reduce processed foods',
      'Include more fiber-rich foods',
      'Limit sugar and refined carbohydrates',
    ],
    exercise: [
      'Aim for 150 minutes of moderate exercise per week',
      'Include both cardio and strength training',
      'Try yoga or meditation for stress management',
    ],
    lifestyle: [
      'Maintain a consistent sleep schedule',
      'Manage stress through relaxation techniques',
      'Track your menstrual cycle',
    ],
  };

  if (riskLevel === 'high') {
    baseRecommendations.dietary.unshift('Consult a nutritionist for a personalized diet plan');
    baseRecommendations.lifestyle.unshift('Schedule an appointment with a gynecologist');
  }

  return baseRecommendations;
}
