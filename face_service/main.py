import base64
import cv2
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Smart Attendance Pro Face Recognition Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load OpenCV pre-trained Haar Cascade face detector
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

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
        return img
    except Exception as e:
        print(f"Error decoding base64 image: {e}")
        return None

def extract_face_feature_vector(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    
    if len(faces) == 0:
        return None
        
    # Get largest face bounding box
    (x, y, w, h) = max(faces, key=lambda rect: rect[2] * rect[3])
    face_roi = gray[y:y+h, x:x+w]
    
    # Resize ROI to a fixed 64x64 feature grid
    resized = cv2.resize(face_roi, (64, 64), interpolation=cv2.INTER_AREA)
    
    # Compute normalized histogram & spatial features (128 dimensions)
    hist = cv2.calcHist([resized], [0], None, [64], [0, 256]).flatten()
    
    # Downsampled spatial grid (64 dims)
    spatial = cv2.resize(resized, (8, 8)).flatten().astype(np.float32)
    
    # Concatenate histogram + spatial features -> 128 dimensions
    feature_vec = np.concatenate([hist, spatial])
    
    # L2 normalize
    norm = np.linalg.norm(feature_vec)
    if norm > 0:
        feature_vec = feature_vec / norm
        
    return feature_vec.tolist()

@app.post("/compute-embedding")
async def compute_embedding(req: EmbeddingRequest):
    embeddings = []
    
    for idx, img_b64 in enumerate(req.images):
        img = decode_base64_image(img_b64)
        if img is None:
            continue
            
        feat = extract_face_feature_vector(img)
        if feat is not None:
            embeddings.append(feat)
            
    if len(embeddings) == 0:
        raise HTTPException(status_code=400, detail="No faces detected in any of the provided images.")
        
    avg_embedding = np.mean(embeddings, axis=0).tolist()
    return {"embedding": avg_embedding, "samples_processed": len(embeddings)}

@app.post("/compare-faces")
async def compare_faces(req: CompareRequest):
    img = decode_base64_image(req.probe)
    if img is None:
        raise HTTPException(status_code=400, detail="Invalid probe image.")
        
    probe_emb = extract_face_feature_vector(img)
    if probe_emb is None:
        return {"match": None, "distance": None, "message": "No face detected in video stream."}
        
    if not req.candidates:
        return {"match": None, "distance": None, "message": "No candidates provided."}
        
    probe_arr = np.array(probe_emb)
    
    best_match = None
    best_distance = float('inf')
    
    for candidate in req.candidates:
        cand_arr = np.array(candidate.embedding)
        # Cosine distance
        dot = np.dot(probe_arr, cand_arr)
        distance = 1.0 - dot
        if distance < best_distance:
            best_distance = distance
            best_match = candidate.id
            
    if best_distance <= req.threshold:
        return {
            "match": best_match,
            "distance": float(best_distance)
        }
    else:
        return {
            "match": None,
            "best_distance": float(best_distance),
            "message": "Face detected but threshold exceeded (no match found)."
        }

@app.get("/")
async def health_check():
    return {"status": "healthy", "service": "face-recognition-api"}
