import Hero from "@/src/components/Hero";
import Assessment from "@/src/components/Assessment";
import { motion } from "motion/react";
import { BookOpen, Users, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <Assessment />

      {/* Research Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-extrabold text-primary mb-4"
            >
              Built on research, not marketing
            </motion.h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every recommendation is backed by data from real PM transitions and hiring patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                stat: "50+",
                label: "Research sources analysed",
                detail: "Primary citations from industry surveys, job market data, and PM community research.",
              },
              {
                icon: Users,
                stat: "78%",
                label: "Believe projects beat frameworks",
                detail: "Yet 44% of aspirants have built nothing. Our roadmap turns knowledge into action.",
              },
              {
                icon: Zap,
                stat: "50-70%",
                label: "Strategic networker conversion",
                detail: "Our roadmap includes networking from week 1, not as an afterthought in week 12.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-7 h-7 text-accent" />
                </div>
                <div className="text-4xl font-extrabold text-primary mb-2">{item.stat}</div>
                <div className="text-sm font-bold text-accent mb-3">{item.label}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
