import { Sidebar } from "@/components/Sidebar";

// TODO: once auth ships, redirect to /login here if there's no session:
//   const supabase = createClient();
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) redirect("/login");
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
