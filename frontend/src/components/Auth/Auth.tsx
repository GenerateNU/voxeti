import { useEffect } from "react";
import { useStateSelector } from "../../hooks/use-redux";
import router from "../../router";
import { AuthProps } from "./Auth.types";

export default function Auth({ children, authRoute }: AuthProps) {
  const { user } = useStateSelector((state) => state.user);
  const userId = user?.id;

  useEffect(() => {
    if (authRoute) {
      userId == "" && router.navigate({ to: "/login" });
    } else {
      userId !== "" && router.navigate({ to: "/jobs" });
    }
  }, [authRoute, userId]);

  return <>{children}</>;
}
