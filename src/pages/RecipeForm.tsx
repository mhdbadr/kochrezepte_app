import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import type { Recipe } from "../models/Recipe";
import type { RecipeCategory } from "../models/RecipeCategory";
import { createRecipe } from "../repositories/recipeRepository";

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
        <main>
          <Link to="/recipes">Back to recipes</Link>

          <form onSubmit={handleSubmit}>
            <h1>Create Recipe</h1>

            {errorMessage && <p>{errorMessage}</p>}

            <fieldset>
              <legend>Basic information</legend>

              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Recipe title"
              />

              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Recipe description"
              />

              <label htmlFor="category">Category</label>
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

              <label htmlFor="preparationTime">Preparation time in minutes</label>
              <input
                id="preparationTime"
                type="number"
                min="0"
                value={preparationTime}
                onChange={(event) => setPreparationTime(Number(event.target.value))}
              />

              <label htmlFor="rating">Rating</label>
              <input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={rating}
                onChange={(event) => setRating(Number(event.target.value))}
              />
            </fieldset>

            <fieldset>
              <legend>Image</legend>

              <label htmlFor="imageUrl">Image URL</label>
              <input
                id="imageUrl"
                type="url"
                value={imageUrl.startsWith("data:") ? "" : imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://example.com/recipe.jpg"
              />

              <label htmlFor="imageUpload">Upload image</label>
              <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} />

              {imageUrl && (
                <figure>
                  <img src={imageUrl} alt="Recipe preview" width="240" />
                  <figcaption>Image preview</figcaption>
                </figure>
              )}
            </fieldset>

            <fieldset>
              <legend>Ingredients</legend>

              {ingredients.map((ingredient, index) => (
                <div key={index}>
                  <label htmlFor={`ingredient-${index}`}>Ingredient {index + 1}</label>
                  <input
                    id={`ingredient-${index}`}
                    type="text"
                    value={ingredient}
                    onChange={(event) => updateIngredient(index, event.target.value)}
                    placeholder="e.g. Tomatoes"
                  />

                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    disabled={ingredients.length === 1}
                  >
                    Remove ingredient
                  </button>
                </div>
              ))}

              <button type="button" onClick={() => setIngredients([...ingredients, ""])}>
                Add ingredient
              </button>
            </fieldset>

            <fieldset>
              <legend>Instructions</legend>

              {instructions.map((instruction, index) => (
                <div key={index}>
                  <label htmlFor={`instruction-${index}`}>Step {index + 1}</label>
                  <textarea
                    id={`instruction-${index}`}
                    value={instruction}
                    onChange={(event) => updateInstruction(index, event.target.value)}
                    placeholder="Describe this step"
                  />

                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    disabled={instructions.length === 1}
                  >
                    Remove step
                  </button>
                </div>
              ))}

              <button type="button" onClick={() => setInstructions([...instructions, ""])}>
                Add instruction
              </button>
            </fieldset>

            <button type="submit">Save recipe</button>
          </form>
        </main>
      </IonContent>
    </IonPage>
  );
}
