import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AuthField } from "../components/AuthField";
import { C } from "../shared/colors";

export function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    console.log({
      username,
      email,
      password,
    });

    // TODO:
    //
    // await registerUser({
    //   username,
    //   email,
    //   password,
    // });
    //
    // navigate("/login");
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
              Create your
              <br />
              account.
            </h1>

            <p
              className="text-sm"
              style={{
                color: C.textMuted,
              }}
            >
              Join Outlift and start training outdoors.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <AuthField
              label="Username"
              value={username}
              onChange={setUsername}
              placeholder="alexrivera"
            />

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
              placeholder="At least 8 characters"
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

            <AuthField
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Repeat password"
            />

            <button
              type="submit"
              className="mb-4 mt-2 w-full rounded-2xl py-4 text-sm font-semibold transition active:scale-[0.98]"
              style={{
                background: C.forest,
                color: "white",
              }}
            >
              Create Account
            </button>
          </form>

          <p
            className="mb-5 mt-3 text-center text-sm"
            style={{ color: C.textMuted }}
          >
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold"
              style={{ color: C.forest }}
            >
              Log in
            </button>
          </p>

          <p
            className="pb-8 text-center text-xs"
            style={{
              color: C.textMuted,
            }}
          >
            By registering you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </main>
  );
}
