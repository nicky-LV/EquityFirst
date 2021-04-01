from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# future: calculate moving average for n days.


@api_view(["GET", "POST"])
def moving_average(request):
    if request.method == "POST":
        time_series = list(request.data['data'])
        print(time_series)

        moving_averages = []
        price_sum = 0

        for i in range(len(sorted(time_series, key=lambda x: x))):
            datapoint = time_series[i]
            time, price = datapoint['time'], datapoint['price']

            if i == 0:
                price_sum += float(price)

                moving_averages.append({
                    "time": time,
                    "price": price_sum
                })

            else:
                price_sum += float(price)

                moving_averages.append({
                    "time": time,
                    "price": price_sum / (i + 1)
                })

        return Response(data=moving_averages, status=status.HTTP_200_OK)