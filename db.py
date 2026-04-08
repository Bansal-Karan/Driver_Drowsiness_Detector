from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["drowsiness_db"]

# Collections
users_collection = db["users"]