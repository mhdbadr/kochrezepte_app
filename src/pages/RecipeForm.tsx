import { IonContent, IonPage } from "@ionic/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import BackLink from "../components/BackLink";
import PageHeader from "../components/PageHeader";
import type { Recipe, RecipeDifficulty, RecipeIngredient } from "../models/Recipe";
import type { RecipeCategory } from "../models/RecipeCategory";
import { createRecipe } from "../repositories/recipeRepository";
import "./RecipeForm.css";
import { isGuest } from '../utils/auth';
import { INGREDIENT_UNITS, type ImageInputMode } from "./recipeFormOptions";
import { useFeedbackToast } from "../hooks/useFeedbackToast";

export default function RecipeForm() {
  const history = useHistory();

  // Basic recipe fields controlled by React state.
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<RecipeCategory>("Quick");
  const [difficulty, setDifficulty] = useState<RecipeDifficulty>("Einfach");
  const [preparationTime, setPreparationTime] = useState("");
  const [servings, setServings] = useState("4");
  const [imageUrl, setImageUrl] = useState("");
  const [imageInputMode, setImageInputMode] = useState<ImageInputMode>("upload");

  // Dynamic sections start with one empty row to guide the user.
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([
    { name: "", amount: null, unit: null },
  ]);
  const [instructions, setInstructions] = useState([""]);
  const [isSaving, setIsSaving] = useState(false);

  const { showValidationToast, showErrorToast, showSuccessToast } = useFeedbackToast();

  function updateIngredient(index: number, changes: Partial<RecipeIngredient>) {
    const updatedIngredients = ingredients.map((ingredient, ingredientIndex) =>
      ingredientIndex === index ? { ...ingredient, ...changes } : ingredient,
    );

    setIngredients(updatedIngredients);
  }

  function updateInstruction(index: number, value: string) {
    const updatedInstructions = [...instructions];
    updatedInstructions[index] = value;
    setInstructions(updatedInstructions);
  }

  function removeIngredient(index: number) {
    setIngredients(ingredients.filter((_, ingredientIndex) => ingredientIndex !== index));
  }

  function removeInstruction(index: number) {
    setInstructions(instructions.filter((_, instructionIndex) => instructionIndex !== index));
  }

  /* Handle image uploads by converting the file into a data URL for preview and storage. */
  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return; // No file selected, do nothing.

    // Convert the uploaded file into a previewable data URL for this app session.
    const reader = new FileReader();
    reader.onload = () => setImageUrl(String(reader.result));
    reader.readAsDataURL(file);
  }

  /* Handle form submission by validating input, constructing a complete Recipe object, and saving it. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isGuest()) {
      showErrorToast("Bitte melde dich an, um ein Rezept zu erstellen.");
      return;
    }

    // Remove empty rows before validating and saving the recipe.
    const cleanedIngredients: RecipeIngredient[] = ingredients
      .map((ingredient) => ({
        name: ingredient.name.trim(),
        amount: ingredient.amount,
        unit: ingredient.unit?.trim() || null,
      }))
      .filter((ingredient) => ingredient.name);
    const cleanedInstructions = instructions.map((instruction) => instruction.trim()).filter(Boolean);
    const finalImageUrl = imageUrl.trim();

    if (!title.trim()) {
      showValidationToast("Bitte gib einen Rezepttitel ein.");
      return;
    }

    const preparationTimeInMinutes = Number(preparationTime);

    if (!Number.isFinite(preparationTimeInMinutes) || preparationTimeInMinutes < 1) {
      showValidationToast("Bitte gib eine Zubereitungszeit von mindestens 1 Minute ein.");
      return;
    }

    const servingsCount = Number(servings);

    if (!Number.isInteger(servingsCount) || servingsCount < 1) {
      showValidationToast("Bitte gib die Anzahl der Personen ein.");
      return;
    }

    if (!description.trim()) {
      showValidationToast("Bitte gib eine Beschreibung ein.");
      return;
    }

    if (!finalImageUrl) {
      showValidationToast("Bitte lade ein Bild hoch oder fuege eine Bild-URL ein.");
      return;
    }

    if (cleanedIngredients.length === 0) {
      showValidationToast("Bitte fuege mindestens eine Zutat hinzu.");
      return;
    }

    const hasInvalidIngredientAmount = cleanedIngredients.some(
      (ingredient) => ingredient.amount !== null && (!Number.isFinite(ingredient.amount) || ingredient.amount < 0),
    );

    if (hasInvalidIngredientAmount) {
      showValidationToast("Zutatenmengen duerfen nicht negativ sein.");
      return;
    }

    if (cleanedInstructions.length === 0) {
      showValidationToast("Bitte fuege mindestens einen Zubereitungsschritt hinzu.");
      return;
    }

    // Build a complete Recipe object that matches the shared application model.
    const newRecipe: Recipe = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      ingredients: cleanedIngredients,
      instructions: cleanedInstructions,
      category,
      difficulty,
      imageUrl: finalImageUrl,
      preparationTime: preparationTimeInMinutes,
      servings: servingsCount,
      createdAt: new Date().toISOString(),
      isEditable: true,
    };

    try {
      setIsSaving(true);

      const createdRecipe = await createRecipe(newRecipe);
      showSuccessToast("Rezept wurde erfolgreich erstellt.");
      history.push(`/recipes/${createdRecipe.id}`);
    } catch (error) {
      console.error("Recipe could not be saved:", error);
      showErrorToast("Das Rezept konnte nicht gespeichert werden. Bitte versuche es erneut.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <IonPage>
      <PageHeader title="Create Recipe" />

      <IonContent fullscreen>
        <main className="recipe-form-page">
          <BackLink to="/home" label="Zurück zur Übersicht" />

          {/* The form hero keeps the create flow visually aligned with the rest of the app. */}
          <section className="recipe-form-hero">
            <p>Recipe Core</p>
            <h1>Create your own recipe</h1>
            <span>Add ingredients, instructions, timing and an image.</span>
          </section>

          <form className="recipe-form" onSubmit={handleSubmit}>

            {/* Basic fields are grouped first so the recipe has clear metadata before details. */}
            <fieldset className="recipe-form-card">
              <legend>Basic information</legend>

              <div className="recipe-form-grid">
                <label className="recipe-form-field" htmlFor="title">
                  <span>Title</span>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Recipe title"
                  />
                </label>

                <label className="recipe-form-field" htmlFor="category">
                  <span>Category</span>
                  <select
                    id="category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value as RecipeCategory)}
                  >
                    <option value="Vegan">Vegan</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Quick">Quick</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Main Dish">Main Dish</option>
                    <option value="Healthy">Healthy</option>
                  </select>
                </label>

                <label className="recipe-form-field" htmlFor="preparationTime">
                  <span>Preparation time in minutes</span>
                  <input
                    id="preparationTime"
                    type="number"
                    min="1"
                    value={preparationTime}
                    onChange={(event) => setPreparationTime(event.target.value)}
                    placeholder="z.B. 15"
                  />
                </label>

                <label className="recipe-form-field" htmlFor="difficulty">
                  <span>Schwierigkeit</span>
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(event) => setDifficulty(event.target.value as RecipeDifficulty)}
                  >
                    <option value="Einfach">Einfach</option>
                    <option value="Mittel">Mittel</option>
                    <option value="Schwer">Schwer</option>
                  </select>
                </label>

                <label className="recipe-form-field" htmlFor="servings">
                  <span>Personen</span>
                  <input
                    id="servings"
                    type="number"
                    min="1"
                    step="1"
                    value={servings}
                    onChange={(event) => setServings(event.target.value)}
                    placeholder="z.B. 4"
                  />
                </label>

              </div>

              <label className="recipe-form-field" htmlFor="description">
                <span>Description</span>
                <textarea
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Recipe description"
                  rows={4}
                />
              </label>
            </fieldset>

            {/* Users can either upload a local image or paste an image URL for preview. */}
            <fieldset className="recipe-form-card">
              <legend>Bild</legend>

              <div className="recipe-form-image-menu" role="tablist" aria-label="Bildquelle waehlen">
                <button
                  className={imageInputMode === "upload" ? "recipe-form-image-menu__item recipe-form-image-menu__item--active" : "recipe-form-image-menu__item"}
                  type="button"
                  onClick={() => setImageInputMode("upload")}
                >
                  Bild hochladen
                </button>
                <button
                  className={imageInputMode === "url" ? "recipe-form-image-menu__item recipe-form-image-menu__item--active" : "recipe-form-image-menu__item"}
                  type="button"
                  onClick={() => setImageInputMode("url")}
                >
                  URL einfuegen
                </button>
              </div>

              <div className="recipe-form-image-options">
                {imageInputMode === "upload" && (
                <section className="recipe-form-image-option">
                  <div>
                    <h3>Bild hochladen</h3>
                    <p>Waehle ein Bild von deinem Geraet aus.</p>
                  </div>

                  <label className="recipe-form-upload-button" htmlFor="imageUpload">
                    Datei auswaehlen
                  </label>
                  <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} />
                </section>
                )}

                {imageInputMode === "url" && (
                <section className="recipe-form-image-option">
                  <label className="recipe-form-field" htmlFor="imageUrl">
                    <span>Bild per URL einfuegen</span>
                    <input
                      id="imageUrl"
                      type="url"
                      value={imageUrl.startsWith("data:") ? "" : imageUrl}
                      onChange={(event) => setImageUrl(event.target.value)}
                      placeholder="https://example.com/recipe.jpg"
                    />
                  </label>
                </section>
                )}
              </div>

              {imageUrl && (
                <figure className="recipe-form-image-preview">
                  <img src={imageUrl} alt="Recipe preview" width="240" />
                  <figcaption>Image preview</figcaption>
                </figure>
              )}
            </fieldset>

            {/* Ingredient rows are dynamic so users can add as many entries as needed. */}
            <fieldset className="recipe-form-card">
              <legend>Ingredients</legend>

              {ingredients.map((ingredient, index) => (
                <div className="recipe-form-ingredient-row" key={index}>
                  <label className="recipe-form-field" htmlFor={`ingredient-${index}`}>
                    <span>Ingredient {index + 1}</span>
                    <input
                      id={`ingredient-${index}`}
                      type="text"
                      value={ingredient.name}
                      onChange={(event) => updateIngredient(index, { name: event.target.value })}
                      placeholder="e.g. Tomatoes"
                    />
                  </label>

                  <label className="recipe-form-field" htmlFor={`ingredient-amount-${index}`}>
                    <span>Amount</span>
                    <input
                      id={`ingredient-amount-${index}`}
                      type="number"
                      min="0"
                      step="1"
                      value={ingredient.amount ?? ""}
                      onChange={(event) =>
                        updateIngredient(index, {
                          amount: event.target.value === "" ? null : Number(event.target.value),
                        })
                      }
                      placeholder="e.g. 250"
                    />
                  </label>

                  <label className="recipe-form-field recipe-form-unit-field" htmlFor={`ingredient-unit-${index}`}>
                    <span>Einheit</span>
                    <select
                      id={`ingredient-unit-${index}`}
                      value={ingredient.unit ?? ""}
                      onChange={(event) => updateIngredient(index, { unit: event.target.value || null })}
                    >
                      {INGREDIENT_UNITS.map((unit) => (
                        <option key={unit.value || "none"} value={unit.value}>
                          {unit.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    className="recipe-form-secondary-button"
                    type="button"
                    onClick={() => removeIngredient(index)}
                    disabled={ingredients.length === 1}
                  >
                    Remove ingredient
                  </button>
                </div>
              ))}

              <button
                className="recipe-form-secondary-button"
                type="button"
                onClick={() => setIngredients([...ingredients, { name: "", amount: null, unit: null }])}
              >
                Add ingredient
              </button>
            </fieldset>

            {/* Instruction rows are dynamic and saved as ordered recipe steps. */}
            <fieldset className="recipe-form-card">
              <legend>Instructions</legend>

              {instructions.map((instruction, index) => (
                <div className="recipe-form-row" key={index}>
                  <label className="recipe-form-field" htmlFor={`instruction-${index}`}>
                    <span>Step {index + 1}</span>
                    <textarea
                      id={`instruction-${index}`}
                      value={instruction}
                      onChange={(event) => updateInstruction(index, event.target.value)}
                      placeholder="Describe this step"
                      rows={3}
                    />
                  </label>

                  <button
                    className="recipe-form-secondary-button"
                    type="button"
                    onClick={() => removeInstruction(index)}
                    disabled={instructions.length === 1}
                  >
                    Remove step
                  </button>
                </div>
              ))}

              <button className="recipe-form-secondary-button" type="button" onClick={() => setInstructions([...instructions, ""])}>
                Add instruction
              </button>
            </fieldset>

            {/* The action row separates navigation from the final save action. */}
            <div className="recipe-form-actions">
              <Link to="/home">Cancel</Link>
              <button className="recipe-form-submit-button" type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save recipe"}
              </button>
            </div>
          </form>
        </main>
      </IonContent>
    </IonPage>
  );
}
