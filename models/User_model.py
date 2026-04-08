def register_schema(data):
    return {
        "username": data.get("username"),
        "password": data.get("password"),
        "isSubscribed": False
    }
    
def login_schema(data):
    return {
        "username": data.get("username"),
        "password": data.get("password")
    }