import { useLocation, useNavigate } from "react-router-dom";

export function useAppNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const history: string[] = location.state?.history ?? [];
  function goTo(path: string, extraState = {}) {
    navigate(path, {
      state: {
        ...extraState,
        history: [...history, location.pathname],
      },
    });
  }

  function goBack(extraState = {}, fallback = "/home") {
    const backTo = history.at(-1) ?? fallback;
    const remainingHistory = history.slice(0, -1);

    navigate(backTo, {
      state: {
        ...extraState,
        history: remainingHistory,
      },
    });
  }

  return {
    goTo,
    goBack,
  };
}
