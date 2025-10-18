import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Activity, AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";
import { Bar, Radar } from "recharts";
import { BarChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PCOSPrediction = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"intro" | "questionnaire" | "results" | "recommendations">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = [
    { id: "age", question: "What is your age?", type: "number", placeholder: "Enter your age" },
    { id: "weight", question: "What is your weight (in kg)?", type: "number", placeholder: "Enter weight" },
    { id: "height", question: "What is your height (in cm)?", type: "number", placeholder: "Enter height" },
    { id: "cycle_length", question: "What is your typical cycle length?", type: "radio", options: ["<21 days", "21-35 days", ">35 days", "Irregular"] },
    { id: "acne", question: "Do you experience persistent acne?", type: "radio", options: ["Never", "Rarely", "Sometimes", "Frequently", "Always"] },
    { id: "hair_loss", question: "Do you experience hair thinning or hair loss?", type: "radio", options: ["No", "Mild", "Moderate", "Severe"] },
    { id: "weight_gain", question: "Have you experienced unexplained weight gain?", type: "radio", options: ["No", "Yes, mild", "Yes, significant"] },
    { id: "facial_hair", question: "Do you have excess facial hair growth?", type: "radio", options: ["No", "Mild", "Moderate", "Severe"] },
    { id: "mood", question: "How often do you experience mood swings?", type: "radio", options: ["Never", "Rarely", "Sometimes", "Often", "Very often"] },
    { id: "insulin", question: "Do you have insulin resistance or diabetes?", type: "radio", options: ["No", "Pre-diabetic", "Yes, Type 2", "Don't know"] },
  ];

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
  };

  const handleNext = () => {
    if (!answers[questions[currentQuestion].id]) {
      toast.error("Please answer the current question");
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered, show results
      setStep("results");
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Mock prediction results
  const riskScore = 68; // Out of 100
  const riskLevel = riskScore > 70 ? "High" : riskScore > 40 ? "Moderate" : "Low";
  
  const symptomData = [
    { symptom: "Irregular Cycles", value: 85 },
    { symptom: "Acne", value: 65 },
    { symptom: "Hair Issues", value: 55 },
    { symptom: "Weight Gain", value: 70 },
    { symptom: "Mood Changes", value: 60 },
  ];

  const factorData = [
    { factor: "Hormonal", contribution: 75 },
    { factor: "Metabolic", contribution: 60 },
    { factor: "Lifestyle", contribution: 45 },
    { factor: "Genetic", contribution: 55 },
  ];

  if (step === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <Card className="glass-card p-8 max-w-4xl mx-auto animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">PCOS Risk Assessment</h1>
                  <p className="text-muted-foreground">Understanding Polycystic Ovary Syndrome</p>
                </div>
              </div>

              <div className="prose prose-pink max-w-none">
                <h2 className="text-2xl font-semibold mb-4">What is PCOS?</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Polycystic Ovary Syndrome (PCOS) is a hormonal disorder common among women of reproductive age. 
                  Women with PCOS may have infrequent or prolonged menstrual periods or excess male hormone (androgen) levels.
                </p>

                <h3 className="text-xl font-semibold mb-3">Common Symptoms:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Irregular menstrual periods or no periods</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Excess androgen levels leading to physical signs like facial hair and acne</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Polycystic ovaries (ovaries may become enlarged)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Weight gain and difficulty losing weight</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Thinning hair or hair loss on the scalp</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Darkening of skin, particularly in neck creases and under breasts</span>
                  </li>
                </ul>

                <div className="bg-accent/10 border-l-4 border-accent p-4 rounded-r-lg my-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-accent mb-1">Important Note</h4>
                      <p className="text-sm text-muted-foreground">
                        This assessment is for informational purposes only and should not replace professional medical advice. 
                        Always consult with a healthcare provider for proper diagnosis and treatment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setStep("questionnaire")} 
                className="w-full gradient-primary hover:shadow-glow transition-all"
                size="lg"
              >
                Start Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  if (step === "questionnaire") {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const currentQ = questions[currentQuestion];

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <Card className="glass-card p-8 max-w-2xl mx-auto animate-fade-in">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">{currentQ.question}</h2>

                {currentQ.type === "number" ? (
                  <Input
                    type="number"
                    placeholder={currentQ.placeholder}
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="text-lg p-6"
                  />
                ) : (
                  <RadioGroup value={answers[currentQ.id]} onValueChange={handleAnswer}>
                    <div className="space-y-3">
                      {currentQ.options?.map((option, index) => (
                        <div key={index} className="flex items-center space-x-3 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              </div>

              <div className="flex gap-3">
                {currentQuestion > 0 && (
                  <Button onClick={handlePrevious} variant="outline" size="lg" className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                )}
                <Button onClick={handleNext} className="flex-1 gradient-primary" size="lg">
                  {currentQuestion === questions.length - 1 ? "Get Results" : "Next"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  if (step === "results") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8 space-y-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <Card className="glass-card p-8 animate-fade-in">
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-3xl font-bold gradient-text">Your PCOS Risk Assessment Results</h1>
              <p className="text-muted-foreground">Based on your responses, here's what we found</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className={`p-6 text-center ${riskLevel === "High" ? "border-destructive" : riskLevel === "Moderate" ? "border-primary" : "border-success"}`}>
                <div className="text-sm font-medium text-muted-foreground mb-2">Risk Level</div>
                <div className={`text-4xl font-bold ${riskLevel === "High" ? "text-destructive" : riskLevel === "Moderate" ? "text-primary" : "text-success"}`}>
                  {riskLevel}
                </div>
              </Card>

              <Card className="p-6 text-center border-primary">
                <div className="text-sm font-medium text-muted-foreground mb-2">Risk Score</div>
                <div className="text-4xl font-bold text-primary">{riskScore}%</div>
              </Card>

              <Card className="p-6 text-center border-accent">
                <div className="text-sm font-medium text-muted-foreground mb-2">Confidence</div>
                <div className="text-4xl font-bold text-accent">87%</div>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Symptom Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={symptomData}>
                    <PolarGrid stroke="#f472b6" />
                    <PolarAngleAxis dataKey="symptom" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b' }} />
                    <Radar name="Symptom Severity" dataKey="value" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Contributing Factors</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={factorData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="factor" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#64748b' }} />
                    <Tooltip />
                    <Bar dataKey="contribution" fill="#c084fc" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <div className="bg-accent/10 border-l-4 border-accent p-6 rounded-r-lg mb-6">
              <h3 className="font-semibold text-accent mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                What These Results Mean
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your assessment indicates a {riskLevel.toLowerCase()} risk for PCOS. This doesn't mean you definitely have PCOS, 
                but it suggests you should discuss these symptoms with a healthcare provider. Early detection and management 
                can help prevent complications and improve quality of life.
              </p>
            </div>

            <Button 
              onClick={() => setStep("recommendations")} 
              className="w-full gradient-primary" 
              size="lg"
            >
              View Personalized Recommendations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  // Recommendations step
  const bmi = answers.weight && answers.height ? 
    (parseFloat(answers.weight) / Math.pow(parseFloat(answers.height) / 100, 2)).toFixed(1) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <Button variant="ghost" onClick={() => setStep("results")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Results
        </Button>

        <Card className="glass-card p-8 animate-fade-in">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl font-bold gradient-text">Personalized Health Plan</h1>
            <p className="text-muted-foreground">Custom recommendations based on your assessment</p>
          </div>

          {bmi && (
            <Card className="p-6 mb-6 bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your BMI</p>
                  <p className="text-3xl font-bold">{bmi}</p>
                </div>
                <Activity className="h-12 w-12 text-primary" />
              </div>
            </Card>
          )}

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
                Dietary Recommendations
              </h2>
              <Card className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-success">✓ Foods to Include</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-success">•</span>
                        <span><strong>Leafy greens:</strong> Spinach, kale, Swiss chard (high in antioxidants)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-success">•</span>
                        <span><strong>Fatty fish:</strong> Salmon, mackerel, sardines (omega-3 fatty acids)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-success">•</span>
                        <span><strong>Whole grains:</strong> Quinoa, brown rice, oats (low glycemic index)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-success">•</span>
                        <span><strong>Nuts and seeds:</strong> Almonds, flaxseeds, chia seeds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-success">•</span>
                        <span><strong>Berries:</strong> Blueberries, strawberries (anti-inflammatory)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-destructive">✗ Foods to Limit</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-destructive">•</span>
                        <span>Refined carbohydrates (white bread, pasta)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive">•</span>
                        <span>Sugary drinks and desserts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive">•</span>
                        <span>Processed and fried foods</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive">•</span>
                        <span>Red and processed meats</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive">•</span>
                        <span>Excessive dairy products</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold mb-2">Sample Day Menu</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-primary mb-1">Breakfast</p>
                      <p className="text-muted-foreground">Oatmeal with berries, chia seeds, and cinnamon</p>
                    </div>
                    <div>
                      <p className="font-medium text-primary mb-1">Lunch</p>
                      <p className="text-muted-foreground">Grilled salmon with quinoa and roasted vegetables</p>
                    </div>
                    <div>
                      <p className="font-medium text-primary mb-1">Dinner</p>
                      <p className="text-muted-foreground">Chicken stir-fry with brown rice and lots of veggies</p>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
                Exercise Plan
              </h2>
              <Card className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Cardio (4-5x per week)</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Brisk walking:</strong> 30-45 minutes daily</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Swimming:</strong> 30 minutes, 3x per week</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Cycling:</strong> 20-30 minutes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Dancing:</strong> Fun cardio alternative</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Strength Training (2-3x per week)</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-secondary">•</span>
                        <span><strong>Bodyweight exercises:</strong> Squats, lunges, push-ups</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-secondary">•</span>
                        <span><strong>Resistance bands:</strong> Full body workout</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-secondary">•</span>
                        <span><strong>Light weights:</strong> 2-5 lbs for beginners</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-secondary">•</span>
                        <span><strong>Core exercises:</strong> Planks, crunches</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-accent/10 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-accent">
                    <AlertCircle className="h-4 w-4" />
                    Additional Activities
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Yoga or Pilates (2-3x per week) - excellent for stress management and hormonal balance</li>
                    <li>• Meditation (10-15 minutes daily) - helps reduce cortisol levels</li>
                    <li>• Adequate sleep (7-9 hours) - crucial for hormonal regulation</li>
                  </ul>
                </div>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                  <span className="text-white font-bold">3</span>
                </div>
                Lifestyle Modifications
              </h2>
              <Card className="p-6">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span><strong>Stress management:</strong> Practice relaxation techniques, deep breathing, or mindfulness meditation</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span><strong>Regular sleep schedule:</strong> Maintain consistent sleep-wake times to support hormonal balance</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span><strong>Hydration:</strong> Drink 8-10 glasses of water daily</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span><strong>Avoid smoking and limit alcohol:</strong> Both can worsen PCOS symptoms</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span><strong>Regular check-ups:</strong> Monitor blood sugar, cholesterol, and hormone levels with your doctor</span>
                  </li>
                </ul>
              </Card>
            </section>

            <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Important Reminder</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    These recommendations are general guidelines. For a personalized treatment plan, please consult with a 
                    healthcare provider or endocrinologist who specializes in PCOS. They may recommend additional tests, 
                    medications, or specific interventions based on your individual needs.
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button onClick={() => navigate("/gynecologists")} variant="outline" className="flex-1">
                Find a Doctor
              </Button>
              <Button onClick={() => navigate("/dashboard")} className="flex-1 gradient-primary">
                Return to Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PCOSPrediction;
