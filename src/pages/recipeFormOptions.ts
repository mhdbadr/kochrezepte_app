/**
 * ImageInputMode defines the mode of image input for a recipe form.
 * It can either be "upload" for uploading an image file or "url" for providing an image URL.
 */
export type ImageInputMode = "upload" | "url";

/**
 * List of ingredient units for recipe ingredients.
 * Each unit has a value (used in the database) and a label (displayed in the UI).
 */
export const INGREDIENT_UNITS = [
  { value: "", label: "Keine Einheit" },
  { value: "g", label: "Gramm (g)" },
  { value: "kg", label: "Kilogramm (kg)" },
  { value: "ml", label: "Milliliter (ml)" },
  { value: "l", label: "Liter (l)" },
  { value: "TL", label: "Teeloeffel (TL)" },
  { value: "EL", label: "Essloeffel (EL)" },
  { value: "Stueck", label: "Stueck" },
  { value: "Prise", label: "Prise" },
  { value: "Bund", label: "Bund" },
  { value: "Dose", label: "Dose" },
  { value: "Packung", label: "Packung" },
  { value: "Becher", label: "Becher" },
  { value: "Tasse", label: "Tasse" },
  { value: "Scheibe", label: "Scheibe" },
];
