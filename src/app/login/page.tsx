"use client";

import { Button } from "@/components/ui-elements/button";
import InputGroup from "@/components/FormElements/InputGroup";
import { authService } from "@/services/auth";
import { useState } from "react";

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await authService.sendOtp({ phone: phoneNumber });

      if (result.success) {
        setStep("otp");
      } else {
        setError(result.message || "خطا در ارسال کد");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await authService.verifyOtp({
        phone: phoneNumber,
        otp_code: otpCode,
      });

      if (result.success) {
        // Redirect to panel
        window.location.href = "/panel";
      } else {
        setError(result.message || "کد تأیید نادرست است");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await authService.sendOtp({ phone: phoneNumber });

      if (result.success) {
        alert("کد مجدداً ارسال شد");
      } else {
        setError(result.message || "خطا در ارسال مجدد کد");
      }
    } catch (err) {
      console.error("Error resending OTP:", err);
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-2 dark:bg-[#020d1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark dark:text-white mb-2">
            <span className="text-primary">D</span>esk<span className="text-primary">S</span>hops
          </h1>
          <p className="text-body-color dark:text-dark-6">
            ورود به پنل مدیریت
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-dark dark:text-white mb-2">
                  ورود با شماره موبایل
                </h2>
                <p className="text-sm text-body-color dark:text-dark-6">
                  شماره موبایل خود را وارد کنید
                </p>
              </div>

              <InputGroup
                label="شماره موبایل"
                type="tel"
                placeholder="09123456789"
                required
                value={phoneNumber}
                handleChange={(e) => setPhoneNumber(e.target.value)}
                name="phone"
              />

              {error && (
                <div className="text-red text-sm text-center p-3 bg-red-light-6 dark:bg-red/10 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                label={loading ? "در حال ارسال..." : "ارسال کد تأیید"}
                variant="primary"
                shape="rounded"
                className="w-full"
                disabled={loading || !phoneNumber}
                type="submit"
              />
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-dark dark:text-white mb-2">
                  کد تأیید
                </h2>
                <p className="text-sm text-body-color dark:text-dark-6">
                  کد ۴ رقمی ارسال شده به شماره {phoneNumber} را وارد کنید
                </p>
              </div>

              <InputGroup
                label="کد تأیید"
                type="text"
                placeholder="1234"
                required
                value={otpCode}
                handleChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                name="otp"
                className="text-center"
              />

              {error && (
                <div className="text-red text-sm text-center p-3 bg-red-light-6 dark:bg-red/10 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <Button
                  label={loading ? "در حال تأیید..." : "تأیید و ورود"}
                  variant="primary"
                  shape="rounded"
                  className="w-full"
                  disabled={loading || otpCode.length !== 4}
                  type="submit"
                />

                <div className="text-center">
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={loading}
                    className="text-primary hover:underline text-sm disabled:opacity-50"
                  >
                    ارسال مجدد کد
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    className="text-body-color dark:text-dark-6 hover:text-dark dark:hover:text-white text-sm"
                  >
                    تغییر شماره موبایل
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-body-color dark:text-dark-6">
            © ۲۰۲۴ DeskShops. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </div>
  );
}
