from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ VERY IMPORTANT (fixes frontend connection issue)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    text: str

# 🤖 Simple DL-like logic (you can upgrade later)
@app.post("/recommend")
def recommend(query: Query):
    text = query.text.lower()

    results = []

    if "chicken" in text:
        results.append("Chicken Biryani")
        results.append("Grilled Chicken")

    if "veg" in text or "vegetarian" in text:
        results.append("Paneer Butter Masala")
        results.append("Veg Fried Rice")

    if "sweet" in text or "dessert" in text:
        results.append("Chocolate Cake")

    if not results:
        results.append("Try searching something like chicken or veg")

    return {"recommendations": results}