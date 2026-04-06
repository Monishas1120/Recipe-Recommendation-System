import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";

// ✅ Smarter procedure generator (less repetitive)
const generateProcedure = (ingredients: string[] = []) => {
  if (!ingredients.length) return "No instructions available.";

  const intro = [
    "Start by preparing all ingredients.",
    "Begin with cleaning and organizing ingredients.",
    "Prepare ingredients and keep everything ready."
  ];

  const cooking = [
    "Heat oil in a pan over medium heat.",
    "Warm a pan and add some oil.",
    "Start cooking by heating oil in a pan."
  ];

  const ending = [
    "Cook until everything is well combined and flavorful. Serve hot.",
    "Mix well and cook until done. Enjoy your meal.",
    "Let it cook properly and serve hot."
  ];

  const random = (arr: string[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  return `
${random(intro)}

${random(cooking)} Add ${ingredients.slice(0, 2).join(", ").toLowerCase()} 
and cook for a few minutes. Add spices as needed and mix well.

${random(ending)}
  `;
};

const RecipeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = location.state?.recipe;

  if (!recipe) {
    return (
      <div className="h-screen flex items-center justify-center">
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  const procedure = generateProcedure(recipe.ingredients);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">

      {/* 🔙 Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-gray-500 hover:text-black"
      >
        ← Back
      </button>

      {/* 🔥 IMAGE + TITLE */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* IMAGE */}
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full md:w-[320px] h-[220px] object-cover rounded-lg"
        />

        {/* DETAILS */}
        <div>
          <h1 className="text-2xl font-semibold">{recipe.title}</h1>

          <p className="text-sm text-gray-500 mt-2">
            {recipe.cuisine || "Recipe"}
          </p>

          {/* META */}
          <div className="flex gap-4 mt-4 text-sm text-gray-600">
            <span>{recipe.time}</span>
            <span>{recipe.servings} servings</span>
            <span>{recipe.calories} cal</span>
          </div>

          {/* LINK */}
          {recipe.url && (
            <a
              href={recipe.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sm text-black underline"
            >
              View full recipe <ExternalLink className="inline w-4" />
            </a>
          )}
        </div>
      </div>

      {/* 🧂 INGREDIENTS */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Ingredients</h2>

        <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
          {recipe.ingredients?.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </div>

      {/* 👩‍🍳 PROCEDURE */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Procedure</h2>

        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {procedure}
        </p>
      </div>
    </div>
  );
};

export default RecipeDetails;