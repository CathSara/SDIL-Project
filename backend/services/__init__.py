from flask_socketio import emit # type: ignore


socketio = None
min_precision = 5 # +/- 5 miligrams accuracy

def init_services(socketio_instance):
    global socketio
    socketio = socketio_instance
    

def open_box(box_id, user_id):
    from backend.models.database_service import set_box_open_closed
    set_box_open_closed(box_id, user_id, False)
    print("box with id", box_id, "has been notified to be opened")
    # TODO send open box request to arduino
        

def confirm_box_open(box_id):
    from backend.models.database_service import set_box_open_closed, get_box_by_id
    box = get_box_by_id(box_id)
    set_box_open_closed(box_id, None, True)
    notify_frontend({
        'box_id': box_id,
        'user_id': box.opened_by_id
    }, "open")
    print("box with id", box_id, "has been opened")


def close_box(box_id):
    from backend.models.database_service import set_box_open_closed
    set_box_open_closed(box_id, False)
    # go through items in this box id and set taken by status
    # notify frontend that box has been closed
    notify_frontend({
        'box_id': box_id,
    }, "close")
    print("box with id", box_id, "has been closed")


def notify_frontend(item_status, message='item_update'):
    from . import socketio
    socketio.emit(message, {'data': item_status})
    
    
def resolve_conflict(item_id, confusion_source):
    from backend.models.database_service import get_item_by_id, update_item_state
    item = get_item_by_id(item_id)
    update_item_state(item.id, confusion_source)
    notify_frontend(confusion_source)
    return item


def register_scanning_weight_change(box_id, weight_change):
    from backend.models.database_service import get_box_by_id, get_user_by_id
    box = get_box_by_id(box_id)
    created_by = get_user_by_id(box.opened_by_id)
    if weight_change > 0:
        from backend.models.database_service import create_item
        item = create_item("no_path", "no_category", "no_title", "no_description", "no_condition", weight_change, box, created_by, item_state="created")
        
    
    
def register_storage_weight_change(box_id, weight_change):
    from backend.models.database_service import update_item_state
    weight_change = int(weight_change)
    state = "stored" if weight_change > 0 else "picked"
    items = determine_item(box_id, weight_change)
    if len(items) == 0:
        pass # TODO if positive, notify that there was an item added which is unknown
    if len(items) == 1:
        item = items[0]
        update_item_state(item.id, state)
        notify_frontend(state)
        return items
    else: # handle multiple items in question
        notify_frontend({
            'status': 'confused',
            'box_id': box_id,
            'confusion_source': state,
            'items': [{'id': item.id, 'title': item.title, 'description': item.description, 'image_path': item.image_path} for item in items]
        }, "confused")
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