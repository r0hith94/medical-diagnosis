import React, { useState } from "react";
import { 
  Activity, 
  AlertCircle, 
  ChevronRight, 
  HeartPulse, 
  Info, 
  Search, 
  Stethoscope, 
  ShieldAlert,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { diagnoseSymptoms, getMedicalInfo, DiagnosisResult, RAGResult } from "@/src/lib/gemini";

export default function App() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [ragInfo, setRagInfo] = useState<RAGResult | null>(null);

  const handleDiagnose = async () => {
    if (!symptoms.trim()) {
      toast.error("Please enter some symptoms.");
      return;
    }

    setLoading(true);
    setDiagnosis(null);
    setRagInfo(null);

    try {
      const result = await diagnoseSymptoms(symptoms);
      setDiagnosis(result);
      
      // Fetch RAG info based on diagnosis
      const info = await getMedicalInfo(result.disease);
      setRagInfo(info);
      
      toast.success("Analysis complete.");
    } catch (error) {
      console.error("Diagnosis failed:", error);
      toast.error("Failed to analyze symptoms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-slate-900 selection:bg-blue-100">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Stethoscope className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">SmartMed AI</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Diagnosis Assistant</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 gap-1 px-3 py-1">
            <Activity className="w-3 h-3 animate-pulse" />
            System Active
          </Badge>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Section */}
        <section className="lg:col-span-5 space-y-6">
          <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
            <CardHeader className="bg-slate-900 text-white pb-8">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-400" />
                Symptom Analysis
              </CardTitle>
              <CardDescription className="text-slate-400">
                Describe how you're feeling in detail for the most accurate assessment.
              </CardDescription>
            </CardHeader>
            <CardContent className="-mt-4 bg-white rounded-t-3xl pt-8 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symptoms" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Patient Symptoms
                </Label>
                <textarea
                  id="symptoms"
                  placeholder="e.g., I have a persistent cough, mild fever, and fatigue for the last 3 days..."
                  className="w-full min-h-[150px] p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:ring-0 transition-all resize-none text-slate-700 placeholder:text-slate-300"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleDiagnose} 
                disabled={loading}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Data...
                  </>
                ) : (
                  <>
                    Run Diagnostic
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t px-6 py-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  <span className="font-bold text-slate-700">Medical Disclaimer:</span> This tool is for educational purposes and provides preliminary information based on AI patterns. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.
                </p>
              </div>
            </CardFooter>
          </Card>

          {/* Quick Tips */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <Info className="w-5 h-5 text-blue-500 mb-2" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Tip</h3>
              <p className="text-xs text-slate-600">Be specific about duration and severity.</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <HeartPulse className="w-5 h-5 text-rose-500 mb-2" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Safety</h3>
              <p className="text-xs text-slate-600">If experiencing chest pain, call emergency services.</p>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!diagnosis && !loading && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <Activity className="w-10 h-10 text-slate-300" />
                </div>
                <h2 className="text-xl font-bold text-slate-400">Awaiting Input</h2>
                <p className="text-slate-400 max-w-xs mt-2">Enter symptoms on the left to begin the AI-powered medical analysis.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center space-y-4"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-blue-100 rounded-full"></div>
                  <div className="w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                  <Stethoscope className="w-10 h-10 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-slate-700">Processing Medical Data</h3>
                  <p className="text-sm text-slate-400">Comparing symptoms against knowledge base...</p>
                </div>
              </motion.div>
            )}

            {diagnosis && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Primary Diagnosis */}
                <Card className="border-none shadow-xl shadow-blue-100/50 overflow-hidden">
                  <div className="h-2 bg-blue-600 w-full" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="mb-2 bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50">Predicted Condition</Badge>
                        <CardTitle className="text-3xl font-black text-slate-900">{diagnosis.disease}</CardTitle>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-blue-600">{(diagnosis.confidence * 100).toFixed(0)}%</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Confidence Score</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                        <Info className="w-3 h-3" />
                        AI Explanation
                      </h4>
                      <p className="text-slate-700 leading-relaxed">{diagnosis.explanation}</p>
                    </div>

                    {/* Feature Importance / SHAP simulation */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Contributing Symptoms (Feature Weight)</h4>
                      <div className="space-y-3">
                        {diagnosis.contributingSymptoms.map((item, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-slate-600">{item.symptom}</span>
                              <span className="text-blue-600">{(item.weight * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.weight * 100}%` }}
                                transition={{ duration: 1, delay: idx * 0.1 }}
                                className="h-full bg-blue-500 rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* RAG Information */}
                {ragInfo && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <Card className="border-none shadow-lg shadow-slate-200/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                          <Activity className="w-4 h-4 text-rose-500" />
                          Treatment Suggestions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {ragInfo.treatments.map((t, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg shadow-slate-200/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-amber-500" />
                          Precautions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {ragInfo.precautions.map((p, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-12 border-t mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 grayscale">
            <Stethoscope className="w-5 h-5" />
            <span className="font-bold text-sm">SmartMed AI</span>
          </div>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold text-slate-400">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Medical Ethics</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Data Security</a>
          </div>
          <p className="text-[10px] text-slate-400">© 2026 SmartMed Systems. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
