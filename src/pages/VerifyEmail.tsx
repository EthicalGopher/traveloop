import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { api } from "../utils/api";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        return;
      }

      try {
        const response = await api(`/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(response.message);
      } catch (err: unknown) {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "An error occurred");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-surface-container-lowest p-10 rounded-2xl ambient-shadow w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          {status === "loading" && <Loader2 className="animate-spin text-primary" size={48} />}
          {status === "success" && <CheckCircle className="text-green-500" size={48} />}
          {status === "error" && <XCircle className="text-red-500" size={48} />}
        </div>

        <h1 className="text-2xl font-black text-on-surface uppercase italic font-display">
          Email Verification
        </h1>

        <p className="text-on-surface-variant font-medium">
          {status === "loading" ? "Verifying your email address..." : message}
        </p>

        {status !== "loading" && (
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-primary text-white font-bold py-4 rounded-full hover:shadow-lg transition-all cursor-pointer"
          >
            Back to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
