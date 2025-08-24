import "@/styles/blueprint.scoped.css";
import "@/styles/blueprint-icons.scoped.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[calc(100dvh-4rem)] overflow-hidden">
      {children}
    </div>
  );
}



