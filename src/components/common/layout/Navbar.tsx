"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  X,
  Mail,
  Menu,
  Phone,
  UserRound,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const navItems = [
  { label: "Products", href: "/products", hasDropdown: true },
  { label: "Tools", href: "/tools", hasDropdown: true },
  { label: "About Us", href: "/about-us" },
  { label: "Blogs", href: "/blog" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Support", href: "/support" },
];

const underlineClass =
  "relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[#195585] after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { profile } = useCurrentUser();
  const loggedIn = Boolean(profile.raw);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5eef8] bg-white/95 backdrop-blur">
      <div className="bg-[#195585] px-4 md:px-6 lg:pl-8 lg:pr-10 text-white">
        <div className="mx-auto flex min-h-9 max-w-9xl items-center justify-center gap-4 py-2 text-center text-[11px] font-semibold sm:justify-between sm:text-left">
          <p className="flex items-center justify-center gap-2 leading-4">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#7ee3a2]" />
            Compare offers from regulated banks, NBFCs and insurers with secure
            assisted applications.
          </p>
          <div className="hidden items-center gap-5 lg:flex">
            <a
              href="tel:+918448282679"
              className="flex items-center gap-1.5 text-white/90 no-underline transition hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" />
              +91 84482 82679
            </a>
            <a
              href="mailto:support@fintaraa.com"
              className="flex items-center gap-1.5 text-white/90 no-underline transition hover:text-white"
            >
              <Mail className="h-3.5 w-3.5" />
              support@fintaraa.com
            </a>
          </div>
        </div>
      </div>

      <nav className="mx-auto flex h-18 max-w-9xl items-center justify-between gap-5 px-4 md:px-6 lg:px-8">
        <Link href="/" aria-label="Fintaraa home" className="shrink-0">
          <Image
            priority
            width={134}
            height={41}
            alt="Fintaraa"
            className="h-auto w-18"
            src="/assets/logo/logo.png"
          />
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`${underlineClass} flex items-center gap-1 text-base font-semibold no-underline transition ${
                  active
                    ? "text-[#195585] after:scale-x-100"
                    : "text-[#101828] hover:text-[#195585]"
                }`}
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="h-3.5 w-3.5" />}
              </Link>
            );
          })}
        </div>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <a
            href="tel:+918448282679"
            className="flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-[#101828] no-underline"
          >
            <Phone className="h-4 w-4 text-[#195585]" />
            +91 84482 82679
          </a>
          <Link
            href="/app"
            className="inline-flex h-10 items-center rounded-full bg-[#12b76a] px-4 text-sm font-medium text-white no-underline shadow-[0_8px_18px_rgba(18,183,106,0.22)]"
          >
            Download App
          </Link>
          <AuthButton
            loggedIn={loggedIn}
            name={profile.name}
            avatar={profile.avatar}
          />
        </div>

        <button
          aria-label="Toggle menu"
          className="rounded-md border border-[#d0d5dd] p-2 text-[#101828] lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-[#e5eef8] bg-white px-4 md:px-6 lg:px-8 shadow-lg lg:hidden">
          <div className="mx-auto grid max-w-9xl gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`${underlineClass} flex items-center justify-between rounded-md px-3 py-3 text-[14px] font-black text-[#101828] no-underline hover:text-[#195585]`}
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
              </Link>
            ))}
            <div className="mt-4 grid gap-3 border-t border-[#e5eef8] pt-4">
              <Link
                href="/app"
                onClick={() => setMenuOpen(false)}
                className="rounded-full bg-[#12b76a] px-4 py-3 text-center text-[13px] font-black text-white no-underline"
              >
                Download App
              </Link>
              <AuthButton
                loggedIn={loggedIn}
                name={profile.name}
                avatar={profile.avatar}
                mobile
                onClick={() => setMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function AuthButton({
  loggedIn,
  name,
  avatar,
  mobile = false,
  onClick,
}: {
  loggedIn: boolean;
  name: string;
  avatar?: string;
  mobile?: boolean;
  onClick?: () => void;
}) {
  if (!loggedIn) {
    return (
      <Link
        href="/login"
        onClick={onClick}
        className={
          mobile
            ? "rounded-full border border-[#12b76a] px-4 py-3 text-center text-[13px] font-black text-[#0f5132] no-underline"
            : "inline-flex h-10 items-center gap-2 rounded-full border border-[#12b76a] px-4 text-sm font-medium text-[#0f5132] no-underline"
        }
      >
        <span className="inline-flex items-center justify-center gap-2">
          <UserRound className="h-4 w-4" />
          Login / Register
        </span>
      </Link>
    );
  }

  const firstName = name.split(" ")[0] || "User";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link
      href="/account/profile"
      onClick={onClick}
      className={
        mobile
          ? "flex items-center justify-center gap-3 rounded-full bg-[#eef8ff] px-4 py-3 text-center text-[13px] font-black text-[#195585] no-underline"
          : "inline-flex h-10 items-center gap-2 rounded-full bg-[#eef8ff] pl-1.5 pr-4 text-sm font-black text-[#195585] no-underline ring-1 ring-[#d5ebfb]"
      }
      aria-label={`Open account profile for ${name}`}
    >
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#195585] to-[#12b76a] text-[11px] font-black text-white">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt={name} className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </span>
      <span className="max-w-36 truncate">Hi, {firstName}</span>
    </Link>
  );
}
