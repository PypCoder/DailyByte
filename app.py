from flask import Flask, jsonify, Blueprint
import requests, random, time

app = Flask(__name__)
api = Blueprint('api', __name__, url_prefix='/api')

lat, lon = "", ""

cache = {}
CACHE_TTL = 300

@api.route("/user/location")
def getUserLoc():
    global lat, lon
    now = time.time()
    if "location" in cache and now - cache["location"]["time"] < CACHE_TTL:
        return jsonify(cache["location"]["data"])
    response = requests.get("http://ip-api.com/json/")
    loc = response.json()
    lon, lat = loc.get("lon", ""), loc.get("lat", "")  # lon first!
    data = {
        "city": loc.get("city", ""),
        "region": loc.get("regionName", ""),
        "country": loc.get("country", ""),
        "lon": lon,
        "lat": lat,
    }
    cache["location"] = {"time": now, "data": data}
    return jsonify(data)

@api.route("/weather")
def getWeather():
    if lat == "" or lon == "":
        return jsonify({"error": "Location not set!"})
    now = time.time()
    if "weather" in cache and now - cache["weather"]["time"] < CACHE_TTL:
        return jsonify(cache["weather"]["data"])
    response = requests.get(
        f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&temperature_unit=celsius"
    )
    data = response.json().get("current_weather", {})
    cache["weather"] = {"time": now, "data": data}
    return jsonify(data)

@api.route("/currency/rates")
def getCurrencyRates():
    now = time.time()
    if "rates" in cache and now - cache["rates"]["time"] < 3600:
        return jsonify(cache["rates"]["data"])
    response = requests.get("https://v6.exchangerate-api.com/v6/ba88ae0170d42c014d4ed407/latest/USD")
    data = response.json().get("conversion_rates", {})  # Correct key for exchangerate-api
    cache["rates"] = {"time": now, "data": data}
    return jsonify(data)

@api.route("/quote")
def getQuote():
    now = time.time()
    if "quote" in cache and now - cache["quote"]["time"] < 10:
        return jsonify(cache["quote"]["data"])
    headers = {
        "X-Api-Key": "ESJb3ZjTWVu1JJUOfO6y8g==5gUPyJ8SqigtFpNS"
    }
    response = requests.get("https://api.api-ninjas.com/v1/quotes", headers=headers)
    data = response.json()
    cache["quote"] = {"time": now, "data": data}
    return jsonify(data)

@api.route("/fact")
def getFact():
    now = time.time()
    if "fact" in cache and now - cache["fact"]["time"] < 10:
        return jsonify(cache["fact"]["data"])
    response = requests.get("https://uselessfacts.jsph.pl/random.json?language=en").json()
    cache["fact"] = {"time": now, "data": response}
    return jsonify(response)

@api.route("/joke")
def getJoke():
    now = time.time()
    if "joke" in cache and now - cache["joke"]["time"] < 10:
        return jsonify(cache["joke"]["data"])
    response = requests.get("https://v2.jokeapi.dev/joke/Any?type=single&safe-mode=False").json()
    cache["joke"] = {"time": now, "data": response}
    return jsonify(response)

@api.route("/activity")
def getActivity():
    now = time.time()
    if "activity" in cache and now - cache["activity"]["time"] < 10:
        return jsonify(cache["activity"]["data"])
    response = requests.get("https://bored-api.appbrewery.com/random").json()
    cache["activity"] = {"time": now, "data": response}
    return jsonify(response)

@api.route("/pet")
def getPet():
    now = time.time()
    if "pet" in cache and now - cache["pet"]["time"] < 10:
        return jsonify(cache["pet"]["data"])
    if random.choice([0, 1]):
        response = requests.get("https://api.thecatapi.com/v1/images/search").json()
        data = {
            "pet": response[0].get("url", ""),
            "type": "Cat",
        }
    else:
        response = requests.get("https://dog.ceo/api/breeds/image/random").json()
        data = {
            "pet": response.get("message", ""),  # Corrected here
            "type": "Dog",
        }
    cache["pet"] = {"time": now, "data": data}
    return jsonify(data)

# Register the blueprint with Flask app
app.register_blueprint(api)

if __name__ == "__main__":
    app.run(debug=True)
