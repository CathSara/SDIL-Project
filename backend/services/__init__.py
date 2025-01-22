from flask_socketio import emit # type: ignore


socketio = None
min_precision = 5 # +/- 5 miligrams accuracy

def init_services(socketio_instance):
    global socketio
    socketio = socketio_instance

def open_box(box_id):
    from backend.models.database_service import set_box_open_closed
    set_box_open_closed(box_id, True)
    # TODO notify arduino to open box


def close_box(box_id):
    from backend.models.database_service import set_box_open_closed
    set_box_open_closed(box_id, False)
    # go through items in this box id and set taken by status
    # notify frontend that box has been closed


def notify_frontend(item_status):
    from . import socketio
    socketio.emit('item_update', {'status': item_status})
    
    
def register_storage_weight_change(box_id, weight_change):
    from backend.models.database_service import update_item_state
    weight_change = int(weight_change)
    items = determine_item(box_id, weight_change)
    if len(items) == 1:
        item = items[0]
        state = "stored" if weight_change > 0 else "picked"
        update_item_state(item.id, state)
        notify_frontend(state)
        return items
    else: # handle multiple items in question
        print("the box with boxId", box_id, "is confused")
        return items


def determine_item(box_id, weight_change):
    from backend.models.database_service import get_items
    """
    Determines the list of items that could be plausibly picked or stored with the weight change.

    Args:
        box_id (number): box to filter
        weight_change (number): change in miligrams (positive, if weight was added; negative, if weight was removed)

    Returns:
        list of Item: If the list has exactly one entry, the system is confident about the picked/stored item.
    """
    items = get_items(box_id=box_id)

    if weight_change > 0:
        state_filter = "picked" # only look at prev. picked item (positive weight change)
    else:
        state_filter = "stored" # only look at prev. stored item (negative weight change)
        
    print("remove items that are not:", state_filter)

    filtered_items = [
        item for item in items
        if not (abs(item.weight - abs(weight_change)) > min_precision or item.item_state != state_filter)
    ]
    return filtered_items