import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

# Load environment variables from backend/.env
load_dotenv()

# Initialize FastAPI application
app = FastAPI(
    title="Rem AI Chatbot Backend",
    description="FastAPI backend powered by Groq API for Rem AI Chatbot",
    version="1.0.0"
)

# Configure CORS to allow requests from the React/Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins including localhost:3000
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, OPTIONS, etc.
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Pydantic Request & Response Schemas
# ---------------------------------------------------------------------------
class ChatRequest(BaseModel):
    message: str
    mode: str = "Normal"
    model: str = "openai/gpt-oss-120b"

class ChatResponse(BaseModel):
    response: str

# ---------------------------------------------------------------------------
# Mode-Specific System Prompts
# ---------------------------------------------------------------------------
# Normal: direct, natural answers.
# Friendly: warm and conversational.
# Tutor: explain step-by-step using simple examples.
# Research: provide deeper explanations, but do not claim to perform live web research.
MODE_SYSTEM_PROMPTS = {
    "Normal": (
        "You are Rem, an intelligent, helpful, and concise AI assistant. "
        "Provide direct, natural, and accurate answers."
    ),
    "Friendly": (
        "You are Rem, a warm, approachable, and enthusiastic AI assistant. "
        "Use a casual, welcoming, and friendly conversational tone."
    ),
    "Tutor": (
        "You are Rem, a patient and pedagogical AI tutor. "
        "Explain concepts step-by-step using clear language and simple examples. "
        "Focus on helping the student understand rather than just giving raw answers."
    ),
    "Research": (
        "You are Rem, a thoughtful and thorough analytical AI assistant. "
        "Provide deeper, well-structured explanations and explore nuances of the topic. "
        "Do not claim to perform live web browsing or real-time web research."
    )
}

# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------
@app.get("/")
def read_root():
    return {"status": "ok", "app": "Rem AI Backend"}

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(payload: ChatRequest):
    """
    POST /chat
    Receives user message, chat mode, and selected model.
    Calls Groq API and returns the AI response.
    """
    api_key = os.getenv("GROQ_API_KEY", "").strip()

    # Graceful check for missing or default placeholder API key
    if not api_key or api_key == "your_groq_api_key_here":
        return ChatResponse(
            response=(
                "⚠️ Groq API Key is not configured yet. "
                "Please add your GROQ_API_KEY inside 'backend/.env' and restart the backend server."
            )
        )

    # Determine system prompt based on mode
    system_prompt = MODE_SYSTEM_PROMPTS.get(
        payload.mode,
        MODE_SYSTEM_PROMPTS["Normal"]
    )

    try:
        # Initialize official Groq client
        client = Groq(api_key=api_key)

        # Call Groq Chat Completions API
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": payload.message}
            ],
            model=payload.model,
            temperature=0.7,
        )

        ai_message = chat_completion.choices[0].message.content
        return ChatResponse(response=ai_message)

    except Exception as e:
        error_message = str(e)
        print(f"[Rem Backend Error] {error_message}")
        # Return graceful descriptive error to the frontend
        return ChatResponse(
            response=f"Error connecting to Groq API ({payload.model}): {error_message}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
