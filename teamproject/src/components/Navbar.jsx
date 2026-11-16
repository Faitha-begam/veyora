import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

// Veyora colours used here:
//   Deep Navy #142B45 (bar)   Blue #2563EB (buttons)   Teal #14B8A6 (highlights)

// The page links. To change a URL later, edit it here and nowhere else.
// (Login and Register use the same "/login" and "/register" paths as Register.jsx.)
const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Find Transport", to: "/find-transport" },
  { label: "Safe Places", to: "/safe-places" },
  { label: "Shared Rides", to: "/shared-rides" },
];

const Navbar = () => {
  // Is the mobile menu open?
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  // NavLink tells us if a link is the current page, so we can highlight it.
  // `end` on the Home link stops "/" from counting as active on every page.
  const getLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-white/10 text-[#14B8A6]"
        : "text-slate-200 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#142B45] shadow-md">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3"
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 text-white"
          aria-label="Veyora home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#14B8A6]">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="#142B45"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 5l7 14 7-14" />
            </svg>
          </span>
          <span className="text-xl font-bold tracking-wide">VEYORA</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={getLinkClass}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop account buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Register
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="rounded-lg p-2 text-white transition hover:bg-white/10 md:hidden"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-white/10 px-4 pb-4 pt-2 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={closeMenu}
                className={getLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/10 pt-3">
            <Link
              to="/login"
              onClick={closeMenu}
              className="rounded-lg border border-white/30 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={closeMenu}
              className="rounded-lg bg-[#2563EB] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
