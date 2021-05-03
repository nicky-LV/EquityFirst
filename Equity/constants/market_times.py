import datetime


def check_market_open():
    now = datetime.datetime.now()
    # If today is a weekday (mon - fri)
    if 1 <= now.isoweekday() <= 5:
        if 4 <= now.hour <= 20:
            if now.hour == 4:
                # Time is 04.xx where xx >= 30
                if now.minute >= 30:
                    return True

                # Time is 04.xx where xx < 30
                else:
                    return False

            # Hours are 5 >= x <= 20
            else:
                return True

        # Hours out of range
        else:
            return False

