# db.py
from pymongo import MongoClient

MONGO_URI = "mongodb+srv://aiannotattiontoll:f0KKe0jyVzzC8zas@cluster.5rjqpuc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster"
client = MongoClient(MONGO_URI)

# Connect to your DB and collection
db = client["annotation_tool"]           # Your database name
users_collection = db["hpawar"]            # Your collection name
