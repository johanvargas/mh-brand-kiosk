import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";

/**
 * Redirects to the home page after `timeout` ms of inactivity.
 * Activity = any pointer, touch, keyboard, or scroll event.
 */
export default function useInactivityTimeout(timeout = 30000) {
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef(null);

  useEffect(() => {
    // Don't run on the home page
    if (location.pathname === "/") return;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        navigate("/", { viewTransition: true });
      }, timeout);
    };

    const events = [
      "pointerdown",
      "pointermove",
      "keydown",
      "scroll",
      "touchstart",
      "touchmove",
    ];

    events.forEach((evt) => window.addEventListener(evt, resetTimer, { passive: true }));

    // Start the initial timer
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
  }, [timeout, navigate, location.pathname]);
}
