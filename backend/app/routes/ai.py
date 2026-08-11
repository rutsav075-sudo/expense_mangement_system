import os
import httpx
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
from app.config import settings

router = APIRouter(prefix="/api/ai", tags=["ai"])

class ChatMessage(BaseModel):
    role: str # "user" or "model" / "assistant"
    content: str
    
class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = "gemini-1.5-flash"
    image_data: Optional[str] = None # Base64 image data

@router.post("/chat")
async def ai_chat(request: Request, body: ChatRequest):
    # Try to get keys from headers (BYOK), fallback to env
    gemini_key = request.headers.get("x-gemini-key") or settings.GEMINI_API_KEY
    openai_key = request.headers.get("x-openai-key")
    anthropic_key = request.headers.get("x-anthropic-key")
    
    model = body.model.lower() if body.model else "gemini-1.5-flash"
    
    try:
        async with httpx.AsyncClient() as client:
            if "gpt" in model:
                if not openai_key:
                    raise HTTPException(status_code=400, detail="OpenAI API Key not provided. Please set it in Settings.")
                
                # OpenAI Format
                oai_messages = [{"role": "assistant" if m.role == "model" else "user", "content": m.content} for m in body.messages]
                if body.image_data:
                    # Append image to the last message
                    oai_messages[-1]["content"] = [
                        {"type": "text", "text": body.messages[-1].content},
                        {"type": "image_url", "image_url": {"url": body.image_data}}
                    ]
                    
                resp = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {openai_key}"},
                    json={"model": model, "messages": oai_messages}
                )
                if not resp.is_success:
                    raise Exception(resp.text)
                return {"response": resp.json()["choices"][0]["message"]["content"]}
                
            elif "claude" in model:
                if not anthropic_key:
                    raise HTTPException(status_code=400, detail="Anthropic API Key not provided. Please set it in Settings.")
                
                # Anthropic Format
                anth_messages = [{"role": "assistant" if m.role == "model" else "user", "content": m.content} for m in body.messages]
                
                resp = await client.post(
                    "https://api.anthropic.com/v1/messages",
                    headers={
                        "x-api-key": anthropic_key,
                        "anthropic-version": "2023-06-01"
                    },
                    json={"model": model, "messages": anth_messages, "max_tokens": 1024}
                )
                if not resp.is_success:
                    raise Exception(resp.text)
                return {"response": resp.json()["content"][0]["text"]}
                
            else:
                # Gemini
                if not gemini_key:
                    raise HTTPException(status_code=400, detail="Gemini API Key not provided.")
                
                # Gemini Format
                gemini_contents = []
                for m in body.messages:
                    gemini_contents.append({
                        "role": "user" if m.role == "user" else "model",
                        "parts": [{"text": m.content}]
                    })
                    
                if body.image_data:
                    # Parse data:image/png;base64,...
                    mime_type = body.image_data.split(";")[0].split(":")[1]
                    base64_data = body.image_data.split(",")[1]
                    gemini_contents[-1]["parts"].append({
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": base64_data
                        }
                    })
                
                # Map to correct API model names
                api_model = model
                if model == "gemini-1.5-flash":
                    api_model = "gemini-1.5-flash-latest"
                elif model == "gemini-1.5-pro":
                    api_model = "gemini-1.5-pro-latest"
                
                # Use v1beta for Gemini
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{api_model}:generateContent?key={gemini_key}"
                resp = await client.post(url, json={"contents": gemini_contents})
                if not resp.is_success:
                    # Try to parse the JSON error message
                    try:
                        error_data = resp.json()
                        error_msg = error_data.get("error", {}).get("message", resp.text)
                    except:
                        error_msg = resp.text
                    
                    if resp.status_code == 400 and "API key not valid" in error_msg:
                        raise HTTPException(status_code=400, detail="Invalid Gemini API Key provided.")
                        
                    raise Exception(f"Gemini API Error: {error_msg}")
                
                data = resp.json()
                try:
                    text = data["candidates"][0]["content"]["parts"][0]["text"]
                    return {"response": text}
                except KeyError:
                    return {"response": "Received an empty response from Gemini."}
                    
    except Exception as e:
        print(f"AI Router Error: {str(e)}")
        # Raise generic 500 error if it's a generic exception
        raise HTTPException(status_code=500, detail=str(e))
