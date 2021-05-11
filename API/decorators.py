from rest_framework.exceptions import ValidationError


def validated_data_required(func):
    def func_wrapper(class_instance, *args):
        if class_instance.is_valid():
            return func(class_instance, *args)

        else:
            raise ValidationError("Validated data is required to calculate moving averages.")

    return func_wrapper
