import { motion } from "motion/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/Card";
import { CheckCircle2, Circle, TrendingUp, Users, Code, BarChart3, MessageSquare } from "lucide-react";

const COMPETENCIES = [
  { name: "Product Strategy", icon: TrendingUp, progress: 65 },
  { name: "User Empathy", icon: Users, progress: 80 },
  { name: "Technical Literacy", icon: Code, progress: 45 },
  { name: "Data Analysis", icon: BarChart3, progress: 90 },
  { name: "Communication", icon: MessageSquare, progress: 75 },
];

export default function Tracker() {
  return (
    <section id="tracker" className="py-24 px-4 bg-secondary/20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-primary">Readiness Tracker</h2>
          <p className="text-muted-foreground">Monitor your progress across core PM competencies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="md:col-span-2 border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-primary">Overall Readiness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-4 bg-secondary rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "71%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-accent"
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Progress: 71%</span>
                <span className="text-accent font-bold">Target: 100%</span>
              </div>
            </CardContent>
          </Card>

          {COMPETENCIES.map((comp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 rounded-lg bg-accent/10 text-accent">
                      <comp.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-primary">{comp.name}</h3>
                      <div className="w-full h-1.5 bg-secondary rounded-full mt-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${comp.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-accent"
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-primary">{comp.progress}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-accent" /> 12 tasks completed
                    </span>
                    <span className="flex items-center gap-1">
                      <Circle className="w-3 h-3" /> 4 remaining
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
