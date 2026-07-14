import { useIonToast } from "@ionic/react";

/**
 * Represents the different types of feedback toasts that can be displayed.
 */
type FeedbackToastType = "validation" | "error" | "success" | "info";

/**
 * A mapping of feedback toast types to their respective display durations in milliseconds.
 */
const TOAST_DURATION_BY_TYPE: Record<FeedbackToastType, number> = {
  validation: 2600,
  error: 3200,
  success: 2200,
  info: 2400,
};

/**
 * A mapping of feedback toast types to their respective CSS class names for styling.
 */
const TOAST_CLASS_NAME_BY_TYPE: Record<FeedbackToastType, string> = {
  validation: "feedback-toast feedback-toast--validation",
  error: "feedback-toast feedback-toast--error",
  success: "feedback-toast feedback-toast--success",
  info: "feedback-toast feedback-toast--info",
};

/**
 * A custom hook that provides functions to display feedback toasts of different types.
 * @returns An object containing functions to show feedback toasts of various types.
 */
export function useFeedbackToast() {
  // Get the present function from the useIonToast hook to display toasts.
  const [present] = useIonToast();

  function showFeedbackToast(message: string, type: FeedbackToastType = "info") {
    void present({
      message,
      duration: TOAST_DURATION_BY_TYPE[type],
      position: "top",
      cssClass: TOAST_CLASS_NAME_BY_TYPE[type],
    });
  }

  return {
    showValidationToast: (message: string) => showFeedbackToast(message, "validation"),
    showErrorToast: (message: string) => showFeedbackToast(message, "error"),
    showSuccessToast: (message: string) => showFeedbackToast(message, "success"),
    showInfoToast: (message: string) => showFeedbackToast(message, "info"),
  };
}
