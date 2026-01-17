from Backend.llm_selector import LLMModelSelector
import google.generativeai as genai

genai.configure(api_key="YOUR_GEMINI_API_KEY")

selector = LLMModelSelector()

model_config = selector.select_model(
    mode="general",
    difficulty="beginner"
)

model = genai.GenerativeModel(model_config["name"])

response = model.generate_content(
    "Explain Operating System in simple terms",
    generation_config={
        "temperature": model_config["temperature"],
        "max_output_tokens": model_config["max_tokens"]
    }
)

print(response.text)
