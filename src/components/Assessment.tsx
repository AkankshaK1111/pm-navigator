import { motion } from "motion/react";
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent } from "@/src/components/ui/Card";
import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, Map, Target } from "lucide-react";

export default function Assessment() {
  return (
    <section id="assessment" className="py-24 px-4 bg-secondary/20">
      <div className="max-w-5xl mx-auto">
        {/* Problem Section */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold mb-4 text-primary"
          >
            The PM preparation trap
          </motion.h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Most aspiring PMs spend months consuming content but never close the gap. Here's why.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: AlertTriangle,
              title: "No honest fit verdict",
              desc: 'No platform tells you if PM suits YOUR background, or which PM type fits you specifically. You deserve more than "anyone can be a PM."',
            },
            {
              icon: Map,
              title: "Generic roadmaps fail",
              desc: "An engineer's biggest gap is business framing. A consultant's is technical credibility. Generic advice helps neither.",
            },
            {
              icon: Target,
              title: "You don't know when you're ready",
              desc: "Candidates apply after 8-12 weeks. Experts recommend 12+ months. Nobody bridges this gap with honest tracking.",
            },
          ].map((pain, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-md h-full">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-5">
                    <pain.icon className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-3">{pain.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pain.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Solution Section */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold mb-4 text-primary"
          >
            What PM Navigator does differently
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            {
              num: "01",
              title: "Honest Fit Assessment",
              desc: 'A diagnostic that includes "PM may not be right for you" as a valid answer. Based on real hiring data, not marketing.',
            },
            {
              num: "02",
              title: "Personalised Roadmap",
              desc: "Week-by-week plan calibrated to your background. An engineer gets different tasks than a consultant or MBA.",
            },
            {
              num: "03",
              title: "Readiness Scoring",
              desc: "Know exactly where you stand against actual hiring bars across 7 dimensions, not arbitrary milestones.",
            },
            {
              num: "04",
              title: "Mock Interview Practice",
              desc: "50 real PM questions across 5 categories, mapped to 8 proven interview failure modes.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-5 p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all"
            >
              <div className="text-3xl font-extrabold text-accent/20">{feature.num}</div>
              <div>
                <h3 className="text-lg font-bold text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {[
            { stat: "0.12%", label: "Cold application conversion rate" },
            { stat: "7x", label: "Advantage with referrals" },
            { stat: "60-70%", label: "Of explorers never apply" },
          ].map((s, i) => (
            <div key={i} className="text-center p-6 rounded-xl bg-primary text-white">
              <div className="text-3xl font-extrabold text-accent mb-1">{s.stat}</div>
              <div className="text-sm text-slate-300">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-extrabold text-primary mb-3">Ready to stop guessing?</h3>
          <p className="text-muted-foreground mb-8 text-sm">No signup required. No credit card. Takes 3 minutes.</p>
          <Link to="/assessment">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white px-10 h-14 text-lg gap-2 shadow-lg">
              Start Free Assessment <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
