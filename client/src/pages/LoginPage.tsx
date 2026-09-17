import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AuthField } from "../components/AuthField";
import { C } from "../shared/colors";
import { loginUser } from "../api/users";
import { useAuth } from "../contexts/useContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await loginUser({ email, password });
      login(response.user, response.token);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main
      className="min-h-dvh"
      style={{
        background: C.bg,
      }}
    >
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
        <header className="px-5 pb-6 pt-12">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              color: C.text,
            }}
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
        </header>

        <div className="flex-1 px-6">
          <div className="mb-8">
            <h1
              className="mb-2 text-3xl font-bold"
              style={{
                color: C.text,
                letterSpacing: "-0.8px",
              }}
            >
              Welcome
              <br />
              back.
            </h1>

            <p
              className="text-sm"
              style={{
                color: C.textMuted,
              }}
            >
              Log in to continue your outdoor training journey.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <AuthField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
            />

            <AuthField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={setPassword}
              placeholder="Your password"
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  style={{ color: C.textFaint }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            <div className="mb-6 flex justify-end">
              <button
                type="button"
                className="text-xs font-semibold"
                style={{
                  color: C.forest,
                }}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="mb-4 w-full rounded-2xl py-4 text-sm font-semibold transition active:scale-[0.98]"
              style={{
                background: C.forest,
                color: "white",
              }}
            >
              Log In
            </button>
          </form>

          <p
            className="mt-4 text-center text-sm"
            style={{ color: C.textMuted }}
          >
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-semibold"
              style={{ color: C.forest }}
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
