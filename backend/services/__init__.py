from flask_socketio import emit # type: ignore
import requests # type: ignore

socketio = None
min_precision = 5 # +/- 5 miligrams accuracy
demo = True

def init_services(socketio_instance):
    global socketio
    socketio = socketio_instance
    

def open_box(box_id, user_id):
    from backend.models.database_service import set_box_open_closed
    set_box_open_closed(box_id, user_id, False)
    print("box with id", box_id, "has been notified to be opened")
    
    if not demo:
        url = 'http://172.20.10.14'

        try:
            headers = {'Content-Type': 'text/plain'}
            response = requests.post(url, data='door/unlock', headers=headers, timeout=5)

            if response.status_code == 200:
                print("The door has been unlocked successfully.")
            else:
                print(f"Failed to unlock the door. Status code: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"Error sending request: {e}")
        

def confirm_box_open(box_id):
    from backend.models.database_service import set_box_open_closed, get_box_by_id
    box = get_box_by_id(box_id)
    notify_frontend({
        'box_id': box_id,
        'user_id': box.opened_by_id
    }, "open")
    set_box_open_closed(box_id, True)
    print("box with id", box_id, "has been opened")


def close_box(box_id):
    from backend.models.database_service import set_box_open_closed
    set_box_open_closed(box_id, False)
    clear_picked_unstored_items(box_id) # remving picked items, and items that have been scanned but never stored after closing the box
    notify_frontend({
        'box_id': box_id,
    }, "close")
    print("box with id", box_id, "has been closed")


def notify_frontend(item_status, message='item_update'):
    from . import socketio
    socketio.emit(message, {'data': item_status})
    print("Notifying frontend about", message, "with data:", item_status)
    
    
def resolve_conflict(item_id, confusion_source):
    from backend.models.database_service import get_item_by_id, update_item
    item = get_item_by_id(item_id)
    update_item(item.id, item_state=confusion_source)
    notify_frontend(confusion_source)
    return item


def register_scanning_weight_change(box_id, weight_change):
    from backend.models.database_service import get_box_by_id, get_user_by_id
    box = get_box_by_id(box_id)
    #created_by = get_user_by_id(box.opened_by_id)
    created_by = get_user_by_id(1)
    if weight_change > 0:
        from backend.models.database_service import create_item
        item = create_item("no_path", "no_category", "no_title", "no_description", "no_condition", weight=weight_change, box=box_id, created_by=created_by, item_state="created")
        print("Item was created with id: " + str(item.id))
        from backend.services.camera import capture_image_for_item
        capture_image_for_item(item.id)
        
    
def register_storage_weight_change(box_id, weight_change):
    from backend.models.database_service import update_item
    weight_change = int(weight_change)
    state = "stored" if weight_change > 0 else "picked"
    items = determine_item(box_id, weight_change)
    if len(items) == 0:
        if weight_change > 0:
            notify_frontend({
                'message': 'You added an unknown item to storage compartment. Please scan the item before putting it inside the scanning compartment.'
            }, "alert")
        else:
            notify_frontend({
                'message': 'It seems like you have picked more than one item at once. Please put both items back and proceed picking the items one-by-one, so that we know which items you have taken.'
            }, "alert")
        return items
    if len(items) == 1:
        item = items[0]
        update_item(item.id, item_state=state)
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
    
    for item in items:
        if (abs(item.weight - abs(weight_change)) < min_precision and item.item_state=="scanned"):
            filtered_items.append(item)
            
    print("filtered items:")
    for item in filtered_items:
        print("item_id", item.id, "item_state", item.item_state)
    
    return filtered_items


def clear_picked_unstored_items(box_id):
    from backend.models.database_service import get_items, delete_item_by_id
    items = get_items(box_id=box_id)
    
    for item in items:
        if item.item_state == "scanned" or item.item_state == "picked":
            delete_item_by_id(item.id)