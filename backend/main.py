from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
from datetime import datetime

app = FastAPI()

# Allow the frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CallEvent(BaseModel):
    caller_name: str
    time_of_day: str  # "morning", "business_hours", "evening"

@app.post("/api/missed-call")
async def handle_missed_call(event: CallEvent):
    # SIMULATING THE LOGIC
    # In the real tool, this would query your CRM and check Twilio status.
    
    response_text = ""
    action_taken = ""
    delay = 2  # Seconds to wait before sending text

    if event.time_of_day == "evening":
        response_text = "Hi! I'm away from the desk right now. Feel free to book a time on my calendar here: cal.com/coepi"
        action_taken = "Auto-Reply (After Hours Mode)"
    
    elif event.caller_name.lower() == "vip client":
        response_text = "Hey! Saw I just missed you. Wrapping up a call, will ring you back in 5."
        action_taken = "Priority Response (VIP List)"
        delay = 1
        
    else:
        # Standard Business Hours
        variations = [
            "Sorry I missed you! Can I text you back in a bit?",
            " missed your call. Is this urgent? I'm in a meeting.",
            "Hey, thanks for calling. Please leave a text and I'll get back to you!"
        ]
        response_text = random.choice(variations)
        action_taken = "Standard Auto-Response"

    return {
        "status": "success",
        "action": action_taken,
        "message_body": response_text,
        "simulated_delay": delay,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
