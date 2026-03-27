from flask import Flask
app = Flask(__name__)

@app.route("/")
def home():
    return "AI Professor backend is working!"

app.run(debug=True)
