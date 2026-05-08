"use client";

import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Get in <span className="text-emerald-600">Touch</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Have questions about finding a tutor or joining as an educator? Our support team is here to help you 24/7.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Email Us</h3>
                <p className="text-sm text-muted-foreground mb-2">For general inquiries and support.</p>
                <a href="mailto:support@skillbridge.com" className="text-sm font-semibold text-emerald-600 hover:underline">
                  support@skillbridge.com
                </a>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Call Us</h3>
                <p className="text-sm text-muted-foreground mb-2">Mon-Fri from 9am to 6pm.</p>
                <a href="tel:+8801234567890" className="text-sm font-semibold text-emerald-600 hover:underline">
                  +880 1234 567 890
                </a>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Visit Us</h3>
                <p className="text-sm text-muted-foreground mb-2">Our headquarters.</p>
                <span className="text-sm font-semibold text-foreground">
                  Banani, Dhaka-1213, Bangladesh
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Send us a message</h2>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <Input placeholder="John Doe" className="bg-background" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email Address</label>
                    <Input type="email" placeholder="john@example.com" className="bg-background" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Subject</label>
                  <Input placeholder="How can we help?" className="bg-background" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Message</label>
                  <Textarea placeholder="Write your message here..." className="bg-background min-h-[150px]" required />
                </div>
                <Button type="submit" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 h-12 font-semibold">
                  Send Message <Send size={16} className="ml-2" />
                </Button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
