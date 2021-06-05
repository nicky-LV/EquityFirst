from .classes import Redis


def get_data(key: str):
    db = Redis()
    try:
        available_data = db.get(key=key)
    except KeyError:
        available_data = {}

    return available_data
