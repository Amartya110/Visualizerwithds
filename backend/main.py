from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add current directory to sys.path to ensure modules can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from tracer_python import trace_python_code
# from tracer_cpp import trace_cpp_code # implementation pending

app = FastAPI(root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeSubmission(BaseModel):
    code: str
    language: str
    testcases: list[str] # List of input strings

@app.get("/")
def read_root():
    return {"message": "CodeHurdleVisualizer Backend"}

@app.post("/simulate")
def simulate_code(submission: CodeSubmission):
    if submission.language == "python":
        try:
            # For MVP, we process the first testcase or all.
            # Let's assume we return traces for all testcases.
            results = []
            for test_input in submission.testcases:
                trace_data = trace_python_code(submission.code, test_input)
                results.append({"input": test_input, "trace": trace_data})
            return {"results": results}
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
    elif submission.language == "cpp":
        return {"message": "C++ support coming soon"}
    else:
        raise HTTPException(status_code=400, detail="Unsupported language")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
