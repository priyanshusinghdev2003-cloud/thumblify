import { MenuIcon, User2Icon, XIcon } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { navlinks } from "../data/navlinks";
import type { INavLink } from "../types";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <>
      <motion.nav
        className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
      >
        <Link to="/">
          <img
            className="h-8.5 w-auto"
            src="/logo.svg"
            alt="logo"
            width={130}
            height={34}
          />
        </Link>

        <div className="hidden md:flex items-center gap-8 transition duration-500">
          {navlinks.map((link: INavLink) => (
            <Link
              key={link.name}
              to={link.href}
              className="hover:text-pink-500 transition"
            >
              {link.name}
            </Link>
          ))}
          {isLoggedIn ? (
            <Link
              to={"/my-generations"}
              className="hover:text-pink-500 transition"
            >
              My Generations
            </Link>
          ) : (
            <Link to={"/about"} className="hover:text-pink-500 transition">
              About
            </Link>
          )}
          <NavLink
            key={"contact"}
            to={"/#contact"}
            className="hover:text-pink-500 transition"
          >
            Contact
          </NavLink>
        </div>
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="relative group">
              <button className="rounded-full size-8 bg-white/20 border-2 border-white/10 hover:bg-white/40 transition">
                {user?.name.charAt(0).toUpperCase()}
              </button>
              <div className="absolute hidden group-hover:block top-6 right-0 pt-4">
                <button
                  className="bg-white/20 border-2 border-white/10 px-5 py-1.5 rounded"
                  onClick={() => logout()}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden md:block px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full"
            >
              Get Started
            </button>
          )}
          <button onClick={() => setIsOpen(true)} className="md:hidden">
            <MenuIcon size={26} className="active:scale-90 transition" />
          </button>
        </div>
      </motion.nav>

      <div
        className={`fixed inset-0 z-100 bg-black/40 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-400 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navlinks.map((link: INavLink) => (
          <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)}>
            {link.name}
          </Link>
        ))}
        {isLoggedIn ? (
          <Link to={"/my-generations"} onClick={() => setIsOpen(false)}>
            My Generations
          </Link>
        ) : (
          <Link to={"/about"} onClick={() => setIsOpen(false)}>
            About
          </Link>
        )}
        <NavLink
          key={"contact"}
          to={"#contact"}
          onClick={() => setIsOpen(false)}
        >
          Contact
        </NavLink>
        {isLoggedIn ? (
          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
          >
            Logout
          </button>
        ) : (
          <Link to={"/login"} onClick={() => setIsOpen(false)}>
            Login
          </Link>
        )}
        <button
          onClick={() => setIsOpen(false)}
          className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-pink-600 hover:bg-pink-700 transition text-white rounded-md flex"
        >
          <XIcon />
        </button>
      </div>
    </>
  );
}
