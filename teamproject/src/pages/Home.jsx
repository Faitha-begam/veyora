import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CircleCheck,
  ListChecks,
  MapPinned,
  Moon,
  PhoneCall,
  Search,
  ShieldCheck,
  Users,
  Waypoints,
} from "lucide-react";

// Veyora colours used on this page:
//   Deep Navy #142B45   Blue #2563EB   Teal #14B8A6   Light #F8FAFC   White #FFFFFF

// Worked out once when the page loads (used in the footer)
const CURRENT_YEAR = new Date().getFullYear();

// ----------------------------- Page content --------------------------------
// The text lives in these lists so it is easy to edit without touching the layout.

const FEATURES = [
  {
    icon: Moon,
    title: "Night-Time Transport Finder",
    text: "Search buses, trains and rides by date and time. Overnight journeys show the real departure, arrival, duration and next-day date.",
    link: "/find-transport",
    linkLabel: "Find transport",
  },
  {
    icon: Waypoints,
    title: "Smart Alternative Routes",
    text: "No direct service? Veyora builds connections through bus stops and railway stations, checks every transfer and adds up the fare and journey time.",
    link: "/find-transport",
    linkLabel: "Try a route",
  },
  {
    icon: ShieldCheck,
    title: "Women's Travel Safety",
    text: "Look up safer places near you, such as stations, hospitals and pharmacies, with a safety level and the reason behind it.",
    link: "/safe-places",
    linkLabel: "View safe places",
  },
  {
    icon: Users,
    title: "Shared Rides",
    text: "Travel the same way as others and share the ride, with a women-only option and an SOS shortcut to 112.",
    link: "/shared-rides",
    linkLabel: "See shared rides",
  },
];

const STEPS = [
  {
    icon: Search,
    title: "Enter your journey",
    text: "Type where you are starting, where you are going, and the date and time you want to leave.",
  },
  {
    icon: CalendarClock,
    title: "See direct options",
    text: "Veyora lists vehicles that leave at or after your time, with departure, arrival, duration and fare.",
  },
  {
    icon: ListChecks,
    title: "Get checked alternatives",
    text: "If nothing runs directly, you get connecting routes with validated transfers, ranked by time and fare.",
  },
  {
    icon: ShieldCheck,
    title: "Travel more safely",
    text: "Find safe places to wait, choose a shared or women-only ride, and keep SOS 112 one tap away.",
  },
];

const SAFETY_POINTS = [
  {
    icon: MapPinned,
    title: "Safer places on your route",
    text: "Search an area to see nearby places with a safety level, distance, opening status and why they are considered safe.",
  },
  {
    icon: BadgeCheck,
    title: "Verified, women-only travel",
    text: "Choose women-only rides, backed by mutual Aadhaar and DigiLocker verification for shared journeys.",
  },
  {
    icon: PhoneCall,
    title: "SOS to 112",
    text: "A shortcut to India's emergency number is always on screen while you travel.",
  },
];

const SHARED_STEPS = [
  "Pick your route and travel time.",
  "Choose to share the ride with people going the same way.",
  "Split the cost, and switch on women-only matching if you prefer.",
];

// ------------------------------ Small pieces -------------------------------

const SectionHeading = ({ eyebrow, title, text, light = false }) => (
  <div className="mx-auto mb-12 max-w-2xl text-center">
    <p className="text-sm font-semibold uppercase tracking-widest text-[#14B8A6]">
      {eyebrow}
    </p>
    <h2
      className={`mt-2 text-3xl font-bold sm:text-4xl ${
        light ? "text-white" : "text-[#142B45]"
      }`}
    >
      {title}
    </h2>
    {text && (
      <p className={`mt-4 text-lg ${light ? "text-slate-300" : "text-slate-600"}`}>
        {text}
      </p>
    )}
  </div>
);

// A small sample of what a search result looks like (clearly labelled as a sample)
const JourneyPreview = () => (
  <div className="rounded-2xl bg-white p-6 text-left shadow-xl">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="font-bold text-[#142B45]">Tirunelveli → Madurai</p>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
        Sample journey
      </span>
    </div>

    <p className="mt-1 text-sm text-slate-600">
      Searched at 21:30 · no direct service left
    </p>

    <div className="mt-4 space-y-3">
      <div className="rounded-xl bg-[#F8FAFC] p-4">
        <p className="text-xs font-semibold text-slate-500">FIRST TRANSPORT</p>
        <p className="mt-1 font-semibold text-[#142B45]">
          Taxi · Tirunelveli → Kovilpatti
        </p>
        <p className="text-sm text-slate-600">22:30 – 23:30 · ₹500</p>
      </div>

      <div className="flex items-center gap-2 px-1 text-sm font-medium text-[#142B45]">
        <CircleCheck className="h-4 w-4 text-[#14B8A6]" aria-hidden="true" />
        60 min wait · transfer checked
      </div>

      <div className="rounded-xl bg-[#F8FAFC] p-4">
        <p className="text-xs font-semibold text-slate-500">TRANSFER 1</p>
        <p className="mt-1 font-semibold text-[#142B45]">
          Bus · Kovilpatti → Madurai
        </p>
        <p className="text-sm text-slate-600">
          00:30 – 02:00 <span className="font-medium">(next day)</span> · ₹100
        </p>
      </div>
    </div>

    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4">
      <p className="font-bold text-[#142B45]">Total fare: ₹600</p>
      <p className="text-sm text-slate-600">Total time: 3h 30m</p>
    </div>
  </div>
);

// --------------------------------- Page ------------------------------------

const Home = () => {
  return (
    <div className="bg-[#F8FAFC] text-[#142B45]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#142B45] px-4 py-16 text-white sm:py-24">
        {/* soft teal glow in the corner */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#14B8A6]/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/40 px-4 py-1 text-sm font-medium text-[#14B8A6]">
              <Moon className="h-4 w-4" aria-hidden="true" />
              Night-time travel, planned properly
            </p>

            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
              Get home safely, even when the last bus has gone.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Veyora finds night buses, trains and rides for your route. When
              nothing runs directly, it builds a connecting journey with
              transfer times it has actually checked, and keeps safety features
              close by.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/find-transport"
                className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700"
              >
                Find Transport
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>

              <a
                href="#how-it-works"
                className="rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                See how it works
              </a>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
              {[
                "Overnight journeys handled",
                "Transfers validated",
                "Women-only ride option",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CircleCheck className="h-4 w-4 text-[#14B8A6]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <JourneyPreview />
        </div>
      </section>

      {/* Main features */}
      <section id="features" className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="What Veyora does"
            title="Everything you need for a night journey"
            text="From finding a vehicle to reaching safely, in one place."
          />

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#142B45]">
                    <Icon className="h-6 w-6 text-[#14B8A6]" aria-hidden="true" />
                  </span>

                  <h3 className="mt-5 text-lg font-bold text-[#142B45]">
                    {feature.title}
                  </h3>

                  <p className="mt-2 flex-1 text-slate-600">{feature.text}</p>

                  <Link
                    to={feature.link}
                    className="mt-5 inline-flex items-center gap-1 font-semibold text-[#2563EB] hover:underline"
                  >
                    {feature.linkLabel}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="How it works"
            title="From search to safe arrival in four steps"
          />

          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;

              return (
                <li
                  key={step.title}
                  className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB] font-bold text-white">
                      {index + 1}
                    </span>
                    <Icon className="h-6 w-6 text-[#142B45]" aria-hidden="true" />
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-[#142B45]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-slate-600">{step.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Women's travel safety */}
      <section id="safety" className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl rounded-3xl bg-[#142B45] p-8 text-white sm:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#14B8A6]">
                Women&apos;s travel safety
              </p>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                Built for travelling after dark
              </h2>
              <p className="mt-4 text-lg text-slate-300">
                A late journey is more than a timetable. Veyora puts safer
                places, verified travel and emergency help next to your route.
              </p>

              <ul className="mt-8 space-y-5">
                {SAFETY_POINTS.map((point) => {
                  const Icon = point.icon;

                  return (
                    <li key={point.title} className="flex gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                        <Icon className="h-5 w-5 text-[#14B8A6]" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-bold">{point.title}</h3>
                        <p className="text-slate-300">{point.text}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <Link
                to="/safe-places"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Explore Safe Places
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>

            {/* Example of what a safe place entry looks like */}
            <div className="rounded-2xl bg-white p-6 text-[#142B45] shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold text-slate-500">
                  EXAMPLE FROM SAFE PLACES
                </p>
                <span className="rounded-full bg-[#14B8A6]/15 px-3 py-1 text-xs font-semibold text-[#142B45]">
                  High safety
                </span>
              </div>

              <p className="mt-3 text-lg font-bold">Ashok Pillar Metro Station</p>
              <p className="text-slate-600">Metro Station · 250 m away · Open</p>

              <p className="mt-4 rounded-xl bg-[#F8FAFC] p-4 text-slate-600">
                CCTV surveillance, security staff, well-lit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shared rides */}
      <section id="shared-rides" className="px-4 pb-16 sm:pb-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#14B8A6]">
              Shared rides
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#142B45] sm:text-4xl">
              Share the ride, not the worry
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Going the same way as someone else? Sharing a ride can cut the
              cost and make a late journey feel safer.
            </p>

            <Link
              to="/shared-rides"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Explore Shared Rides
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#142B45]">
              How a shared ride works
            </h3>

            <ol className="mt-4 space-y-4">
              {SHARED_STEPS.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#14B8A6] font-bold text-[#142B45]">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-slate-600">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="px-4 pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl rounded-3xl bg-[#2563EB] px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-3xl font-bold">Planning a late journey?</h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-blue-100">
            Tell Veyora where you are going and when. It does the checking.
          </p>
          <Link
            to="/find-transport"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-[#142B45] transition hover:bg-slate-100"
          >
            Find Transport
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#142B45] px-4 py-12 text-slate-300">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
          <div>
            <p className="text-xl font-bold tracking-wide text-white">VEYORA</p>
            <p className="mt-3 max-w-xs">
              Night-time transport, alternative routes and travel safety for
              women, in one place.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white">Explore</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/find-transport" className="hover:text-white">
                  Find Transport
                </Link>
              </li>
              <li>
                <Link to="/safe-places" className="hover:text-white">
                  Safe Places
                </Link>
              </li>
              <li>
                <Link to="/shared-rides" className="hover:text-white">
                  Shared Rides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white">Account</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/login" className="hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white">
                  Register
                </Link>
              </li>
            </ul>

            <p className="mt-5 flex items-center gap-2 text-white">
              <PhoneCall className="h-4 w-4 text-[#14B8A6]" aria-hidden="true" />
              In an emergency, call 112
            </p>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-sm text-slate-400">
          <p>© {CURRENT_YEAR} Veyora. A team project.</p>
          <p className="mt-1">
            Timings, fares and availability shown in this app are sample data,
            not live information.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
