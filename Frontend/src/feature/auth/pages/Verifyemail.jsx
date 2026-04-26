import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/UseAuth";

const Verifyemail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resendVerificationEmail } = useAuth();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    const storedEmail =
      location.state?.email ||
      sessionStorage.getItem("registrationEmail") ||
      localStorage.getItem("registrationEmail");

    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [location.state?.email]);

  useEffect(() => {
    if (resendTimer <= 0) {
      setResendDisabled(false);
      return undefined;
    }

    const interval = setInterval(() => {
      setResendTimer((current) => current - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleVerify = async (event) => {
    event.preventDefault();
    setLocalError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setLocalError("Please enter the email address you registered with.");
      return;
    }

    if (!verificationCode.trim()) {
      setLocalError("Please enter the verification code from your email.");
      return;
    }

    if (verificationCode.trim().length < 4) {
      setLocalError("Verification code must be at least 4 characters.");
      return;
    }

    try {
      await verifyEmail(email.trim(), verificationCode.trim());
      setIsVerified(true);
      setSuccessMessage("Email verified successfully. You can now log in.");
      sessionStorage.removeItem("registrationEmail");
      localStorage.removeItem("registrationEmail");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setLocalError(err.message || "Verification failed. Please try again.");
    }
  };

  const handleResendEmail = async () => {
    setLocalError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setLocalError("Please enter your email address before resending the code.");
      return;
    }

    setResendLoading(true);

    try {
      await resendVerificationEmail(email.trim());
      setSuccessMessage("A new verification code has been sent to your email.");
      setResendDisabled(true);
      setResendTimer(60);
    } catch (err) {
      setLocalError(err.message || "Failed to resend verification code.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0d14] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.14),_transparent_34%),linear-gradient(180deg,_rgba(15,23,42,0.12),_rgba(11,13,20,0.96))]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="w-full max-w-md rounded-[30px] border border-white/10 bg-[#11141d]/95 p-7 shadow-[0_30px_90px_rgba(3,7,18,0.55)] backdrop-blur sm:p-9">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/10 shadow-[0_12px_40px_rgba(124,58,237,0.18)]">
              <svg aria-hidden="true" className="h-5 w-5 text-violet-300" fill="none" viewBox="0 0 24 24">
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
            </div>

            <div>
              <p className="text-lg font-semibold text-white">TalkAI</p>
              <p className="text-sm text-slate-400">Verify your email address</p>
            </div>
          </div>

          <div className="mb-8 space-y-3">
            <h1 className="text-3xl font-semibold text-white">
              {isVerified ? "Email verified" : "Check your email"}
            </h1>
            <p className="text-sm leading-6 text-slate-400">
              {isVerified
                ? "Your email address is verified. Use the button below if you are not redirected to login automatically."
                : "We sent a verification code to your email address. Enter it below to verify your account before logging in."}
            </p>
          </div>

          <div className="mb-6 rounded-2xl border border-violet-400/20 bg-violet-500/5 p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              Verification email
            </p>
            <p className="mb-3 break-all text-sm font-medium text-white">
              {email || "Enter the email address you registered with"}
            </p>

            {!isVerified && (
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-100 outline-none transition duration-200 placeholder:text-slate-500 hover:border-violet-400/30 focus:border-violet-400/60 focus:ring-4 focus:ring-violet-500/10"
                disabled={loading}
              />
            )}
          </div>

          {successMessage && (
            <div className="mb-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4">
              <p className="text-sm font-medium text-emerald-300">{successMessage}</p>
            </div>
          )}

          {(localError || error) && (
            <div className="mb-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4">
              <p className="text-sm font-medium text-rose-300">{localError || error}</p>
            </div>
          )}

          {!isVerified ? (
            <form onSubmit={handleVerify} className="space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">Verification code</span>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value)}
                  placeholder="Enter your 6-digit code"
                  className="h-13 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm uppercase tracking-widest text-slate-100 outline-none transition duration-200 placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-500 hover:border-violet-400/30 focus:border-violet-400/60 focus:ring-4 focus:ring-violet-500/10"
                  maxLength="6"
                  disabled={loading}
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="h-13 w-full rounded-2xl bg-[linear-gradient(135deg,#7c3aed,#5b4df5)] text-sm font-semibold text-white shadow-[0_18px_36px_rgba(91,77,245,0.26)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(91,77,245,0.32)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify email"}
              </button>

              <div className="border-t border-white/10 pt-5">
                <p className="mb-3 text-center text-sm text-slate-400">
                  Did not receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={resendLoading || resendDisabled}
                  className="h-12 w-full rounded-2xl border border-violet-400/30 bg-violet-500/10 text-sm font-semibold text-violet-300 transition duration-200 hover:border-violet-400/50 hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {resendLoading
                    ? "Sending..."
                    : resendDisabled
                      ? `Resend in ${resendTimer}s`
                      : "Resend code"}
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="h-13 w-full rounded-2xl bg-[linear-gradient(135deg,#7c3aed,#5b4df5)] text-sm font-semibold text-white shadow-[0_18px_36px_rgba(91,77,245,0.26)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(91,77,245,0.32)] active:translate-y-0"
            >
              Go to login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Verifyemail;
