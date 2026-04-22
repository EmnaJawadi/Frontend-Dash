import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("is_authenticated")?.value === "true";
  const role = cookieStore.get("user_role")?.value;

  if (!isAuthenticated || !role) {
    redirect("/login");
  }

  if (role === "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  }

  if (role === "AGENT") {
    redirect("/conversations");
  }

  redirect("/dashboard");
}
