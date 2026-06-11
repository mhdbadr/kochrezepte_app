import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import type { Recipe } from "../models/Recipe";
import type { RecipeCategory } from "../models/RecipeCategory";
import { createRecipe } from "../repositories/recipeRepository";
import "./RecipeForm.css";

export default function RecipeForm() {
  const history = useHistory();

  // Basic recipe fields controlled by React state.
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<RecipeCategory>("Quick");
  const [preparationTime, setPreparationTime] = useState(0);
  const [rating, setRating] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  // Dynamic sections start with one empty row to guide the user.
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  const [errorMessage, setErrorMessage] = useState("");

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
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Remove empty rows before validating and saving the recipe.
    const cleanedIngredients = ingredients.map((ingredient) => ingredient.trim()).filter(Boolean);
    const cleanedInstructions = instructions.map((instruction) => instruction.trim()).filter(Boolean);

    if (!title.trim() || !description.trim()) {
      setErrorMessage("Please enter a title and description.");
      return;
    }

    if (cleanedIngredients.length === 0 || cleanedInstructions.length === 0) {
      setErrorMessage("Please add at least one ingredient and one instruction.");
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
      imageUrl: imageUrl || undefined,
      preparationTime,
      rating: rating || undefined,
      createdAt: new Date().toISOString(),
      isEditable: true,
    };

    createRecipe(newRecipe);
    history.push("/recipes");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Recipe</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <main className="recipe-form-page">
          <Link className="recipe-form-back-link" to="/home">Back to recipes</Link>

          {/* The form hero keeps the create flow visually aligned with the rest of the app. */}
          <section className="recipe-form-hero">
            <p>Recipe Core</p>
            <h1>Create your own recipe</h1>
            <span>Add ingredients, instructions, timing and an image.</span>
          </section>

          <form className="recipe-form" onSubmit={handleSubmit}>

            {errorMessage && <p className="recipe-form-error">{errorMessage}</p>}

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
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Recipe description"
                  rows={4}
                />
              </label>
            </fieldset>

            {/* Users can either paste an image URL or upload a local image for preview. */}
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
                  <img src={imageUrl} alt="Recipe preview" width="240" />
                  <figcaption>Image preview</figcaption>
                </figure>
              )}
            </fieldset>

            {/* Ingredient rows are dynamic so users can add as many entries as needed. */}
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

              <button className="recipe-form-secondary-button" type="button" onClick={() => setIngredients([...ingredients, ""])}>
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
              <button className="recipe-form-submit-button" type="submit">Save recipe</button>
            </div>
          </form>
        </main>
      </IonContent>
    </IonPage>
  );
}
