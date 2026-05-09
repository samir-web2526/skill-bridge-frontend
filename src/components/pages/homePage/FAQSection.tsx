"use client";

import { useState } from "react";

const faqs = [
    {
        q: "How do I find a tutor?",
        a: "You can use our search bar to filter by subject, level, and location to find the perfect match.",
    },
    {
        q: "Is the first class really free?",
        a: "Yes! Every new student gets their first session with any tutor completely free.",
    },
    {
        q: "Can I book multiple subjects?",
        a: "Absolutely. You can book sessions for as many subjects as you need help with.",
    },
    {
        q: "How are tutors verified?",
        a: "We verify educational backgrounds and conduct interviews before tutors join our platform.",
    },
];

export default function FAQAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

    return (
        <section className="py-20 bg-background border-y border-border">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-14">
                    <p className="text-xs font-bold tracking-widest text-primary uppercase mb-2">
                        FAQ
                    </p>
                    <h2 className="text-3xl font-extrabold tracking-tight">
                        Frequently Asked Questions
                    </h2>
                </div>

                {/* Accordion list */}
                <div className="max-w-2xl mx-auto space-y-3">
                    {faqs.map(({ q, a }, i) => {
                        const isOpen = openIndex === i;
                        return (
                            <div
                                key={i}
                                className={`rounded-2xl border transition-all duration-200 shadow-sm bg-background ${isOpen ? "border-primary" : "border-border"
                                    }`}
                            >
                                {/* Question row — clickable */}
                                <button
                                    onClick={() => toggle(i)}
                                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                                    aria-expanded={isOpen}
                                >
                                    <span className="font-bold text-base text-foreground">{q}</span>

                                    {/* Chevron icon */}
                                    <span
                                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen
                                                ? "bg-primary text-primary-foreground rotate-180"
                                                : "bg-muted text-muted-foreground rotate-0"
                                            }`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </span>
                                </button>

                                {/* Answer — animated reveal */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                                        {a}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}