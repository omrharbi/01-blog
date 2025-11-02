import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

URL = "http://localhost:9090/auth/register"
TOTAL_USERS = 100_000  # adjust if needed
MAX_WORKERS = 100000      # number of concurrent threads

def register_user(i):
    """Registers a single user and returns result."""
    data = {
        "firstname": "test",
        "lastname": "test",
        "username": f"testuserl{i}",
        "email": f"testl{i}@gmail.com",
        "password": "pass123",
        "confirmpassword": "pass123"
    }

    try:
        res = requests.post(URL, json=data, timeout=5)
        if res.status_code in (200, 201):
            return f"✅ User {i} registered"
        else:
            return f"❌ User {i} failed: {res.status_code} - {res.text[:100]}"
    except Exception as e:
        return f"⚠️ User {i} error: {e}"

def main():
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = [executor.submit(register_user, i) for i in range(TOTAL_USERS)]
        for future in as_completed(futures):
            print(future.result())

if __name__ == "__main__":
    main()
