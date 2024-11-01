import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CerrarSesion() {
  const router = useRouter();

  useEffect(() => {
    if (hasCookie('user')) {
      deleteCookie('user');
    }
    router.replace("/login");
  }, []);
}