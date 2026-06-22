import { IonButton, IonContent, IonPage } from "@ionic/react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import BackLink from "../components/BackLink";
import PageHeader from "../components/PageHeader";
import type { Recipe, RecipeIngredient } from "../models/Recipe";
import type { RecipeCategory } from "../models/RecipeCategory";
import { getRecipeById, updateRecipe } from "../repositories/recipeRepository";
// Reuse the create form styles so create and edit flows stay consistent.
import "./RecipeForm.css";

// Define the route parameters used by /recipes/:id/edit.
interface EditRecipeRouteParams {
  id: string;
}

export default function EditRecipePage() {
  const history = useHistory();
  const { id } = useParams<EditRecipeRouteParams>();

  // Local state for the loaded recipe, form fields, loading status, and error messages.
  const [recipe, setRecipe] = useState<Recipe | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [loadErrorMessage, setLoadErrorMessage] = useState("");

  // Prefill the form with existing recipe data so users only change what they need.
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<RecipeCategory>("Quick");
  const [preparationTime, setPreparationTime] = useState(0);
  const [rating, setRating] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Only allow editing if the recipe is loaded and marked as editable
  const canEditRecipe = recipe?.isEditable === true;

  useEffect(() => {
    let isPageActive = true;

    async function loadRecipe() {
      try {
        // Load the recipe from Supabase before prefilling the edit form.
        const loadedRecipe = await getRecipeById(id);

        if (isPageActive) {
          setRecipe(loadedRecipe);
          setLoadErrorMessage("");

          // Prefill the form fields with the loaded recipe data
          if (loadedRecipe) {
            setTitle(loadedRecipe.title);
            setDescription(loadedRecipe.description);
            setCategory(loadedRecipe.category);
            setPreparationTime(loadedRecipe.preparationTime);
            setRating(loadedRecipe.rating ?? 0);
            setImageUrl(loadedRecipe.imageUrl ?? "");
            setIngredients(loadedRecipe.ingredients.length ? loadedRecipe.ingredients.map((ingredient) => ingredient.name) : [""]);
            setInstructions(loadedRecipe.instructions.length ? loadedRecipe.instructions : [""]);
          }
        }
      } catch (error) {
        if (isPageActive) {
          setLoadErrorMessage(error instanceof Error ? error.message : "Recipe could not be loaded.");
        }
      } finally {
        if (isPageActive) {
          setIsLoading(false);
        }
      }
    }

    loadRecipe();

    return () => {
      isPageActive = false;
    };
  }, [id]);

  function updateIngredient(index: number, value: string) {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
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

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Convert the uploaded file into a previewable data URL for this app session.
    const reader = new FileReader();
    reader.onload = () => setImageUrl(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Guard against editing missing recipes or read-only sample recipes.
    if (!recipe || !canEditRecipe) {
      return;
    }

    // Remove empty rows before validating and saving the updated recipe.
    const cleanedIngredients: RecipeIngredient[] = ingredients
      .map((ingredient) => ingredient.trim())
      .filter(Boolean)
      .map((ingredient) => ({
        name: ingredient,
        amount: null,
        unit: null,
      }));
    const cleanedInstructions = instructions.map((instruction) => instruction.trim()).filter(Boolean);

    if (!title.trim() || !description.trim()) {
      setErrorMessage("Please enter a title and description.");
      return;
    }

    if (cleanedIngredients.length === 0 || cleanedInstructions.length === 0) {
      setErrorMessage("Please add at least one ingredient and one instruction.");
      return;
    }

    // Keep the existing ID and creation date while replacing editable fields.
    const updatedRecipe: Recipe = {
      ...recipe,
      title: title.trim(),
      description: description.trim(),
      ingredients: cleanedIngredients,
      instructions: cleanedInstructions,
      category,
      imageUrl: imageUrl || undefined,
      preparationTime,
      rating: rating || undefined,
    };

    try {
      setIsSaving(true);
      setErrorMessage("");

      const savedRecipe = await updateRecipe(updatedRecipe);
      history.push(`/recipes/${savedRecipe.id}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Recipe could not be updated.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <IonPage>
        <PageHeader title="Loading recipe" />

        <IonContent fullscreen>
          <main className="recipe-form-page">
            <p>Loading recipe...</p>
          </main>
        </IonContent>
      </IonPage>
    );
  }

  if (loadErrorMessage) {
    return (
      <IonPage>
        <PageHeader title="Recipe error" />

        <IonContent fullscreen>
          <main className="recipe-form-page">
            <p>Supabase error: {loadErrorMessage}</p>
            <IonButton routerLink="/home">Back to recipes</IonButton>
          </main>
        </IonContent>
      </IonPage>
    );
  }

  // Show a safe fallback instead of rendering an edit form for invalid or read-only recipes.
  if (!recipe || !canEditRecipe) {
    return (
      <IonPage>
        <PageHeader title="Recipe cannot be edited" />

        <IonContent fullscreen>
          <main className="recipe-form-page">
            <p>This recipe does not exist or cannot be edited.</p>
            <IonButton routerLink="/home">Back to recipes</IonButton>
          </main>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <PageHeader title="Edit Recipe" />

      <IonContent fullscreen>
        <main className="recipe-form-page">
          <BackLink to={`/recipes/${recipe.id}`} label="Zurück zum Rezept" />

          <section className="recipe-form-hero">
            <p>Recipe Core</p>
            <h1>Edit your recipe</h1>
            <span>Update the image, ingredients, instructions and cooking details.</span>
          </section>

          <form className="recipe-form" onSubmit={handleSubmit}>
            {errorMessage && <p className="recipe-form-error">{errorMessage}</p>}

            {/* Keep the edit form structure aligned with the create recipe form. */}
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
                    min="0"
                    value={preparationTime}
                    onChange={(event) => setPreparationTime(Number(event.target.value))}
                  />
                </label>

                <label className="recipe-form-field" htmlFor="rating">
                  <span>Rating</span>
                  <input
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={rating}
                    onChange={(event) => setRating(Number(event.target.value))}
                  />
                </label>
              </div>

              <label className="recipe-form-field" htmlFor="description">
                <span>Description</span>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Recipe description"
                />
              </label>
            </fieldset>

            {/* The image section supports both external URLs and uploaded previews. */}
            <fieldset className="recipe-form-card">
              <legend>Image</legend>

              <label className="recipe-form-field" htmlFor="imageUrl">
                <span>Image URL</span>
                <input
                  id="imageUrl"
                  type="url"
                  value={imageUrl.startsWith("data:") ? "" : imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  placeholder="https://example.com/recipe.jpg"
                />
              </label>

              <label className="recipe-form-field" htmlFor="imageUpload">
                <span>Upload image</span>
                <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} />
              </label>

              {imageUrl && (
                <figure className="recipe-form-image-preview">
                  <img src={imageUrl} alt="Recipe preview" />
                  <figcaption>Image preview</figcaption>
                </figure>
              )}
            </fieldset>

            {/* Existing ingredients are editable and additional rows can be added. */}
            <fieldset className="recipe-form-card">
              <legend>Ingredients</legend>

              {ingredients.map((ingredient, index) => (
                <div className="recipe-form-row" key={index}>
                  <label className="recipe-form-field" htmlFor={`ingredient-${index}`}>
                    <span>Ingredient {index + 1}</span>
                    <input
                      id={`ingredient-${index}`}
                      type="text"
                      value={ingredient}
                      onChange={(event) => updateIngredient(index, event.target.value)}
                      placeholder="e.g. Tomatoes"
                    />
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
                onClick={() => setIngredients([...ingredients, ""])}
              >
                Add ingredient
              </button>
            </fieldset>

            {/* Existing instructions keep their order while users can add or remove steps. */}
            <fieldset className="recipe-form-card">
              <legend>Instructions</legend>

              {instructions.map((instruction, index) => (
                <div className="recipe-form-row" key={index}>
                  <label className="recipe-form-field" htmlFor={`instruction-${index}`}>
                    <span>Step {index + 1}</span>
                    <textarea
                      id={`instruction-${index}`}
                      rows={3}
                      value={instruction}
                      onChange={(event) => updateInstruction(index, event.target.value)}
                      placeholder="Describe this step"
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

              <button
                className="recipe-form-secondary-button"
                type="button"
                onClick={() => setInstructions([...instructions, ""])}
              >
                Add instruction
              </button>
            </fieldset>

            <div className="recipe-form-actions">
              <Link to={`/recipes/${recipe.id}`}>Cancel</Link>
              <button className="recipe-form-submit-button" type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </main>
      </IonContent>
    </IonPage>
  );
}
