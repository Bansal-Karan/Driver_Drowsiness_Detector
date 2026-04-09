def register_schema(data):
    return {
        "name": data.get("name"),
        "email": data.get("email"),
        "password": data.get("password"),
        "isSubscribed": False
    }
    
def login_schema(data):
    return {
        "email": data.get("email"),
        "password": data.get("password")
    }