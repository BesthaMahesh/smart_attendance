import base64
import cv2
import numpy as np
import face_recognition
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Smart Attendance Pro Face Recognition Service")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmbeddingRequest(BaseModel):
    images: List[str]

class Candidate(BaseModel):
    id: str
    embedding: List[float]

class CompareRequest(BaseModel):
    probe: str
    candidates: List[Candidate]
    threshold: float = 0.6

def decode_base64_image(base64_str: str):
    try:
        if "," in base64_str:
            base64_str = base64_str.split(",")[1]
        img_data = base64.b64decode(base64_str)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is not None:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        return img
    except Exception as e:
        print(f"Error decoding base64 image: {e}")
        return None

@app.post("/compute-embedding")
async def compute_embedding(req: EmbeddingRequest):
    embeddings = []
    
    for idx, img_b64 in enumerate(req.images):
        img = decode_base64_image(img_b64)
        if img is None:
            continue
            
        face_locations = face_recognition.face_locations(img)
        if len(face_locations) == 0:
            continue
            
        encodings = face_recognition.face_encodings(img, face_locations)
        if len(encodings) > 0:
            embeddings.append(encodings[0])
            
    if len(embeddings) == 0:
        raise HTTPException(status_code=400, detail="No faces detected in any of the provided images.")
        
    avg_embedding = np.mean(embeddings, axis=0).tolist()
    return {"embedding": avg_embedding, "samples_processed": len(embeddings)}

@app.post("/compare-faces")
async def compare_faces(req: CompareRequest):
    img = decode_base64_image(req.probe)
    if img is None:
        raise HTTPException(status_code=400, detail="Invalid probe image.")
        
    face_locations = face_recognition.face_locations(img)
    if len(face_locations) == 0:
        return {"match": None, "distance": None, "message": "No face detected in video stream."}
        
    probe_encodings = face_recognition.face_encodings(img, face_locations)
    if len(probe_encodings) == 0:
        return {"match": None, "distance": None, "message": "Failed to compute embedding from probe."}
        
    probe_emb = probe_encodings[0]
    
    if not req.candidates:
        return {"match": None, "distance": None, "message": "No candidates provided."}
        
    candidate_embeddings = [np.array(c.embedding) for c in req.candidates]
    candidate_ids = [c.id for c in req.candidates]
    
    distances = face_recognition.face_distance(candidate_embeddings, probe_emb)
    
    best_idx = np.argmin(distances)
    best_distance = float(distances[best_idx])
    
    if best_distance <= req.threshold:
        return {
            "match": candidate_ids[best_idx],
            "distance": best_distance
        }
    else:
        return {
            "match": None,
            "best_distance": best_distance,
            "message": "Face detected but threshold exceeded (no match found)."
        }

@app.get("/")
async def health_check():
    return {"status": "healthy", "service": "face-recognition-api"}
