import { motion } from "motion/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/Card";
import { RoadmapItem } from "@/src/types";
import { CheckCircle2, Circle, Clock, BookOpen } from "lucide-react";

const SAMPLE_ROADMAP: RoadmapItem[] = [
  {
    title: "Master PM Fundamentals",
    description: "Learn the core concepts of product management, including the product lifecycle, market research, and user personas.",
    duration: "2-4 weeks",
    resources: ["Product School", "Mind the Product", "Inspired by Marty Cagan"],
    status: "completed",
  },
  {
    title: "Develop Analytical Skills",
    description: "Focus on data-driven decision making, SQL, and product analytics tools like Mixpanel or Amplitude.",
    duration: "4-6 weeks",
    resources: ["SQL for Data Science", "Amplitude Academy"],
    status: "in-progress",
  },
  {
    title: "Build a Side Project",
    description: "Apply your skills by building a small product from scratch. Document the process and outcomes.",
    duration: "8-12 weeks",
    resources: ["No-code tools (Bubble, Webflow)", "Product Hunt"],
    status: "pending",
  },
  {
    title: "Networking & Interview Prep",
    description: "Connect with PMs in your target industry and practice case interviews.",
    duration: "Ongoing",
    resources: ["Exponent", "Cracking the PM Interview"],
    status: "pending",
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-primary">Your Personalized Roadmap</h2>
          <p className="text-muted-foreground">A step-by-step guide to transition into product management.</p>
        </div>

        <div className="relative space-y-8 before:absolute before:left-8 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
          {SAMPLE_ROADMAP.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative pl-16"
            >
              <div className={`absolute left-6 top-1 w-4 h-4 rounded-full border-2 bg-background z-10 ${
                item.status === 'completed' ? 'border-accent bg-accent' : 
                item.status === 'in-progress' ? 'border-accent animate-pulse' : 'border-muted'
              }`}>
                {item.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>

              <Card className={item.status === 'in-progress' ? 'border-accent/50 bg-accent/5 shadow-md' : 'shadow-sm'}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-primary">{item.title}</CardTitle>
                    <div className="flex items-center gap-1 text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">
                      <Clock className="w-3 h-3" /> {item.duration}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-accent" /> Recommended Resources
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.resources.map((res, j) => (
                        <span key={j} className="text-[10px] font-bold px-2 py-1 rounded-md bg-secondary text-primary border border-border">
                          {res}
                        </span>
                      ))}
                    </div>
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
