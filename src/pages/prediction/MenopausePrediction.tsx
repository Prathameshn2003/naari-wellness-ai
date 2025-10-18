import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, TrendingUp, AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";
import { Bar, Line } from "recharts";
import { BarChart, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const MenopausePrediction = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"intro" | "questionnaire" | "results" | "recommendations">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = [
    { id: "age", question: "What is your current age?", type: "number", placeholder: "Enter your age" },
    { id: "period_frequency", question: "How would you describe your menstrual periods lately?", type: "radio", options: ["Regular", "Irregular", "Skipped some months", "No periods for 12+ months"] },
    { id: "hot_flashes", question: "Do you experience hot flashes or night sweats?", type: "radio", options: ["Never", "Rarely", "Sometimes", "Frequently", "Very frequently"] },
    { id: "sleep_quality", question: "How is your sleep quality?", type: "radio", options: ["Excellent", "Good", "Fair", "Poor", "Very poor"] },
    { id: "mood_changes", question: "Have you noticed mood changes or irritability?", type: "radio", options: ["Not at all", "Mild", "Moderate", "Significant"] },
    { id: "weight_changes", question: "Have you experienced weight gain, especially around the waist?", type: "radio", options: ["No", "Slight (1-5 kg)", "Moderate (5-10 kg)", "Significant (>10 kg)"] },
    { id: "bone_health", question: "Do you have any concerns about bone health or osteoporosis?", type: "radio", options: ["No", "Family history", "Diagnosed with low bone density", "Not sure"] },
    { id: "vaginal_symptoms", question: "Do you experience vaginal dryness or discomfort?", type: "radio", options: ["No", "Mild", "Moderate", "Severe"] },
    { id: "libido", question: "Have you noticed changes in your sexual desire?", type: "radio", options: ["No change", "Slight decrease", "Moderate decrease", "Significant decrease"] },
    { id: "energy_levels", question: "How would you rate your energy levels?", type: "radio", options: ["High", "Normal", "Low", "Very low"] },
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
      setStep("results");
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const stageData = [
    { stage: "Perimenopause", probability: 65 },
    { stage: "Early Menopause", probability: 25 },
    { stage: "Postmenopause", probability: 10 },
  ];

  const symptomTrend = [
    { month: "Jan", severity: 2 },
    { month: "Feb", severity: 3 },
    { month: "Mar", severity: 4 },
    { month: "Apr", severity: 5 },
    { month: "May", severity: 6 },
    { month: "Jun", severity: 7 },
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
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">Menopause Assessment</h1>
                  <p className="text-muted-foreground">Understanding Your Transition</p>
                </div>
              </div>

              <div className="prose prose-pink max-w-none">
                <h2 className="text-2xl font-semibold mb-4">What is Menopause?</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Menopause is a natural biological process marking the end of menstrual cycles. It's diagnosed after 
                  you've gone 12 months without a menstrual period. Menopause can happen in your 40s or 50s, with the 
                  average age being 51 in the United States.
                </p>

                <h3 className="text-xl font-semibold mb-3">Stages of Menopause:</h3>
                <div className="space-y-3 mb-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">1. Perimenopause</h4>
                    <p className="text-sm text-muted-foreground">
                      The transition period before menopause, typically lasting 4-8 years. Hormone levels fluctuate, 
                      causing irregular periods and menopausal symptoms.
                    </p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">2. Menopause</h4>
                    <p className="text-sm text-muted-foreground">
                      The point when you haven't had a period for 12 consecutive months. Ovaries stop releasing eggs 
                      and producing most of their estrogen.
                    </p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">3. Postmenopause</h4>
                    <p className="text-sm text-muted-foreground">
                      The years after menopause. Some symptoms may ease, but health risks related to estrogen loss increase.
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3">Common Symptoms:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Irregular periods or changes in menstrual flow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Hot flashes and night sweats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Sleep disturbances and fatigue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Mood changes, anxiety, or depression</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Weight gain and slowed metabolism</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Vaginal dryness and decreased libido</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Thinning hair and dry skin</span>
                  </li>
                </ul>

                <div className="bg-accent/10 border-l-4 border-accent p-4 rounded-r-lg my-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-accent mb-1">Important Note</h4>
                      <p className="text-sm text-muted-foreground">
                        This assessment helps you understand where you might be in your menopausal transition. 
                        It's not a medical diagnosis. Always consult with a healthcare provider for proper evaluation and treatment.
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
    const predictedStage = "Perimenopause";
    const confidence = 87;

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
              <h1 className="text-3xl font-bold gradient-text">Your Menopause Assessment Results</h1>
              <p className="text-muted-foreground">Based on your responses, here's our analysis</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 text-center border-primary">
                <div className="text-sm font-medium text-muted-foreground mb-2">Predicted Stage</div>
                <div className="text-3xl font-bold text-primary">{predictedStage}</div>
              </Card>

              <Card className="p-6 text-center border-secondary">
                <div className="text-sm font-medium text-muted-foreground mb-2">Confidence Level</div>
                <div className="text-3xl font-bold text-secondary">{confidence}%</div>
              </Card>

              <Card className="p-6 text-center border-accent">
                <div className="text-sm font-medium text-muted-foreground mb-2">Age Range</div>
                <div className="text-3xl font-bold text-accent">{answers.age} years</div>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Stage Probabilities</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="stage" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#64748b' }} />
                    <Tooltip />
                    <Bar dataKey="probability" fill="#c084fc" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Symptom Trend (Last 6 Months)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={symptomTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fill: '#64748b' }} />
                    <YAxis tick={{ fill: '#64748b' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="severity" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <div className="bg-accent/10 border-l-4 border-accent p-6 rounded-r-lg mb-6">
              <h3 className="font-semibold text-accent mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Understanding Your Results
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your assessment indicates you are likely in the {predictedStage.toLowerCase()} stage. This is a natural transition 
                that varies greatly among women. The symptoms you're experiencing are common during this phase. While some 
                discomfort is normal, severe symptoms should be discussed with a healthcare provider.
              </p>
            </div>

            <Button 
              onClick={() => setStep("recommendations")} 
              className="w-full gradient-primary" 
              size="lg"
            >
              View Management Recommendations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  // Recommendations
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
            <h1 className="text-3xl font-bold gradient-text">Menopause Management Plan</h1>
            <p className="text-muted-foreground">Personalized strategies for this life stage</p>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
                Dietary Recommendations
              </h2>
              <Card className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-success mb-3">✓ Foods to Emphasize</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-success">•</span>
                        <span><strong>Calcium-rich foods:</strong> Dairy, fortified plant milk, leafy greens (bone health)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-success">•</span>
                        <span><strong>Phytoestrogen sources:</strong> Soy products, flaxseeds, whole grains</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-success">•</span>
                        <span><strong>Omega-3 fatty acids:</strong> Salmon, walnuts, chia seeds (heart health)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-success">•</span>
                        <span><strong>Vitamin D sources:</strong> Fatty fish, egg yolks, fortified foods</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-success">•</span>
                        <span><strong>Whole grains:</strong> Brown rice, quinoa, oats (energy & fiber)</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-destructive mb-3">✗ Foods to Limit</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-destructive">•</span>
                        <span>Caffeine and alcohol (may trigger hot flashes)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive">•</span>
                        <span>Spicy foods (can worsen hot flashes)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive">•</span>
                        <span>High-sodium foods (blood pressure concerns)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive">•</span>
                        <span>Processed and sugary foods (weight management)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive">•</span>
                        <span>Excessive red meat (heart health)</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Sample Daily Menu</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-primary mb-1">Breakfast</p>
                      <p className="text-muted-foreground">Greek yogurt with berries, walnuts, and ground flaxseed</p>
                    </div>
                    <div>
                      <p className="font-medium text-primary mb-1">Lunch</p>
                      <p className="text-muted-foreground">Grilled salmon with quinoa and steamed broccoli</p>
                    </div>
                    <div>
                      <p className="font-medium text-primary mb-1">Dinner</p>
                      <p className="text-muted-foreground">Tofu stir-fry with vegetables and brown rice</p>
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
                Exercise & Physical Activity
              </h2>
              <Card className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Weight-Bearing Exercise (4-5x/week)</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Walking:</strong> 30-45 minutes daily (bone health)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Dancing:</strong> Fun and effective</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Stair climbing:</strong> 15-20 minutes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Low-impact aerobics:</strong> Joint-friendly option</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Strength & Flexibility (3x/week)</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-secondary">•</span>
                        <span><strong>Resistance training:</strong> Light weights or bands</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-secondary">•</span>
                        <span><strong>Yoga:</strong> Improves flexibility and reduces stress</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-secondary">•</span>
                        <span><strong>Tai Chi:</strong> Balance and mindfulness</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-secondary">•</span>
                        <span><strong>Pilates:</strong> Core strength</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                  <span className="text-white font-bold">3</span>
                </div>
                Lifestyle & Symptom Management
              </h2>
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-primary">For Hot Flashes & Night Sweats:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Dress in layers you can remove easily</li>
                      <li>• Keep your bedroom cool (60-65°F)</li>
                      <li>• Use breathable, moisture-wicking fabrics</li>
                      <li>• Practice deep breathing exercises</li>
                      <li>• Avoid triggers: spicy food, hot drinks, alcohol</li>
                    </ul>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-secondary">For Sleep Issues:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Maintain consistent sleep schedule</li>
                      <li>• Create relaxing bedtime routine</li>
                      <li>• Limit screen time before bed</li>
                      <li>• Consider melatonin (consult doctor first)</li>
                      <li>• Practice meditation or progressive relaxation</li>
                    </ul>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-accent">For Mood & Mental Health:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Stay socially connected with friends and family</li>
                      <li>• Consider therapy or support groups</li>
                      <li>• Practice stress-reduction techniques (meditation, mindfulness)</li>
                      <li>• Maintain regular exercise routine</li>
                      <li>• Don't hesitate to discuss antidepressants with your doctor if needed</li>
                    </ul>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-primary">Additional Recommendations:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• <strong>Bone health:</strong> Get bone density test (DEXA scan)</li>
                      <li>• <strong>Heart health:</strong> Regular cardiovascular check-ups</li>
                      <li>• <strong>Vaginal health:</strong> Use water-based lubricants; consider vaginal estrogen</li>
                      <li>• <strong>Kegel exercises:</strong> Prevent urinary incontinence</li>
                      <li>• <strong>Regular check-ups:</strong> Annual mammograms and pelvic exams</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </section>

            <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">When to See a Doctor</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    While menopause is natural, certain symptoms warrant professional attention. Consult your healthcare 
                    provider for personalized treatment options, which may include:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Hormone therapy (HRT) - discuss risks and benefits</li>
                    <li>• Non-hormonal medications for hot flashes</li>
                    <li>• Vaginal estrogen for local symptoms</li>
                    <li>• Bone-strengthening medications if needed</li>
                  </ul>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button onClick={() => navigate("/gynecologists")} variant="outline" className="flex-1">
                Find a Specialist
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

export default MenopausePrediction;
