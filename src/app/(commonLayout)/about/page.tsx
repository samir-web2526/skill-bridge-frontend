import { BookOpen, Target, Users, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-emerald-900 py-24 sm:py-32">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
            Empowering students with <br className="hidden sm:block" />
            <span className="text-emerald-400">the best tutors</span>
          </h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            SkillBridge is Bangladesh's leading tutoring platform. We connect eager learners with qualified educators to unlock potential and achieve academic excellence.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl shadow-lg border border-border p-8 sm:p-10 flex flex-col items-start hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 mb-6">
              <Target size={28} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To democratize access to quality education by providing a seamless, reliable, and transparent platform where students can find the perfect tutors tailored to their learning needs and goals.
            </p>
          </div>
          <div className="bg-card rounded-2xl shadow-lg border border-border p-8 sm:p-10 flex flex-col items-start hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 mb-6">
              <Globe size={28} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              We envision a world where every student has the personalized support they need to thrive, bridging the gap between potential and success through innovative educational technology.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight mb-4">Our Core Values</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            The principles that guide our platform, our team, and our community of educators and learners.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            {
              icon: BookOpen,
              title: "Excellence in Learning",
              desc: "We prioritize academic rigor and continuous improvement for both students and tutors.",
              color: "text-amber-500",
              bg: "bg-amber-100 dark:bg-amber-900/30",
            },
            {
              icon: Shield,
              title: "Trust & Safety",
              desc: "Every tutor is verified. We ensure a secure and transparent environment for all users.",
              color: "text-emerald-500",
              bg: "bg-emerald-100 dark:bg-emerald-900/30",
            },
            {
              icon: Users,
              title: "Community First",
              desc: "We build meaningful connections that foster mentorship, growth, and lifelong success.",
              color: "text-indigo-500",
              bg: "bg-indigo-100 dark:bg-indigo-900/30",
            },
          ].map((val, idx) => (
            <div key={idx} className="text-center group">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${val.bg} ${val.color}`}>
                <val.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{val.title}</h3>
              <p className="text-muted-foreground">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-muted rounded-3xl p-10 sm:p-16 relative overflow-hidden border border-border">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-6 relative z-10">
            Ready to start your journey?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 relative z-10">
            Join thousands of students and tutors on SkillBridge today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl px-8 w-full sm:w-auto font-semibold">
              <Link href="/register">Sign Up as Student</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border text-foreground hover:bg-background rounded-xl px-8 w-full sm:w-auto font-semibold">
              <Link href="/register">Apply as Tutor</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
