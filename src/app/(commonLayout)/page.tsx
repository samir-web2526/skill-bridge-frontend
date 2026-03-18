import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  MapPin,
  Star,
} from "lucide-react";
import SearchBar from "@/components/pages/homePage/SearchBar";
import { getAllCategories } from "@/lib/auth/adminActions/actions";
import { getTutors } from "@/services/tutors.services";
import { getCategoryColor } from "@/lib/category/categoryColors";
import { getAllReviews } from "@/lib/reviews/reviewsActions";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */

const tutorsResult = await getTutors(
  {
    search: "",
    category: "All",
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
    availableOnly: false,
  },
  1,
  3,
);
const tutors = tutorsResult?.data ?? [];
const categoriesResult = await getAllCategories(1, 10);
const categories = categoriesResult?.data ?? [];
const reviewsResult = await getAllReviews(1, 3);
const reviews = reviewsResult?.data ?? [];

const STEPS = [
  {
    num: "01",
    title: "Pick a Subject",
    desc: "Choose the subject or class level you need help with.",
  },
  {
    num: "02",
    title: "Browse Tutors",
    desc: "Filter by rating, price and experience to find your match.",
  },
  {
    num: "03",
    title: "Book a Slot",
    desc: "Pick a date and time that works best for your schedule.",
  },
  {
    num: "04",
    title: "Start Learning",
    desc: "Study online or in-person — completely your choice.",
  },
];

/* ─────────────────────────────────────────
   HERO ILLUSTRATION
───────────────────────────────────────── */
function HeroBanner() {
  return (
    <div className="relative w-full max-w-135 mx-auto">
      {/* soft background */}
      <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-emerald-50 via-teal-50 to-sky-50" />

      <svg
        viewBox="0 0 520 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full"
      >
        {/* ── BG BLOBS ── */}
        <circle cx="400" cy="75" r="85" fill="#d1fae5" opacity="0.55" />
        <circle cx="75" cy="370" r="65" fill="#a7f3d0" opacity="0.4" />
        <circle cx="460" cy="350" r="50" fill="#6ee7b7" opacity="0.22" />
        <ellipse
          cx="260"
          cy="430"
          rx="185"
          ry="26"
          fill="#bbf7d0"
          opacity="0.45"
        />

        {/* ── DESK ── */}
        <rect x="55" y="335" width="410" height="16" rx="8" fill="#a7f3d0" />
        <rect x="95" y="351" width="14" height="55" rx="7" fill="#6ee7b7" />
        <rect x="411" y="351" width="14" height="55" rx="7" fill="#6ee7b7" />

        {/* ── BOOK STACK (left) ── */}
        <rect x="68" y="290" width="88" height="20" rx="5" fill="#34d399" />
        <rect x="73" y="272" width="80" height="20" rx="5" fill="#059669" />
        <rect x="64" y="254" width="96" height="20" rx="5" fill="#10b981" />
        <rect
          x="88"
          y="257"
          width="3"
          height="14"
          rx="1.5"
          fill="#fff"
          opacity="0.3"
        />
        <rect
          x="95"
          y="257"
          width="3"
          height="14"
          rx="1.5"
          fill="#fff"
          opacity="0.3"
        />
        <rect
          x="83"
          y="275"
          width="3"
          height="14"
          rx="1.5"
          fill="#fff"
          opacity="0.3"
        />
        <rect
          x="90"
          y="275"
          width="3"
          height="14"
          rx="1.5"
          fill="#fff"
          opacity="0.3"
        />

        {/* ── OPEN BOOK (centre) ── */}
        <path
          d="M172 308 Q218 288 258 308 Q298 288 344 308 L344 336 Q298 316 258 336 Q218 316 172 336 Z"
          fill="#fff"
          stroke="#d1fae5"
          strokeWidth="1.5"
        />
        <line
          x1="258"
          y1="308"
          x2="258"
          y2="336"
          stroke="#d1fae5"
          strokeWidth="1.5"
        />
        <line
          x1="190"
          y1="318"
          x2="246"
          y2="313"
          stroke="#a7f3d0"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="190"
          y1="325"
          x2="246"
          y2="320"
          stroke="#a7f3d0"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="190"
          y1="332"
          x2="246"
          y2="327"
          stroke="#a7f3d0"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="270"
          y1="313"
          x2="326"
          y2="318"
          stroke="#a7f3d0"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="270"
          y1="320"
          x2="326"
          y2="325"
          stroke="#a7f3d0"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="270"
          y1="327"
          x2="326"
          y2="332"
          stroke="#a7f3d0"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* ── LAPTOP (right) ── */}
        <rect x="352" y="262" width="112" height="74" rx="6" fill="#1f2937" />
        <rect x="357" y="267" width="102" height="64" rx="4" fill="#064e3b" />
        <rect x="360" y="270" width="96" height="58" rx="3" fill="#065f46" />
        <rect
          x="367"
          y="278"
          width="52"
          height="4"
          rx="2"
          fill="#34d399"
          opacity="0.9"
        />
        <rect
          x="367"
          y="287"
          width="38"
          height="4"
          rx="2"
          fill="#6ee7b7"
          opacity="0.7"
        />
        <rect
          x="373"
          y="296"
          width="46"
          height="4"
          rx="2"
          fill="#a7f3d0"
          opacity="0.6"
        />
        <rect
          x="373"
          y="305"
          width="30"
          height="4"
          rx="2"
          fill="#6ee7b7"
          opacity="0.7"
        />
        <rect
          x="367"
          y="314"
          width="58"
          height="4"
          rx="2"
          fill="#34d399"
          opacity="0.5"
        />
        <rect x="428" y="314" width="3" height="8" rx="1" fill="#34d399">
          <animate
            attributeName="opacity"
            values="1;0;1"
            dur="1.1s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="337" y="336" width="142" height="8" rx="4" fill="#374151" />
        <rect x="387" y="336" width="42" height="5" rx="2.5" fill="#1f2937" />

        {/* ── STUDENT 1 — reading (left) ── */}
        {/* legs */}
        <rect x="122" y="276" width="13" height="50" rx="6" fill="#fde68a" />
        <rect x="143" y="276" width="13" height="50" rx="6" fill="#fde68a" />
        <ellipse cx="128" cy="328" rx="11" ry="6" fill="#1f2937" />
        <ellipse cx="150" cy="328" rx="11" ry="6" fill="#1f2937" />
        {/* body */}
        <rect x="116" y="218" width="46" height="60" rx="12" fill="#34d399" />
        {/* arms */}
        <path
          d="M116 233 Q98 253 109 267"
          stroke="#fde68a"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M162 233 Q176 253 149 267"
          stroke="#fde68a"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        {/* book in hands */}
        <rect x="106" y="257" width="38" height="28" rx="4" fill="#059669" />
        <line
          x1="125"
          y1="259"
          x2="125"
          y2="283"
          stroke="#fff"
          strokeWidth="1"
          opacity="0.4"
        />
        {/* head */}
        <circle cx="139" cy="203" r="21" fill="#fde68a" />
        {/* hair */}
        <path
          d="M118 196 Q121 177 139 174 Q157 177 160 196 Q153 186 139 184 Q125 186 118 196Z"
          fill="#92400e"
        />
        {/* eyes */}
        <circle cx="132" cy="201" r="2.5" fill="#1f2937" />
        <circle cx="146" cy="201" r="2.5" fill="#1f2937" />
        <circle cx="133" cy="200" r="1" fill="#fff" />
        <circle cx="147" cy="200" r="1" fill="#fff" />
        {/* smile */}
        <path
          d="M133 209 Q139 214 145 209"
          stroke="#92400e"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── STUDENT 2 — laptop (centre) ── */}
        {/* legs */}
        <rect x="234" y="276" width="13" height="52" rx="6" fill="#fed7aa" />
        <rect x="255" y="276" width="13" height="52" rx="6" fill="#fed7aa" />
        <ellipse cx="240" cy="330" rx="11" ry="6" fill="#7c3aed" />
        <ellipse cx="261" cy="330" rx="11" ry="6" fill="#7c3aed" />
        {/* body */}
        <rect x="226" y="212" width="48" height="66" rx="12" fill="#6366f1" />
        {/* arms */}
        <path
          d="M226 228 Q208 258 228 272"
          stroke="#fed7aa"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M274 228 Q293 254 270 272"
          stroke="#fed7aa"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        {/* head */}
        <circle cx="250" cy="195" r="23" fill="#fed7aa" />
        {/* hair */}
        <path
          d="M227 189 Q230 166 250 163 Q270 166 273 189 Q265 177 250 175 Q235 177 227 189Z"
          fill="#1c1917"
        />
        {/* glasses */}
        <rect
          x="237"
          y="190"
          width="12"
          height="8"
          rx="3"
          fill="none"
          stroke="#6366f1"
          strokeWidth="1.5"
        />
        <rect
          x="252"
          y="190"
          width="12"
          height="8"
          rx="3"
          fill="none"
          stroke="#6366f1"
          strokeWidth="1.5"
        />
        <line
          x1="249"
          y1="194"
          x2="252"
          y2="194"
          stroke="#6366f1"
          strokeWidth="1.5"
        />
        {/* eyes */}
        <circle cx="243" cy="194" r="2" fill="#1f2937" />
        <circle cx="258" cy="194" r="2" fill="#1f2937" />
        {/* smile */}
        <path
          d="M244 203 Q250 208 256 203"
          stroke="#c2410c"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── STUDENT 3 — standing, raising pencil (right) ── */}
        {/* legs */}
        <rect x="360" y="271" width="13" height="56" rx="6" fill="#fecaca" />
        <rect x="380" y="271" width="13" height="56" rx="6" fill="#fecaca" />
        <ellipse cx="366" cy="329" rx="11" ry="6" fill="#92400e" />
        <ellipse cx="386" cy="329" rx="11" ry="6" fill="#92400e" />
        {/* body */}
        <rect x="355" y="207" width="44" height="66" rx="12" fill="#f59e0b" />
        {/* arms */}
        <path
          d="M399 220 Q418 193 412 172"
          stroke="#fecaca"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M355 220 Q337 248 353 265"
          stroke="#fecaca"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        {/* pencil */}
        <g transform="rotate(-22, 412, 158)">
          <rect x="408" y="150" width="8" height="26" rx="3" fill="#fbbf24" />
          <polygon points="408,150 416,150 412,139" fill="#fde68a" />
          <rect x="408" y="174" width="8" height="5" rx="1" fill="#f87171" />
        </g>
        {/* head */}
        <circle cx="377" cy="191" r="22" fill="#fecaca" />
        {/* hair */}
        <path
          d="M355 184 Q362 162 377 159 Q392 162 399 184 Q393 171 377 169 Q361 171 355 184Z"
          fill="#7f1d1d"
        />
        {/* ponytail */}
        <path d="M399 177 Q416 170 413 188 Q408 183 399 186Z" fill="#7f1d1d" />
        {/* eyes */}
        <circle cx="370" cy="189" r="2.5" fill="#1f2937" />
        <circle cx="384" cy="189" r="2.5" fill="#1f2937" />
        <circle cx="371" cy="188" r="1" fill="#fff" />
        <circle cx="385" cy="188" r="1" fill="#fff" />
        {/* smile */}
        <path
          d="M371 198 Q377 204 383 198"
          stroke="#9f1239"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── FLOATING MATH SYMBOLS ── */}
        <text
          x="48"
          y="160"
          fontSize="22"
          fill="#059669"
          opacity="0.45"
          fontWeight="bold"
        >
          ∑
        </text>
        <text
          x="456"
          y="195"
          fontSize="20"
          fill="#6366f1"
          opacity="0.45"
          fontWeight="bold"
        >
          ∫
        </text>
        <text
          x="28"
          y="265"
          fontSize="18"
          fill="#f59e0b"
          opacity="0.5"
          fontWeight="bold"
        >
          π
        </text>
        <text
          x="478"
          y="148"
          fontSize="16"
          fill="#10b981"
          opacity="0.5"
          fontWeight="bold"
        >
          x²
        </text>
        <text
          x="460"
          y="265"
          fontSize="18"
          fill="#f59e0b"
          opacity="0.4"
          fontWeight="bold"
        >
          √
        </text>

        {/* ── FLOATING BADGE: A+ ── */}
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;0,-7;0,0"
            dur="3s"
            repeatCount="indefinite"
          />
          <rect
            x="38"
            y="55"
            width="60"
            height="34"
            rx="10"
            fill="#fff"
            stroke="#d1fae5"
            strokeWidth="1.5"
            filter="url(#sh)"
          />
          <text
            x="68"
            y="78"
            fontSize="16"
            fontWeight="800"
            fill="#059669"
            textAnchor="middle"
          >
            A+
          </text>
        </g>

        {/* ── FLOATING BADGE: 98% ── */}
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;0,-6;0,0"
            dur="3.6s"
            repeatCount="indefinite"
          />
          <rect
            x="394"
            y="28"
            width="72"
            height="34"
            rx="10"
            fill="#fff"
            stroke="#e0e7ff"
            strokeWidth="1.5"
            filter="url(#sh)"
          />
          <text
            x="430"
            y="51"
            fontSize="13"
            fontWeight="800"
            fill="#6366f1"
            textAnchor="middle"
          >
            98% ✓
          </text>
        </g>

        {/* ── FLOATING BADGE: Live ── */}
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;0,-8;0,0"
            dur="4s"
            repeatCount="indefinite"
          />
          <rect
            x="192"
            y="46"
            width="78"
            height="28"
            rx="14"
            fill="#ecfdf5"
            stroke="#a7f3d0"
            strokeWidth="1.5"
          />
          <circle cx="210" cy="60" r="5" fill="#10b981">
            <animate
              attributeName="opacity"
              values="1;0.2;1"
              dur="1.4s"
              repeatCount="indefinite"
            />
          </circle>
          <text x="222" y="65" fontSize="12" fontWeight="700" fill="#065f46">
            Live
          </text>
        </g>

        {/* ── SPINNING STAR (top right) ── */}
        <g transform="translate(454,62)">
          <polygon
            points="0,-14 3.5,-5.5 13,-5.5 5.5,0.5 8.5,11 0,5.5 -8.5,11 -5.5,0.5 -13,-5.5 -3.5,-5.5"
            fill="#fbbf24"
            opacity="0.85"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0"
              to="360"
              dur="9s"
              repeatCount="indefinite"
            />
          </polygon>
        </g>
        {/* small star */}
        <g transform="translate(65,118)">
          <polygon
            points="0,-9 2,-3.5 8,-3.5 3.5,0.5 5.5,7 0,3.5 -5.5,7 -3.5,0.5 -8,-3.5 -2,-3.5"
            fill="#34d399"
            opacity="0.7"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360"
              to="0"
              dur="6s"
              repeatCount="indefinite"
            />
          </polygon>
        </g>

        <defs>
          <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="4"
              floodColor="#059669"
              floodOpacity="0.1"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────
   STAR RATING
───────────────────────────────────────── */
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={
            s <= Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-zinc-200 text-zinc-200"
          }
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default async function SkillBridgeHome() {
  return (
    <div className="min-h-screen bg-[#faf9f7] text-zinc-900">
      {/* ── HERO ── */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <Badge className="mb-6 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse inline-block" />
            Bangladesh's #1 Tutor Platform
          </Badge>

          <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight mb-6">
            Find the{" "}
            <span className="text-emerald-600 relative">
              perfect tutor
              <svg
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 300 8"
                fill="none"
              >
                <path
                  d="M0 6 Q75 0 150 5 Q225 10 300 4"
                  stroke="#6ee7b7"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            ,<br />
            <span className="text-zinc-400">ace every exam.</span>
          </h1>

          <p className="text-zinc-500 text-lg leading-relaxed mb-8 max-w-lg">
            Connect with verified school and college tutors across Bangladesh.
            Book sessions for any subject, any time, from anywhere.
          </p>

          <SearchBar />

          {/* Stats */}
          <div className="flex gap-8 pt-6 border-t border-zinc-100">
            {[
              ["5,800+", "Active Students"],
              ["640+", "Verified Tutors"],
              ["98%", "Satisfaction Rate"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                  {n}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5 font-medium">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Illustration */}
        <div className="hidden lg:flex items-center justify-center">
          <HeroBanner />
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="bg-white border-y border-zinc-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-2">
            Browse by Level
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight mb-10">
            Which class do you need help with?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const { bg, text, icon: Icon } = getCategoryColor(cat.name);
              return (
                <Card
                  key={cat.id}
                  className={`group cursor-pointer border-0 hover:-translate-y-1 transition-all duration-200 ${bg}`}
                >
                  <CardContent className="p-5 text-center">
                    <Icon size={22} className={`mx-auto mb-3 ${text}`} />
                    <div
                      className={`font-semibold text-sm mb-1 ${text} opacity-90`}
                    >
                      {cat.name}
                    </div>
                    <div
                      className={`text-xs leading-relaxed ${text} opacity-70`}
                    >
                      {cat.description ?? ""}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED TUTORS ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-2">
                Featured
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Meet our top tutors
              </h2>
            </div>
            <Button
              variant="ghost"
              className="text-emerald-600 font-semibold text-sm group"
            >
              View all tutors{" "}
              <ArrowRight
                size={14}
                className="ml-1.5 group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {tutors.map((t) => (
              <Card
                key={t.id}
                className="group border border-zinc-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <CardHeader className="p-5 pb-4">
                  <div className="flex gap-3 items-start">
                    <Avatar className="h-12 w-12 rounded-xl shrink-0 bg-emerald-100">
                      <AvatarFallback className="font-bold text-base rounded-xl bg-emerald-100 text-emerald-700">
                        {t.user.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-base leading-tight">
                        {t.user.name}
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1">
                        <MapPin size={11} /> {t.user.email}
                      </div>
                      <Badge
                        variant="outline"
                        className="mt-1.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border-emerald-200"
                      >
                        {t.category?.name ?? "Tutor"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <Badge
                      variant="secondary"
                      className="text-xs rounded-md bg-zinc-100 text-zinc-700 font-medium"
                    >
                      {t.category?.name}
                    </Badge>
                  </div>
                  <Separator className="mb-4" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Stars rating={t.averageRating} />
                      <span className="text-xs text-zinc-400">
                        {t.averageRating} ({t.totalReview})
                      </span>
                    </div>
                    <div>
                      <span className="font-extrabold text-base">
                        ৳{t.hourlyRate}
                      </span>
                      <span className="text-xs text-zinc-400"> /hr</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-5 pb-5">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold">
                    Book a Session
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-white border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-2">
              How It Works
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Get started in 4 simple steps
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-zinc-100 z-0" />
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="text-center relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-100">
                  {num}
                </div>
                <h3 className="font-bold text-base mb-2">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUBJECTS ── */}
      <section className="py-20 bg-emerald-700">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-bold tracking-widest text-emerald-300 uppercase mb-2">
            All Subjects
          </p>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-10">
            Tutors available for every subject
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const { icon: Icon, darkColor } = getCategoryColor(cat.name);
              return (
                <div
                  key={cat.id}
                  className="group flex items-center gap-4 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl px-5 py-4 cursor-pointer transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Icon size={18} className={darkColor} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white text-sm">
                      {cat.name}
                    </div>
                    <div className="text-xs text-emerald-300/60 mt-0.5">
                      {cat._count?.tutor ?? 0} tutors available {/* ← eta */}
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-white/20 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-20 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-2">
            Reviews
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight mb-10">
            What students are saying
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {reviews.map((review) => {
              const tutorInitials =
                review.tutor?.user?.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) ?? "T";
              const studentInitials =
                review.user?.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) ?? "S";

              const avatarColors = [
                { bg: "bg-emerald-50", text: "text-emerald-700" },
                { bg: "bg-purple-50", text: "text-purple-700" },
                { bg: "bg-amber-50", text: "text-amber-800" },
                { bg: "bg-blue-50", text: "text-blue-700" },
                { bg: "bg-rose-50", text: "text-rose-700" },
              ];
              const color =
                avatarColors[review.id?.charCodeAt(0) % avatarColors.length] ??
                avatarColors[0];

              return (
                <Card
                  key={review.id}
                  className="border border-zinc-100 hover:shadow-md transition-shadow flex flex-col"
                >
                  <CardContent className="p-5 flex flex-col gap-3 flex-1">
                    {/* Tutor info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback
                          className={`font-medium text-sm ${color.bg} ${color.text}`}
                        >
                          {tutorInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-foreground leading-tight">
                          {review.tutor?.user?.name ?? "Tutor"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {review.tutor?.category?.name ?? ""}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Rating */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map(
                        (_: unknown, i: number) => (
                          <Star
                            key={i}
                            size={13}
                            className={
                              i < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-zinc-200 text-zinc-200"
                            }
                          />
                        ),
                      )}
                    </div>

                    {/* Comment */}
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      {review.comment ?? "Great tutor!"}
                    </p>

                    <Separator />

                    {/* Student info */}
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className="text-[11px] font-medium bg-zinc-100 text-zinc-600">
                          {studentInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          {review.user?.name ?? "Student"}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Verified Student
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-zinc-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Badge className="mb-5 bg-emerald-900/60 text-emerald-400 border border-emerald-800 rounded-full">
            <CheckCircle size={11} className="mr-1.5" /> No credit card required
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Start learning today.
            <br />
            <span className="text-emerald-400">First class is free.</span>
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            Sign up now and enjoy your first session with any tutor completely
            free of charge.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl px-8 font-semibold text-base"
            >
              Book a Free Class <ArrowRight size={16} className="ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl px-8 font-semibold text-base bg-transparent"
            >
              Become a Tutor
            </Button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-zinc-950 border-t border-zinc-800 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center">
              <BookOpen size={12} className="text-white" />
            </div>
            <span className="font-bold text-white">
              Skill<span className="text-emerald-500">Bridge</span>
            </span>
          </div>
          <div className="flex gap-6 flex-wrap justify-center">
            {[
              "Find Tutors",
              "Become a Tutor",
              "About Us",
              "Contact",
              "Privacy Policy",
            ].map((l) => (
              <a
                key={l}
                href="#"
                className="text-xs text-zinc-500 hover:text-white transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
          <div className="text-xs text-zinc-600">
            © 2025 SkillBridge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
