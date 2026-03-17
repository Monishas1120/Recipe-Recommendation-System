-- Create recipes table with full recipe data
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT NOT NULL,
  time TEXT NOT NULL,
  servings INTEGER NOT NULL DEFAULT 4,
  calories INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'Medium',
  ingredients TEXT[] DEFAULT '{}',
  instructions TEXT[] DEFAULT '{}',
  cuisine TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Allow public read access for recipes
CREATE POLICY "Recipes are publicly viewable" 
ON public.recipes 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_recipes_updated_at
BEFORE UPDATE ON public.recipes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for search
CREATE INDEX idx_recipes_title ON public.recipes USING gin(to_tsvector('english', title));
CREATE INDEX idx_recipes_category ON public.recipes (category);

-- Insert sample recipes
INSERT INTO public.recipes (title, description, image, time, servings, calories, category, difficulty, ingredients, instructions, cuisine, tags) VALUES
('Creamy Tuscan Garlic Chicken', 'Rich and creamy chicken with sun-dried tomatoes and spinach', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80', '35 min', 4, 420, 'Dinner', 'Medium', ARRAY['4 chicken breasts', '2 cups spinach', '1/2 cup sun-dried tomatoes', '1 cup heavy cream', '4 cloves garlic'], ARRAY['Season chicken with salt and pepper', 'Sear chicken in hot pan until golden', 'Add garlic and cook until fragrant', 'Add cream, tomatoes, and spinach', 'Simmer until sauce thickens'], 'Italian', ARRAY['chicken', 'creamy', 'italian']),
('Fresh Avocado Toast with Poached Eggs', 'Simple yet delicious breakfast favorite', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80', '15 min', 2, 280, 'Breakfast', 'Easy', ARRAY['2 slices sourdough bread', '1 ripe avocado', '2 eggs', 'Salt and pepper', 'Red pepper flakes'], ARRAY['Toast the bread until golden', 'Mash avocado with salt and pepper', 'Poach eggs in simmering water', 'Spread avocado on toast', 'Top with poached eggs'], 'American', ARRAY['avocado', 'eggs', 'healthy']),
('Thai Green Curry with Vegetables', 'Aromatic and spicy Thai curry', 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80', '40 min', 4, 380, 'Dinner', 'Medium', ARRAY['2 tbsp green curry paste', '400ml coconut milk', 'Mixed vegetables', 'Thai basil', 'Fish sauce'], ARRAY['Fry curry paste until fragrant', 'Add coconut milk and bring to simmer', 'Add vegetables and cook until tender', 'Season with fish sauce', 'Garnish with Thai basil'], 'Thai', ARRAY['curry', 'spicy', 'vegetarian']),
('Classic Margherita Pizza', 'Traditional Italian pizza with fresh ingredients', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80', '50 min', 4, 450, 'Lunch', 'Hard', ARRAY['Pizza dough', 'San Marzano tomatoes', 'Fresh mozzarella', 'Fresh basil', 'Olive oil'], ARRAY['Stretch dough into circle', 'Spread crushed tomatoes', 'Add torn mozzarella', 'Bake at 450F for 12-15 minutes', 'Top with fresh basil'], 'Italian', ARRAY['pizza', 'italian', 'vegetarian']),
('Greek Salad Bowl', 'Fresh Mediterranean salad with feta', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80', '10 min', 2, 180, 'Lunch', 'Easy', ARRAY['Cucumber', 'Tomatoes', 'Red onion', 'Kalamata olives', 'Feta cheese'], ARRAY['Chop all vegetables', 'Combine in large bowl', 'Add olives and feta', 'Drizzle with olive oil and oregano', 'Serve immediately'], 'Greek', ARRAY['salad', 'healthy', 'vegetarian']),
('Chocolate Lava Cake', 'Decadent dessert with molten center', 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&q=80', '25 min', 2, 520, 'Dessert', 'Medium', ARRAY['4 oz dark chocolate', '4 tbsp butter', '2 eggs', '2 tbsp sugar', '1 tbsp flour'], ARRAY['Melt chocolate and butter together', 'Whisk eggs and sugar until fluffy', 'Fold in chocolate mixture and flour', 'Bake at 425F for 12 minutes', 'Serve immediately'], 'French', ARRAY['chocolate', 'dessert', 'decadent']),
('Grilled Salmon with Asparagus', 'Healthy and flavorful fish dinner', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80', '30 min', 2, 350, 'Dinner', 'Easy', ARRAY['2 salmon fillets', '1 bunch asparagus', 'Lemon', 'Olive oil', 'Dill'], ARRAY['Season salmon with salt and pepper', 'Grill salmon 4 minutes per side', 'Grill asparagus until charred', 'Squeeze lemon over everything', 'Garnish with fresh dill'], 'American', ARRAY['salmon', 'healthy', 'seafood']),
('Fluffy Blueberry Pancakes', 'Stack of golden pancakes with fresh berries', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80', '20 min', 4, 320, 'Breakfast', 'Easy', ARRAY['2 cups flour', '2 eggs', '1.5 cups milk', '1 cup blueberries', 'Maple syrup'], ARRAY['Mix dry ingredients', 'Add wet ingredients and mix until just combined', 'Fold in blueberries', 'Cook on griddle until bubbles form', 'Flip and cook until golden'], 'American', ARRAY['pancakes', 'breakfast', 'sweet']),
('Beef Tacos with Fresh Salsa', 'Authentic Mexican street tacos', 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&q=80', '25 min', 4, 380, 'Dinner', 'Easy', ARRAY['1 lb ground beef', 'Corn tortillas', 'Fresh cilantro', 'Lime', 'Onion'], ARRAY['Brown beef with spices', 'Warm tortillas on griddle', 'Dice onion and cilantro', 'Assemble tacos', 'Squeeze lime on top'], 'Mexican', ARRAY['tacos', 'beef', 'mexican']),
('Mushroom Risotto', 'Creamy Italian rice dish', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80', '45 min', 4, 420, 'Dinner', 'Hard', ARRAY['Arborio rice', 'Mixed mushrooms', 'White wine', 'Parmesan', 'Vegetable stock'], ARRAY['Saute mushrooms until golden', 'Toast rice in butter', 'Add wine and let absorb', 'Gradually add warm stock', 'Finish with parmesan'], 'Italian', ARRAY['risotto', 'mushroom', 'vegetarian']),
('Chicken Caesar Salad', 'Classic salad with grilled chicken', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&q=80', '20 min', 2, 350, 'Lunch', 'Easy', ARRAY['Romaine lettuce', 'Grilled chicken', 'Parmesan', 'Croutons', 'Caesar dressing'], ARRAY['Grill chicken until cooked', 'Chop romaine lettuce', 'Slice chicken', 'Combine with parmesan and croutons', 'Drizzle with dressing'], 'American', ARRAY['salad', 'chicken', 'healthy']),
('Vegetable Stir Fry', 'Quick and healthy Asian dish', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80', '15 min', 4, 200, 'Dinner', 'Easy', ARRAY['Mixed vegetables', 'Soy sauce', 'Ginger', 'Garlic', 'Sesame oil'], ARRAY['Heat wok until smoking', 'Add vegetables in order of cooking time', 'Add garlic and ginger', 'Season with soy sauce', 'Finish with sesame oil'], 'Asian', ARRAY['vegetable', 'healthy', 'quick']),
('Banana Bread', 'Moist and sweet quick bread', 'https://images.unsplash.com/photo-1606101273945-e9f2bad204ae?w=600&q=80', '60 min', 8, 280, 'Dessert', 'Easy', ARRAY['3 ripe bananas', '2 cups flour', '1 cup sugar', '1 egg', 'Butter'], ARRAY['Mash bananas in bowl', 'Mix dry ingredients', 'Combine wet and dry', 'Pour into loaf pan', 'Bake at 350F for 55 minutes'], 'American', ARRAY['banana', 'bread', 'sweet']),
('Shrimp Scampi', 'Garlic butter shrimp over pasta', 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=600&q=80', '20 min', 4, 450, 'Dinner', 'Medium', ARRAY['1 lb shrimp', 'Linguine', 'Garlic', 'White wine', 'Butter'], ARRAY['Cook pasta al dente', 'Saute garlic in butter', 'Add shrimp and cook until pink', 'Add wine and reduce', 'Toss with pasta'], 'Italian', ARRAY['shrimp', 'pasta', 'seafood']),
('French Onion Soup', 'Rich and comforting soup with cheese', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80', '90 min', 4, 380, 'Lunch', 'Hard', ARRAY['4 large onions', 'Beef broth', 'French bread', 'Gruyere cheese', 'Butter'], ARRAY['Caramelize onions slowly', 'Add broth and simmer', 'Ladle into oven-safe bowls', 'Top with bread and cheese', 'Broil until bubbly'], 'French', ARRAY['soup', 'cheese', 'comfort']),
('Acai Bowl', 'Refreshing Brazilian smoothie bowl', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80', '10 min', 1, 320, 'Breakfast', 'Easy', ARRAY['Frozen acai', 'Banana', 'Mixed berries', 'Granola', 'Honey'], ARRAY['Blend acai with banana', 'Pour into bowl', 'Top with berries', 'Add granola', 'Drizzle with honey'], 'Brazilian', ARRAY['acai', 'healthy', 'breakfast']),
('Pad Thai', 'Classic Thai noodle dish', 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&q=80', '30 min', 4, 480, 'Dinner', 'Medium', ARRAY['Rice noodles', 'Shrimp or tofu', 'Bean sprouts', 'Peanuts', 'Pad Thai sauce'], ARRAY['Soak noodles in warm water', 'Cook protein in wok', 'Add noodles and sauce', 'Add bean sprouts', 'Top with peanuts and lime'], 'Thai', ARRAY['noodles', 'thai', 'asian']),
('Caprese Salad', 'Simple Italian tomato and mozzarella', 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=600&q=80', '5 min', 2, 220, 'Lunch', 'Easy', ARRAY['Fresh tomatoes', 'Fresh mozzarella', 'Fresh basil', 'Balsamic glaze', 'Olive oil'], ARRAY['Slice tomatoes and mozzarella', 'Arrange alternating slices', 'Tuck basil leaves between', 'Drizzle with oil and balsamic', 'Season with salt'], 'Italian', ARRAY['salad', 'italian', 'vegetarian']),
('Butter Chicken', 'Creamy Indian curry', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80', '45 min', 4, 520, 'Dinner', 'Medium', ARRAY['Chicken thighs', 'Tomato puree', 'Heavy cream', 'Garam masala', 'Butter'], ARRAY['Marinate chicken in yogurt and spices', 'Grill or broil chicken', 'Make tomato-based sauce', 'Add cream and butter', 'Combine with chicken'], 'Indian', ARRAY['curry', 'indian', 'chicken']),
('Eggs Benedict', 'Classic brunch dish with hollandaise', 'https://images.unsplash.com/photo-1608039829572-9b33e0e9e6a5?w=600&q=80', '30 min', 2, 480, 'Breakfast', 'Hard', ARRAY['English muffins', 'Canadian bacon', 'Eggs', 'Butter', 'Lemon juice'], ARRAY['Toast English muffins', 'Make hollandaise sauce', 'Poach eggs', 'Layer bacon on muffins', 'Top with egg and hollandaise'], 'American', ARRAY['eggs', 'brunch', 'classic']),
('Quinoa Buddha Bowl', 'Nutritious grain bowl with vegetables', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80', '25 min', 2, 380, 'Lunch', 'Easy', ARRAY['Quinoa', 'Chickpeas', 'Roasted vegetables', 'Tahini', 'Lemon'], ARRAY['Cook quinoa according to package', 'Roast vegetables at 400F', 'Drain and rinse chickpeas', 'Make tahini dressing', 'Assemble bowl with all components'], 'American', ARRAY['quinoa', 'healthy', 'vegan']),
('Tiramisu', 'Classic Italian coffee dessert', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80', '30 min', 8, 380, 'Dessert', 'Medium', ARRAY['Ladyfingers', 'Mascarpone', 'Espresso', 'Cocoa powder', 'Eggs'], ARRAY['Make strong espresso and cool', 'Whip egg yolks with sugar', 'Fold in mascarpone', 'Dip ladyfingers in coffee', 'Layer with cream and dust with cocoa'], 'Italian', ARRAY['dessert', 'coffee', 'italian']),
('Falafel Wrap', 'Middle Eastern chickpea patties in pita', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&q=80', '35 min', 4, 420, 'Lunch', 'Medium', ARRAY['Chickpeas', 'Fresh herbs', 'Pita bread', 'Tahini', 'Pickled vegetables'], ARRAY['Blend chickpeas with herbs and spices', 'Form into balls and fry', 'Warm pita bread', 'Add falafel and vegetables', 'Drizzle with tahini'], 'Middle Eastern', ARRAY['falafel', 'vegetarian', 'healthy']),
('Miso Soup', 'Traditional Japanese soup', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80', '15 min', 4, 80, 'Lunch', 'Easy', ARRAY['Miso paste', 'Dashi stock', 'Tofu', 'Wakame seaweed', 'Green onions'], ARRAY['Heat dashi stock', 'Remove from heat and whisk in miso', 'Add cubed tofu', 'Add rehydrated wakame', 'Garnish with green onions'], 'Japanese', ARRAY['soup', 'japanese', 'healthy'])
ON CONFLICT DO NOTHING;