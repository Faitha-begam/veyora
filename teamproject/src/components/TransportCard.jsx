import { Fragment } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bus,
  Car,
  CarTaxiFront,
  ChevronDown,
  Clock,
  Hourglass,
  Info,
  TrainFront,
  TriangleAlert,
} from "lucide-react";
import {
  ON_DEMAND_TYPES,
  SEARCH_RULES,
  SHORT_TRANSFER_MINUTES,
  formatClock,
  formatDate,
  formatDuration,
  getDayOffset,
  getRoutePlaces,
  getTotalRidingTime,
} from "../utils/routeFinder";

// ---------------------------------------------------------------------------
// TransportCard
// One card component with two looks:
//
//   variant="direct"  ->  a card for ONE direct vehicle
//       props: leg, travelDate, tags
//
//   variant="route"   ->  an alternative route with several vehicles. The header
//                         is a summary; opening it shows the full timeline.
//       props: route, index, highlight, travelDate, isOpen, onToggle, elementId
//
// Veyora colours: Navy #142B45, Blue #2563EB, Teal #14B8A6, Light #F8FAFC, White.
// All times are "absolute minutes from midnight of the travel date" (see routeFinder.js).
// ---------------------------------------------------------------------------

const TYPE_ICONS = {
  Bus,
  Train: TrainFront,
  Taxi: CarTaxiFront,
  Car,
  "Share Auto": Car,
};

const isOnDemand = (option) => ON_DEMAND_TYPES.includes(option.type);

// 1470 -> "00:30, 11 Nov 2026"
const describeMoment = (minutes, travelDate) =>
  travelDate
    ? `${formatClock(minutes)}, ${formatDate(travelDate, getDayOffset(minutes))}`
    : formatClock(minutes);

// "Leaves 45m after your selected time"
const describeLeavesIn = (waitBefore) =>
  waitBefore === 0
    ? "Leaves right at your selected time"
    : `Leaves ${formatDuration(waitBefore)} after your selected time`;

// ------------------------------ Small pieces -------------------------------

const PILL_TONES = {
  teal: "bg-[#14B8A6]/15 text-[#142B45]",
  navy: "bg-[#142B45] text-white",
  blue: "bg-[#2563EB]/10 text-[#2563EB]",
  slate: "bg-slate-100 text-slate-600",
  amber: "bg-amber-100 text-amber-800",
};

const Pill = ({ tone = "slate", children }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${PILL_TONES[tone]}`}
  >
    {children}
  </span>
);

// Highlight labels such as "Cheapest" or "Best balance"
const HighlightPill = ({ label }) => (
  <Pill tone={label === "Best balance" ? "teal" : "blue"}>
    {label === "Best balance" && <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />}
    {label}
  </Pill>
);

const TypeIcon = ({ type, size = "lg" }) => {
  const Icon = TYPE_ICONS[type] ?? Bus;
  const box = size === "lg" ? "h-11 w-11 rounded-xl" : "h-7 w-7 rounded-full";
  const icon = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";

  return (
    <span className={`flex shrink-0 items-center justify-center bg-[#142B45] ${box}`}>
      <Icon className={`${icon} text-[#14B8A6]`} aria-hidden="true" />
    </span>
  );
};

// What kind of service this is, and a clear reminder that it is sample data
const AvailabilityPills = ({ option }) => (
  <div className="flex flex-wrap gap-2">
    {isOnDemand(option) ? (
      <Pill tone="teal">
        <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
        On-demand · sample availability marked reliable
      </Pill>
    ) : (
      <Pill tone="slate">Scheduled service · runs daily (sample)</Pill>
    )}
    <Pill tone="slate">Sample data, not live</Pill>
  </div>
);

// A big time with the place and date underneath
const Endpoint = ({ minutes, place, travelDate, align = "left" }) => {
  const dayOffset = getDayOffset(minutes);

  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <p className="text-2xl font-bold text-[#142B45] sm:text-3xl">{formatClock(minutes)}</p>
      <p className="mt-1 break-words font-medium text-[#142B45]">{place}</p>
      <p className="text-xs text-slate-500">
        {travelDate && formatDate(travelDate, dayOffset)}
        {dayOffset > 0 && (
          <span className="ml-1.5 rounded bg-[#142B45] px-1.5 py-0.5 text-[10px] font-semibold text-white">
            +{dayOffset} day
          </span>
        )}
      </p>
    </div>
  );
};

const Stat = ({ label, value, sub, strong = false }) => (
  <div className="rounded-xl bg-[#F8FAFC] px-3 py-2">
    <dt className="text-xs text-slate-500">{label}</dt>
    <dd className={`font-bold text-[#142B45] ${strong ? "text-xl" : "text-lg"}`}>{value}</dd>
    {sub && <p className="text-xs text-slate-500">{sub}</p>}
  </div>
);

// ------------------------------ Direct card --------------------------------

const DirectCard = ({ leg, travelDate, tags = [] }) => {
  const { option } = leg;
  const Icon = TYPE_ICONS[option.type] ?? Bus;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <TypeIcon type={option.type} />
          <div>
            <h3 className="font-bold text-[#142B45]">{option.name || option.type}</h3>
            <p className="text-sm text-slate-500">{option.type}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <HighlightPill key={tag} label={tag} />
          ))}
          <Pill tone="navy">Direct</Pill>
        </div>
      </header>

      {/* Departure ---- duration ----> Arrival */}
      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
        <Endpoint minutes={leg.departure} place={option.from} travelDate={travelDate} />

        <div className="flex min-w-[64px] flex-col items-center gap-1 sm:min-w-[150px]">
          <span className="text-xs font-semibold text-slate-600">
            {formatDuration(leg.duration)}
          </span>
          <div className="flex w-full items-center gap-1" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-[#14B8A6]" />
            <span className="h-0.5 flex-1 rounded bg-slate-200" />
            <Icon className="h-4 w-4 text-[#142B45]" />
            <span className="h-0.5 flex-1 rounded bg-slate-200" />
            <span className="h-2 w-2 rounded-full bg-[#142B45]" />
          </div>
          <span className="text-xs text-slate-500">Non-stop</span>
        </div>

        <Endpoint
          minutes={leg.arrival}
          place={option.to}
          travelDate={travelDate}
          align="right"
        />
      </div>

      <footer className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-slate-100 pt-4">
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <Clock className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            {describeLeavesIn(leg.waitBefore)}
          </p>
          <AvailabilityPills option={option} />
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-slate-500">Fare</p>
          <p className="text-3xl font-bold text-[#142B45]">₹{option.fare}</p>
        </div>
      </footer>
    </article>
  );
};

// ----------------------- Alternative route: timeline -----------------------

// One row of the vertical timeline. `dot` is what sits on the line.
const TimelineItem = ({ dot, isLast = false, children }) => (
  <li className="relative pb-5 pl-11 last:pb-0">
    {!isLast && (
      <span className="absolute bottom-0 left-[13px] top-7 w-0.5 bg-slate-200" aria-hidden="true" />
    )}
    <span className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center">{dot}</span>
    {children}
  </li>
);

const StopDot = ({ role }) => (
  <span
    className={`h-4 w-4 rounded-full border-4 ${
      role === "end"
        ? "border-[#142B45] bg-white"
        : role === "start"
          ? "border-[#14B8A6] bg-white"
          : "border-[#2563EB] bg-white"
    }`}
  />
);

const ROLE_LABELS = {
  start: "Start",
  transfer: "Change vehicles",
  end: "Destination",
};

// A place on the route: the start, a transfer point or the destination
const StopItem = ({ place, role, arrival, departure, waitBefore, travelDate, isLast }) => (
  <TimelineItem dot={<StopDot role={role} />} isLast={isLast}>
    <p className="font-bold text-[#142B45]">
      {place}
      <span className="ml-2 text-xs font-medium text-slate-500">{ROLE_LABELS[role]}</span>
    </p>

    <div className="mt-1 text-sm text-slate-600">
      {arrival !== undefined && <p>Arrive {describeMoment(arrival, travelDate)}</p>}
      {departure !== undefined && <p>Depart {describeMoment(departure, travelDate)}</p>}
    </div>

    {role === "start" && waitBefore !== undefined && (
      <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-500">
        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
        {describeLeavesIn(waitBefore)}
      </p>
    )}

    {role === "transfer" && (
      <div className="mt-2 flex flex-wrap gap-2">
        <Pill tone="teal">
          <Hourglass className="h-3.5 w-3.5" aria-hidden="true" />
          Transfer wait {formatDuration(waitBefore)} · checked (min {SEARCH_RULES.minTransferMinutes}m)
        </Pill>

        {waitBefore < SHORT_TRANSFER_MINUTES && (
          <Pill tone="amber">
            <TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" />
            Short transfer, be ready to board
          </Pill>
        )}
      </div>
    )}
  </TimelineItem>
);

// One vehicle ride between two places
const LegItem = ({ leg }) => {
  const { option } = leg;

  return (
    <TimelineItem dot={<TypeIcon type={option.type} size="sm" />}>
      <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-[#142B45]">{option.name || option.type}</p>
            <p className="text-sm text-slate-500">
              {option.type} · {formatDuration(leg.duration)}
            </p>
          </div>
          <p className="text-lg font-bold text-[#142B45]">₹{option.fare}</p>
        </div>

        <p className="mt-2 text-sm text-slate-600">
          {formatClock(leg.departure)} {option.from}
          <ArrowRight className="mx-1.5 inline h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          {formatClock(leg.arrival)} {option.to}
        </p>

        <div className="mt-3">
          <AvailabilityPills option={option} />
        </div>
      </div>
    </TimelineItem>
  );
};

const Total = ({ label, value, detail }) => (
  <div className="rounded-xl bg-[#F8FAFC] p-4">
    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
    <p className="text-2xl font-bold text-[#142B45]">{value}</p>
    <p className="mt-1 text-xs text-slate-500">{detail}</p>
  </div>
);

// ----------------------------- Route card ----------------------------------

const RouteCard = ({ route, index, highlight, travelDate, isOpen, onToggle, elementId }) => {
  const places = getRoutePlaces(route);
  const panelId = `${elementId}-details`;
  const lastLeg = route.legs[route.legs.length - 1];

  return (
    <article
      id={elementId}
      className={`scroll-mt-24 overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-200 hover:shadow-md ${
        index === 0 ? "border-[#14B8A6]" : "border-slate-200"
      }`}
    >
      {/* Summary: always visible, click to open or close the details */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-start gap-4 p-5 text-left transition hover:bg-[#F8FAFC] sm:p-6"
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold ${
            index === 0 ? "bg-[#14B8A6] text-[#142B45]" : "bg-[#142B45] text-white"
          }`}
        >
          {index + 1}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-[#142B45]">Route {index + 1}</h3>
            {highlight.badges.map((badge) => (
              <HighlightPill key={badge} label={badge} />
            ))}
          </div>

          <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 font-semibold text-[#142B45]">
            {places.map((place, placeIndex) => (
              <Fragment key={`${place}-${placeIndex}`}>
                <span>{place}</span>
                {placeIndex < places.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                )}
              </Fragment>
            ))}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {route.legs.map((leg) => leg.option.type).join(" + ")}
          </p>

          <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Total fare" value={`₹${route.totalFare}`} strong />
            <Stat label="Journey time" value={formatDuration(route.totalDuration)} />
            <Stat
              label="Transfers"
              value={route.transfers}
              sub={`${formatDuration(route.totalWaiting)} waiting`}
            />
            <Stat
              label="Arrives"
              value={formatClock(route.arrival)}
              sub={travelDate ? formatDate(travelDate, getDayOffset(route.arrival)) : undefined}
            />
          </dl>
        </div>

        <ChevronDown
          className={`mt-2 h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div id={panelId} className="border-t border-slate-100 p-5 sm:p-6">
          {/* Why is this route suggested? */}
          <div className="rounded-xl bg-[#F8FAFC] p-4">
            <p className="flex items-center gap-2 font-semibold text-[#142B45]">
              <Info className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
              Why this route is suggested
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {highlight.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>

          {/* Timeline: stop, ride, stop, ride, ..., destination */}
          <ol className="mt-6">
            {route.legs.map((leg, legIndex) => (
              <Fragment key={leg.option.id}>
                <StopItem
                  place={leg.option.from}
                  role={legIndex === 0 ? "start" : "transfer"}
                  arrival={legIndex === 0 ? undefined : route.legs[legIndex - 1].arrival}
                  departure={leg.departure}
                  waitBefore={leg.waitBefore}
                  travelDate={travelDate}
                />
                <LegItem leg={leg} />
              </Fragment>
            ))}

            <StopItem
              place={lastLeg.option.to}
              role="end"
              arrival={lastLeg.arrival}
              travelDate={travelDate}
              isLast
            />
          </ol>

          {/* Totals, with the working shown */}
          <div className="mt-6 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">
            <Total
              label="Total estimated fare"
              value={`₹${route.totalFare}`}
              detail={route.legs.map((leg) => `₹${leg.option.fare}`).join(" + ")}
            />
            <Total
              label="Total journey time"
              value={formatDuration(route.totalDuration)}
              detail={`Riding ${formatDuration(getTotalRidingTime(route))} + waiting ${formatDuration(
                route.totalWaiting
              )} (first departure to arrival)`}
            />
            <Total
              label="Transfers"
              value={route.transfers}
              detail={`Change at ${places.slice(1, -1).join(", ")}`}
            />
          </div>
        </div>
      )}
    </article>
  );
};

// --------------------------------- Export ----------------------------------

const TransportCard = ({ variant = "direct", ...props }) =>
  variant === "route" ? <RouteCard {...props} /> : <DirectCard {...props} />;

export default TransportCard;
