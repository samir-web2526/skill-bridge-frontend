import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Category {
    id: string | number;
    name: string;
    _count?: { tutor?: number };
}

interface SubjectsSectionProps {
    categories?: Category[];
}

// ─── Icon + colour map ────────────────────────────────────────────────────────
function getCategoryColor(name: string): {
    icon: React.FC<{ size?: number; className?: string }>;
    accent: string;      // Tailwind text colour for the icon
    pill: string;        // Tailwind bg for the icon pill
    hover: string;       // Tailwind border colour on hover
} {
    const map: Record<
        string,
        { accent: string; pill: string; hover: string }
    > = {
        Mathematics: { accent: "text-violet-600", pill: "bg-violet-50", hover: "hover:border-violet-300" },
        Science: { accent: "text-sky-600", pill: "bg-sky-50", hover: "hover:border-sky-300" },
        English: { accent: "text-rose-500", pill: "bg-rose-50", hover: "hover:border-rose-300" },
        History: { accent: "text-amber-600", pill: "bg-amber-50", hover: "hover:border-amber-300" },
        Geography: { accent: "text-teal-600", pill: "bg-teal-50", hover: "hover:border-teal-300" },
        Physics: { accent: "text-indigo-600", pill: "bg-indigo-50", hover: "hover:border-indigo-300" },
        Chemistry: { accent: "text-green-600", pill: "bg-green-50", hover: "hover:border-green-300" },
        Biology: { accent: "text-primary", pill: "bg-primary/10", hover: "hover:border-primary/50" },
        Programming: { accent: "text-cyan-600", pill: "bg-cyan-50", hover: "hover:border-cyan-300" },
        Music: { accent: "text-pink-500", pill: "bg-pink-50", hover: "hover:border-pink-300" },
        Art: { accent: "text-orange-500", pill: "bg-orange-50", hover: "hover:border-orange-300" },
        Languages: { accent: "text-blue-500", pill: "bg-blue-50", hover: "hover:border-blue-300" },
    };

    const defaults = { accent: "text-primary", pill: "bg-primary/10", hover: "hover:border-primary/50" };
    const colors = map[name] ?? defaults;

    // Simple SVG icon switcher
    const icons: Record<string, React.FC<{ size?: number; className?: string }>> = {
        Mathematics: ({ size = 18, className }) => (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        ),
        Science: ({ size = 18, className }) => (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 3H5a2 2 0 0 0-2 2v4" /><path d="M9 3v18" /><path d="M15 3h4a2 2 0 0 1 2 2v4" /><path d="M15 3v18" /><path d="M3 9h18" /><path d="M3 15h18" /><path d="M9 21H5a2 2 0 0 1-2-2v-4" /><path d="M15 21h4a2 2 0 0 0 2-2v-4" /></svg>
        ),
        English: ({ size = 18, className }) => (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
        ),
        Programming: ({ size = 18, className }) => (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
        ),
        Music: ({ size = 18, className }) => (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
        ),
        Art: ({ size = 18, className }) => (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="M8.5 8.5c1.5-1 3.5-1 5 0" /><path d="M8.5 15.5c1.5 1 3.5 1 5 0" /></svg>
        ),
    };

    const DefaultIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
        </svg>
    );

    return { icon: icons[name] ?? DefaultIcon, ...colors };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SubjectsSection({ categories = [] }: SubjectsSectionProps) {
    return (
        <section className="py-20 bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="mb-12">
                    <p className="text-xs font-bold tracking-widest text-primary uppercase mb-2">
                        All Subjects
                    </p>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Tutors available for every subject
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categories.map((cat) => {
                        const { icon: Icon, accent, pill, hover } = getCategoryColor(cat.name);
                        return (
                            <Link
                                key={cat.id}
                                href={`/tutors?category=${encodeURIComponent(cat.name)}`}
                                className={`group flex items-center gap-4 bg-white border border-gray-200 ${hover} rounded-xl px-5 py-4 transition-all duration-200 shadow-sm hover:shadow-md`}
                            >
                                {/* Icon pill */}
                                <div className={`w-10 h-10 rounded-lg ${pill} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                                    <Icon size={18} className={accent} />
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-800 text-sm truncate">
                                        {cat.name}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-0.5">
                                        {cat._count?.tutor ?? 0} tutors available
                                    </div>
                                </div>

                                {/* Arrow */}
                                <svg
                                    className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round"
                                >
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}