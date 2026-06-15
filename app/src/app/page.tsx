import { redirect } from "next/navigation";

// Das Dashboard ist der Startbildschirm nach dem Login. Die Wurzel-Route leitet
// dorthin um; nicht angemeldete Nutzer fängt vorher die proxy.ts-Middleware ab
// und schickt sie auf /login.
export default function Home() {
  redirect("/dashboard");
}
