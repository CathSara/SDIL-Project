from sqlalchemy import or_
from backend import db
from backend.models.models import User, Item, Box, Favorite
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta, timezone

from backend.services import notify_frontend

##### BOX #####

def create_box(name, location, box_picture_path, maps_link):
    """
    Create a new box.
    """
    box = Box(name=name, location=location, box_picture_path=box_picture_path, maps_link=maps_link)
    db.session.add(box)
    db.session.commit()
    return box


def get_all_boxes():
    """
    List all boxes.
    """
    return Box.query.all()


def get_box_by_id(box_id):
    """
    View box detail.
    """
    return Box.query.get(box_id)


def set_box_open_closed(box_id, user_id=None, open=False):
    box = get_box_by_id(box_id)
    box.opened = open
    if user_id:
        box.opened_by_id = user_id
    db.session.commit()
    return box


##### USER #####

def create_user(phone_number, first_name, last_name, password_raw, profile_picture_path):
    """
    Create a new user (first checks whether phone number has already been used).
    """
    user = User.query.filter_by(phone_number=phone_number).first()
    if user:
        return False
    
    password = generate_password_hash(password_raw)
    current_time = datetime.now(timezone.utc)

    user = User(phone_number=phone_number, first_name=first_name, last_name=last_name, password=password, created_at=current_time, is_confirmed=False, profile_picture_path=profile_picture_path)
    db.session.add(user)
    db.session.commit()
    return user, True


def confirm_user(user_id, token):
    """
    Confirms user through phone number (token is always "1234").
    """
    user = User.query.filter_by(id=user_id).first()
    if user and token == "1234":
        user.is_confirmed = True
        db.session.commit()
    return user, user.is_confirmed


def authenticate_user(phone_number, password):
    """
    Authenticates user if account exists, the password matches, and the account is confirmed via phone numnber.
    """
    user = User.query.filter_by(phone_number=phone_number).first()
    if user and check_password_hash(user.password, password) and user.is_confirmed:
        return user, True
    else:
        return user, False
    

def get_all_users():
    """
    List all users.
    """
    return User.query.all()


def get_user_by_id(user_id):
    """
    Returns a single user by id.
    """
    return User.query.get(user_id)


##### ITEM #####

def create_item(image_path, category, title, description, condition, weight, box, created_by, item_state):
    """
    Add a new item to a box.
    """
    current_time = datetime.now(timezone.utc)
    box_object = get_box_by_id(box)
    item = Item(
        image_path=image_path,
        category=category,
        title=title,
        description=description,
        condition=condition,
        weight=weight,
        box=box_object,
        created_by=created_by,
        created_at=current_time,
        item_state=item_state
    )
    db.session.add(item)
    db.session.commit()
    return item


def update_item_state(item_id, state):
    """
    Mark a specified item with a new state.
    """
    item = Item.query.get(item_id)
    if item:
        item.item_state = state
        db.session.commit()
        notify_frontend(state)
        if state == "scanned":
            notify_frontend({
                "id": item.id,
                "image_path": item.image_path,
                "category": item.category,
                "title": item.title,
                "description": item.description,
                "condition": item.condition,
            }, "item_scan")
        return item
    return None


def update_item_as_reserved(item_id, reserved_by_user_id):
    """
    Marks a specified item as reserved.
    """
    item = Item.query.get(item_id)
    check_and_update_reservation(item)
    user = User.query.get(reserved_by_user_id)
    if not item:
        return "item_error"
    
    if not user:
        return "user_error"
    if item.reserved_by_id != None:
        return "conflict"
    
    current_time = datetime.now(timezone.utc)
    new_time = current_time + timedelta(minutes=20)
    item.reserved_by_id = reserved_by_user_id
    item.reserved_at = current_time
    item.reserved_until = new_time
    db.session.commit()
    return "success"


def update_item(item_id, title=None, description=None, category=None, condition=None, image_path=None, item_state=None):
    item = Item.query.get(item_id)
    check_and_update_reservation(item)
    if not item:
        return "item_error"
    
    if title:
        item.title = title
    if description:
        item.description = description
    if category:
        item.category = category
    if condition:
        item.condition = condition
    if image_path:
        item.image_path = image_path
    if item_state:
        notify_frontend(item_state)
        if item_state == "scanned":
            notify_frontend({
                "id": item.id,
                "image_path": item.image_path,
                "category": item.category,
                "title": item.title,
                "description": item.description,
                "condition": item.condition,
            }, "item_scan")
        if item_state == "stored" and item.item_state == "scanned": # i.e., state transtition from scanned to stored
            notify_frontend({
                "id": item.id,
                "image_path": item.image_path,
                "category": item.category,
                "title": item.title,
                "description": item.description,
                "condition": item.condition,
            }, "item_scan_stored")
        if item_state == "disallowed":
            notify_frontend({
                "id": item.id
            }, "not_allowed_item_scan")
        item.item_state = item_state
    db.session.commit()
    return item


def update_item_as_unreserved(item_id, reserved_by_user_id):
    item = Item.query.get(item_id)
    check_and_update_reservation(item)
    if not item:
        return "item_error"
    if item.reserved_by_id == int(reserved_by_user_id):
        print("enter")
        item.reserved_by_id = None
        item.reserved_at = None
        item.reserved_until = None
        db.session.commit()
        return "success"
    else:
        return "conflict"


def check_and_update_reservation(item):
    """
    Checks if the item's reservation has expired and unreserves it if necessary.
    Lazy database checkup!
    """
    if item.reserved_until:
        reserved_until_aware = item.reserved_until.replace(tzinfo=timezone.utc)

        if reserved_until_aware < datetime.now(timezone.utc):
            item.reserved_by_id = None
            item.reserved_at = None
            item.reserved_until = None
            db.session.commit()


def get_item_by_id(item_id):
    """
    Returns a single item by id, and increases the number_of_views counter of the item.
    """
    item = Item.query.get(item_id)

    if item:
        check_and_update_reservation(item)
        item.number_of_views += 1
        db.session.commit()
    return item


def delete_item_by_id(item_id):
    """
    Deletes an item by its ID.
    """
    item = Item.query.get(item_id)
    if item:
        db.session.delete(item)
        db.session.commit()
        return True
    return False



def get_items(box_id=None, category=None, search_string=None):
    """
    Retrieves all items, optionally filtered by box, category, or search_string.
    """
    query = Item.query
    
    if box_id:
        query = query.filter_by(box_id=box_id)
    
    if category:
        query = query.filter_by(category=category)
    
    if search_string:
        query = query.filter(
            or_(
                Item.title.like(f"%{search_string}%"),
                Item.description.like(f"%{search_string}%")
            )
        )

    items = query.all()

    for item in items:
        check_and_update_reservation(item)

    return items


def get_reserved_items(user_id):
    user = User.query.get(user_id)
    if not user:
        return None
    
    return Item.query.filter(Item.reserved_by_id == user_id).all()


def is_item_reserved(item_id):
    item = Item.query.get(item_id)
    if item.reserved_by_id:
        return True
    else:
        return False


##### FAVORITE #####

def add_favorite(user_id, item_id):
    if not is_item_favorited(user_id, item_id):
        favorite = Favorite(user_id=user_id, item_id=item_id)
        db.session.add(favorite)
        db.session.commit()
        return True
    return False


def remove_favorite(user_id, item_id):
    favorite = Favorite.query.filter_by(user_id=user_id, item_id=item_id).first()
    if favorite:
        db.session.delete(favorite)
        db.session.commit()
        return True
    return False


def is_item_favorited(user_id, item_id):
    return Favorite.query.filter_by(user_id=user_id, item_id=item_id).count() > 0


def get_user_favorites(user_id):
    user = User.query.get(user_id)
    if not user:
        return None
    
    return db.session.query(Item).join(Favorite).filter(Favorite.user_id == user_id).all()


##### GENERAL #####

def delete_all_rows():
    """
    Resets database.
    """
    models = [Item, Box, User]
    for model in models:
        model.query.delete()