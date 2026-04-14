def register_schema(data):
    return {
        "name": data.get("name"),
        "email": data.get("email"),
        "password": data.get("password"),
        "isSubscribed": False,
        "subscriptionStart": None,
        "subscriptionEnd": None
    }
    
def login_schema(data):
    return {
        "email": data.get("email"),
        "password": data.get("password")
    }
    
def admin_schema(data):
    return {
        "email": "admin@gmail.com",
        "password": "admin123"
    }