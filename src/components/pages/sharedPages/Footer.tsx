"use client";

import { BookOpen, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-background text-muted-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm">
                <BookOpen size={15} className="text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Skill<span className="text-emerald-500">Bridge</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Empowering students across Bangladesh with verified, expert tutors for all subjects and levels.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-emerald-500 transition-colors">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="hover:text-emerald-500 transition-colors">
                <Twitter size={18} />
              </Link>
              <Link href="#" className="hover:text-emerald-500 transition-colors">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="hover:text-emerald-500 transition-colors">
                <Linkedin size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/tutors" className="hover:text-emerald-500 transition-colors">Find Tutors</Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-emerald-500 transition-colors">Student Reviews</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-emerald-500 transition-colors">Become a Tutor</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-500 transition-colors">Login</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-foreground font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/about" className="hover:text-emerald-500 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-500 transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-500 transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-foreground font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>Gulshan-1, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-emerald-500 shrink-0" />
                <span>+880 1234-567890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-emerald-500 shrink-0" />
                <span>support@skillbridge.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 SkillBridge. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
