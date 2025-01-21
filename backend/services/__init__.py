from backend.models.database_service import set_box_open_closed


def open_box(box_id):
    set_box_open_closed(box_id, True)
    # TODO notify arduino to open box


def close_box(box_id):
    set_box_open_closed(box_id, False)
    # go through items in this box id and set taken by status
    # notify frontend that box has been closed