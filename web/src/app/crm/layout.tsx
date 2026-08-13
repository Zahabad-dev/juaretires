import { auth } from "@/auth";
import PushSetup from "./push-setup";

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <>
      {children}
      {session && <PushSetup />}
    </>
  );
}
