import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Navbar from "~/components/navbar";
import { api } from "~/utils/api";

export default function Home() {
  const router = useRouter();
  const loginUser = api.auth.loginUser.useMutation();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [surname, setSurname] = React.useState("");

  const handleUserLogin = async () => {
    const res = await loginUser.mutateAsync({
      email: email,
      password: password,
    });

    if (res.code === 201) {
      router.push("/");
    }
  };

  return (
    <div className="flex h-screen flex-col space-y-[10vh] border py-[6vh]">
      <Navbar />
      <div className="container flex h-full flex-col items-center justify-center gap-2 space-y-[10vh] border md:w-[95%]">
        <div className="flex h-fit w-1/3 flex-col items-center justify-center gap-8 rounded-md">
          <div className="flex w-full flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="sr-only">
                E-Mail
              </label>
              <input
                type="email"
                name="email"
                placeholder="E-Mail"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="h-10 rounded-md border px-2"
                id="email"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="sr-only">
                Passwort
              </label>
              <input
                type="password"
                name="password"
                placeholder="Passwort"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="h-10 rounded-md border px-2"
                id="password"
              />
            </div>
          </div>
          <button
            onClick={() => handleUserLogin()}
            className="h-10 rounded-full border px-4"
          >
            Login
          </button>
          <p>
            Kein Account?{" "}
            <Link className="underline" href="/signup">
              Registrieren
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
