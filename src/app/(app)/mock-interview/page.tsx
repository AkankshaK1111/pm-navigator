import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { INTERVIEW_QUESTIONS, InterviewQuestion } from "@/src/data/interview-questions";
import { useXP } from "@/src/hooks/useXP";
import { Button } from "@/src/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/src/components/ui/Card";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Lightbulb, 
  Timer, 
  RotateCcw, 
  CheckCircle2,
  MessageSquare,
  AlertCircle
} from "lucide-react";

export default function MockInterviewPage() {
  const { award } = useXP();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentQuestion = INTERVIEW_QUESTIONS[currentIdx];
  const progress = ((currentIdx + 1) / INTERVIEW_QUESTIONS.length) * 100;

  useEffect(() => {
    let interval: any;
    if (isStarted && !isPaused) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted, isPaused]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentIdx < INTERVIEW_QUESTIONS.length - 1) {
      award('mock-interview', 15, INTERVIEW_QUESTIONS[currentIdx].question);
      setCurrentIdx(currentIdx + 1);
      setShowTips(false);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setShowTips(false);
    }
  };

  const resetInterview = () => {
    setIsStarted(false);
    setCurrentIdx(0);
    setSeconds(0);
    setShowTips(false);
    setIsPaused(false);
  };

  if (!isStarted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full text-center space-y-8"
        >
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-4xl font-extrabold text-primary tracking-tight">AI Mock Interview</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Practice your PM interview skills with a curated set of real-world questions. 
            Time yourself, get tips, and refine your answers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {[
              { icon: Timer, title: "Timed Sessions", desc: "Simulate the pressure of a real interview." },
              { icon: Lightbulb, title: "Expert Tips", desc: "Get guidance on how to structure your response." },
              { icon: CheckCircle2, title: "Self-Assessment", desc: "Review and improve your performance." },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl border border-border bg-card shadow-sm">
                <item.icon className="w-6 h-6 text-accent mb-2" />
                <h3 className="font-bold text-sm text-primary">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
          <Button 
            size="lg" 
            onClick={() => setIsStarted(true)}
            className="bg-accent hover:bg-accent/90 text-white px-12 h-14 text-lg gap-2 shadow-lg"
          >
            <Play className="w-5 h-5 fill-current" /> Start Mock Interview
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] px-4 py-24 bg-secondary/10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header & Progress */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={resetInterview} className="gap-2">
              <RotateCcw className="w-4 h-4" /> Reset
            </Button>
            <div className="flex items-center gap-2 text-sm font-bold text-primary bg-card px-4 py-2 rounded-full shadow-sm border border-border">
              <Timer className="w-4 h-4 text-accent" />
              {formatTime(seconds)}
            </div>
          </div>
          <div className="flex-1 max-w-xs w-full space-y-2">
            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span>Progress</span>
              <span>{currentIdx + 1} of {INTERVIEW_QUESTIONS.length}</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-accent"
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-none shadow-xl overflow-hidden">
              <div className="h-2 bg-accent" />
              <CardHeader className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest">
                    {currentQuestion.category}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    currentQuestion.difficulty === 'Hard' ? 'bg-red-100 text-red-600' :
                    currentQuestion.difficulty === 'Medium' ? 'bg-amber-100 text-amber-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold text-primary leading-tight">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 rounded-2xl bg-secondary/20 border border-border/50">
                  <p className="text-muted-foreground italic leading-relaxed">
                    Take a moment to structure your answer. Think about the user, the problem, and the solution.
                  </p>
                </div>

                {showTips && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 pt-4 border-t border-border"
                  >
                    <h4 className="font-bold text-primary flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-accent" /> Expert Tips
                    </h4>
                    <ul className="space-y-3">
                      {currentQuestion.tips.map((tip, i) => (
                        <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                          <div className="w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {i + 1}
                          </div>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </CardContent>
              <CardFooter className="bg-secondary/10 p-6 flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowTips(!showTips)}
                  className="text-accent hover:text-accent/80 font-bold gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  {showTips ? "Hide Tips" : "Show Tips"}
                </Button>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handlePrev} 
                    disabled={currentIdx === 0}
                    className="border-primary text-primary"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={handleNext} 
                    disabled={currentIdx === INTERVIEW_QUESTIONS.length - 1}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Next Question <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Footer Info */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>
            <strong>Pro Tip:</strong> Try recording your answer and playing it back. 
            Listen for clarity, structure, and confidence.
          </p>
        </div>
      </div>
    </div>
  );
}
