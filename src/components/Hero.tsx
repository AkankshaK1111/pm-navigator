import { motion } from "motion/react";
import { Button } from "@/src/components/ui/Button";
import { ArrowRight, Target, Map, CheckCircle, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 text-primary">
            Stop preparing.{" "}
            <span className="text-accent">Start navigating.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            140,000 PM roles exist. You're applying to the wrong ones. Get an honest fit assessment, a personalised roadmap, and know exactly when you're ready.
          </p>
          <p className="text-sm text-muted-foreground/70 max-w-xl mx-auto mb-10">
            Built on research from 50+ sources, 150 FAANG PM transitions, and 4.5M job applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/assessment">
              <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90 text-white border-none px-8 h-14 text-lg shadow-lg">
                Take the Free Assessment <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 h-14">
                View Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-24">
          {[
            { icon: Target, title: "Fit Assessment", desc: "Honest diagnostic — includes 'consider alternatives' as a valid answer." },
            { icon: Map, title: "Personalised Roadmap", desc: "12-week plan calibrated to your background, not a generic bootcamp." },
            { icon: CheckCircle, title: "Readiness Scoring", desc: "7 dimensions tracked against actual hiring bars." },
            { icon: MessageSquare, title: "Mock Interviews", desc: "50 real questions mapped to 8 proven failure modes." },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-white transition-colors">
                <feature.icon className="w-6 h-6 text-accent group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-primary">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
