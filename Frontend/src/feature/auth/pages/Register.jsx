import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../hook/UseAuth";
import { useNavigate } from "react-router";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const {registerUser} = useAuth()
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const passwordStrength = useMemo(() => {
    const score = [
      formData.password.length >= 8,
      /[A-Z]/.test(formData.password),
      /[0-9]/.test(formData.password),
      /[^A-Za-z0-9]/.test(formData.password),
    ].filter(Boolean).length;

    if (!formData.password) {
      return {
        label: "Add a stronger password",
        width: "w-0",
        tone: "bg-slate-700",
        text: "text-slate-500",
      };
    }

    if (score <= 1) {
      return {
        label: "Weak password",
        width: "w-1/4",
        tone: "bg-rose-400",
        text: "text-rose-300",
      };
    }

    if (score <= 3) {
      return {
        label: "Good password",
        width: "w-3/4",
        tone: "bg-amber-400",
        text: "text-amber-300",
      };
    }

    return {
      label: "Strong password",
      width: "w-full",
      tone: "bg-emerald-400",
      text: "text-emerald-300",
    };
  }, [formData.password]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    try {
      await registerUser(formData.username , formData.email, formData.password);
      navigate("/login", {
        state: {
          message: "Account created successfully. Please login to continue.",
        },
      });
    } catch (error) {
      console.error("register failed:", error);
      setSubmitError(error?.message || "Unable to register.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0d14] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-5%] h-72 w-72 rounded-full bg-violet-600/14 blur-3xl" />
        <div className="absolute bottom-[-8%] right-[-6%] h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.14),_transparent_30%),linear-gradient(180deg,_rgba(15,23,42,0.12),_rgba(11,13,20,0.96))]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="w-full max-w-md rounded-[30px] border border-white/10 bg-[#11141d]/95 p-7 shadow-[0_30px_90px_rgba(3,7,18,0.55)] backdrop-blur sm:p-9">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/10 shadow-[0_12px_40px_rgba(124,58,237,0.18)]">
              <svg
                aria-hidden="true"
                className="h-5 w-5 text-violet-300"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M8 10.5h8M8 14h4M7.8 19 4 20V7.2A2.2 2.2 0 0 1 6.2 5h11.6A2.2 2.2 0 0 1 20 7.2v8.6a2.2 2.2 0 0 1-2.2 2.2H7.8Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </div>

            <div>
              <p className="text-lg font-semibold text-white">TalkAI</p>
              <p className="text-sm text-slate-400">Create your account to get started</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-white">Register</h1>
              <p className="text-sm leading-6 text-slate-400">
                Set up your account with a clean, focused onboarding form.
              </p>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-200">Username</span>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center">
                  <svg
                    aria-hidden="true"
                    className="h-4.5 w-4.5 text-slate-500"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 12a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5ZM5 19.5a7 7 0 0 1 14 0"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                </span>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  autoComplete="username"
                  className="h-13 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-slate-100 outline-none transition duration-200 placeholder:text-slate-500 hover:border-violet-400/30 focus:border-violet-400/60 focus:ring-4 focus:ring-violet-500/10"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-200">Email</span>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center">
                  <svg
                    aria-hidden="true"
                    className="h-4.5 w-4.5 text-slate-500"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4.5 6.75h15A1.5 1.5 0 0 1 21 8.25v7.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 15.75v-7.5a1.5 1.5 0 0 1 1.5-1.5Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="m4 7 8 6 8-6"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                </span>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="h-13 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-slate-100 outline-none transition duration-200 placeholder:text-slate-500 hover:border-violet-400/30 focus:border-violet-400/60 focus:ring-4 focus:ring-violet-500/10"
                />
              </div>
            </label>

            <div className="space-y-3">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">Password</span>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center">
                    <svg
                      aria-hidden="true"
                      className="h-4.5 w-4.5 text-slate-500"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M8.75 10V8.25a3.25 3.25 0 1 1 6.5 0V10M7.75 10h8.5A1.75 1.75 0 0 1 18 11.75v6.5A1.75 1.75 0 0 1 16.25 20h-8.5A1.75 1.75 0 0 1 6 18.25v-6.5A1.75 1.75 0 0 1 7.75 10Z"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                      />
                    </svg>
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="h-13 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-12 text-sm text-slate-100 outline-none transition duration-200 placeholder:text-slate-500 hover:border-violet-400/30 focus:border-violet-400/60 focus:ring-4 focus:ring-violet-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 transition hover:text-violet-200"
                  >
                    <svg
                      aria-hidden="true"
                      className="h-4.5 w-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      {showPassword ? (
                        <>
                          <path
                            d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                          />
                          <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
                        </>
                      ) : (
                        <>
                          <path
                            d="M4.5 4.5 19.5 19.5"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="1.8"
                          />
                          <path
                            d="M9.9 6.5A9.8 9.8 0 0 1 12 6c5.5 0 9 6 9 6a17 17 0 0 1-3.2 3.9M14.8 14.9A3 3 0 0 1 9.2 9.3M6.3 9A16.8 16.8 0 0 0 3 12s3.5 6 9 6c1.1 0 2.2-.2 3.1-.5"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                          />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </label>

              <div className="space-y-2">
                <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${passwordStrength.width} ${passwordStrength.tone}`}
                  />
                </div>
                <p className={`text-xs ${passwordStrength.text}`}>{passwordStrength.label}</p>
              </div>
            </div>

            {submitError && (
              <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4">
                <p className="text-sm font-medium text-rose-300">{submitError}</p>
              </div>
            )}

            <button
              type="submit"
              className="h-13 w-full rounded-2xl bg-[linear-gradient(135deg,#7c3aed,#5b4df5)] text-sm font-semibold text-white shadow-[0_18px_36px_rgba(91,77,245,0.26)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(91,77,245,0.32)] active:translate-y-0"
            >
              Create Account
            </button>

            <p className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-violet-300 transition hover:text-violet-200"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
