
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartPulse, ShieldCheck } from "lucide-react";

import {
  Button,
  Input,
  Notice,
  Select,
} from "../components/UI";

import { API_URL } from "../services/api";


// ============================================================
// LOGIN
// ============================================================

export function Login() {

  const nav = useNavigate();

  const [f, setF] = useState({
    email: "",
    password: "",
  });

  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);


  async function submit(e) {

    e.preventDefault();

    setErr("");
    setBusy(true);

    try {

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify(f),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          data.error ||
          "Invalid email or password."
        );
      }


      // The backend has now created the
      // HttpOnly JWT cookie.

      nav("/dashboard");


    } catch (e) {

      setErr(
        e.message ||
        "Invalid email or password."
      );

    } finally {

      setBusy(false);
    }
  }


  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue to Medinexus"
    >

      <form
        onSubmit={submit}
        className="space-y-4"
      >

        {err && (
          <Notice>
            {err}
          </Notice>
        )}


        <Input
          label="Email"
          type="email"
          required
          value={f.email}
          onChange={(e) =>
            setF({
              ...f,
              email: e.target.value,
            })
          }
        />


        <Input
          label="Password"
          type="password"
          required
          value={f.password}
          onChange={(e) =>
            setF({
              ...f,
              password: e.target.value,
            })
          }
        />


        <Button
          type="submit"
          className="w-full"
          disabled={busy}
        >
          {busy
            ? "Signing in…"
            : "Sign in"}
        </Button>

      </form>


      <p className="mt-6 text-center text-sm text-slate-500">

        New to Medinexus?{" "}

        <Link
          className="font-semibold text-med-700"
          to="/register"
        >
          Create account
        </Link>

      </p>

    </AuthShell>
  );
}



// ============================================================
// REGISTER
// ============================================================

export function Register() {

  const nav = useNavigate();

  const [f, setF] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "PATIENT",
  });

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);


  async function submit(e) {

    e.preventDefault();

    setErr("");
    setMsg("");
    setBusy(true);

    try {

      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(f),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          data.error ||
          "Registration failed."
        );
      }


      setMsg(
        "Account created. You can now sign in."
      );


      setTimeout(() => {
        nav("/login");
      }, 900);


    } catch (e) {

      setErr(
        e.message ||
        "Registration failed."
      );

    } finally {

      setBusy(false);
    }
  }


  return (
    <AuthShell
      title="Create your account"
      subtitle="Choose the role that matches how you use Medinexus"
    >

      <form
        onSubmit={submit}
        className="grid gap-4 sm:grid-cols-2"
      >

        {err && (
          <div className="sm:col-span-2">
            <Notice>
              {err}
            </Notice>
          </div>
        )}


        {msg && (
          <div className="sm:col-span-2">
            <Notice type="success">
              {msg}
            </Notice>
          </div>
        )}


        <Input
          label="Full name"
          required
          value={f.name}
          onChange={(e) =>
            setF({
              ...f,
              name: e.target.value,
            })
          }
        />


        <Input
          label="Phone"
          required
          value={f.phone}
          onChange={(e) =>
            setF({
              ...f,
              phone: e.target.value,
            })
          }
        />


        <Input
          label="Email"
          type="email"
          required
          value={f.email}
          onChange={(e) =>
            setF({
              ...f,
              email: e.target.value,
            })
          }
        />


        <Input
          label="Password"
          type="password"
          required
          minLength="6"
          value={f.password}
          onChange={(e) =>
            setF({
              ...f,
              password: e.target.value,
            })
          }
        />


        <Select
          label="Account type"
          value={f.role}
          onChange={(e) =>
            setF({
              ...f,
              role: e.target.value,
            })
          }
        >

          {[
            "PATIENT",
            "DOCTOR",
            "PHARMACY",
            
            "HOSPITAL",
          ].map((r) => (

            <option
              key={r}
              value={r}
            >
              {r}
            </option>

          ))}

        </Select>


        <div className="sm:self-end">

          <Button
            type="submit"
            disabled={busy}
          >
            {busy
              ? "Creating account…"
              : "Create account"}
          </Button>

        </div>

      </form>


      <p className="mt-6 text-center text-sm text-slate-500">

        Already registered?{" "}

        <Link
          className="font-semibold text-med-700"
          to="/login"
        >
          Sign in
        </Link>

      </p>

    </AuthShell>
  );
}



// ============================================================
// AUTH SHELL
// ============================================================

function AuthShell({
  title,
  subtitle,
  children,
}) {

  return (

    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-med-50 via-white to-sky-50 p-4">

      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid lg:grid-cols-5">


        <div className="hidden bg-med-700 p-10 text-white lg:col-span-2 lg:flex lg:flex-col lg:justify-between">

          <div>

            <div className="mb-10 flex items-center gap-3">

              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15">

                <HeartPulse />

              </div>

              <b className="text-xl">
                Medinexus
              </b>

            </div>


            <h2 className="text-3xl font-bold leading-tight">
              Healthcare, connected in one place.
            </h2>


            <p className="mt-4 text-sm leading-6 text-med-100">

              Find doctors, hospitals, blood services,
              medicines and trusted healthcare workflows.

            </p>

          </div>


          <div className="flex items-center gap-2 text-sm text-med-100">

            <ShieldCheck size={18} />

            Secure role-based access

          </div>

        </div>


        <div className="p-6 sm:p-10 lg:col-span-3">

          <h1 className="text-2xl font-bold">
            {title}
          </h1>


          <p className="mt-1 mb-7 text-sm text-slate-500">
            {subtitle}
          </p>


          {children}

        </div>

      </div>

    </div>
  );
}

