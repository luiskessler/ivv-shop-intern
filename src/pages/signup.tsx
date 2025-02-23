import Link from "next/link";
import React from "react";
import Navbar from "~/components/navbar";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

const registerSchema = z.object({
  name: z.string().min(1, "Bitte Name ausfüllen."),
  surname: z.string().min(1, "Bitte Nachnamen ausfüllen."),
  email: z.string().email("E-Mail ist ungültig.").includes("@ivv.de"),
  password: z.string().min(6, "Passwort muss mindestens 6 Zeichen lang sein."),
});

type RegisterSchemaType = z.infer<typeof registerSchema>;

export default function Home() {
  const router = useRouter();

  const registerUser = api.auth.registerUser.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegisterUser = async (data: RegisterSchemaType) => {
    const res = await registerUser.mutateAsync(data);

    if (res.code === 201) {
      router.push("/");
    }
  };

  return (
    <div className="flex h-screen flex-col space-y-[10vh] border py-[6vh]">
      <Navbar />
      <div className="container flex h-full flex-col items-center justify-center gap-2 space-y-[10vh] border md:w-[95%]">
        <div className="flex h-fit w-1/3 flex-col items-center justify-center gap-8 rounded-md">
          <form
            onSubmit={handleSubmit(handleRegisterUser)}
            className="flex w-full flex-col gap-2"
          >
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="Name"
                {...register("name")}
                className="h-10 rounded-md border px-2"
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="Nachname"
                {...register("surname")}
                className="h-10 rounded-md border px-2"
              />
              {errors.surname && (
                <p className="text-red-500">{errors.surname.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <input
                type="email"
                placeholder="E-Mail"
                {...register("email")}
                className="h-10 rounded-md border px-2"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <input
                type="password"
                placeholder="Passwort"
                {...register("password")}
                className="h-10 rounded-md border px-2"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
            <button type="submit" className="h-10 rounded-full border px-4">
              Registrieren
            </button>
          </form>
          <p>
            Schon einen Account?{" "}
            <Link className="underline" href="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
