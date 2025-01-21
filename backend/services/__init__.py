from flask_socketio import emit # type: ignore

socketio = None

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