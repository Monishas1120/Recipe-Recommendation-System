import { useSearchParams } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { useRecipes } from "@/hooks/useRecipes";

export default function RecipePage() {
  const [params] = useSearchParams();
  const id = params.get("id");

  const { recipes } = useRecipes();

  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    return <div className="p-10 text-center">Recipe not found</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        
        <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>

        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full max-w-xl rounded-xl mb-6"
        />

        <p className="mb-4">{recipe.description}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Ingredients</h2>
        <ul className="list-disc list-inside">
          {recipe.ingredients?.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Instructions</h2>
        <ol className="list-decimal list-inside">
          {recipe.instructions?.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>

      </div>
    </Layout>
  );
}