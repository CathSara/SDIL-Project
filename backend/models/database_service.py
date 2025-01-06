from sqlalchemy import or_
from backend import db
from backend.models.models import User, Item, Box
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta, timezone

##### BOX #####

def create_box(name, location):
    """
    Create a new box.
    """
    box = Box(name=name, location=location)
    db.session.add(box)
    db.session.commit()
    return box


def get_all_boxes():
    """
    List all boxes.
    """
    return Box.query.all()


##### USER #####

def create_user(phone_number, first_name, last_name, password_raw):
    """
    Create a new user (first checks whether phone number has already been used).
    """
    user = User.query.filter_by(phone_number=phone_number).first()
    if user:
        return False
    
    password = generate_password_hash(password_raw)
    current_time = datetime.now(timezone.utc)

    user = User(phone_number=phone_number, first_name=first_name, last_name=last_name, password=password, created_at=current_time, is_confirmed=False)
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


##### ITEM #####

def create_item(image_path, category, title, description, condition, weight, box, created_by):
    """
    Add a new item to a box.
    """
    current_time = datetime.now(timezone.utc)
    item = Item(
        image_path=image_path,
        category=category,
        title=title,
        description=description,
        condition=condition,
        weight=weight,
        box=box,
        created_by=created_by,
        created_at=current_time
    )
    db.session.add(item)
    db.session.commit()
    return item


def update_item_as_taken(item_id, taken_by_user_id):
    """
    Mark a specified item as taken.
    """
    item = Item.query.get(item_id)
    if item:
        current_time = datetime.now(timezone.utc)
        item.taken_by_id = taken_by_user_id
        item.taken_at = current_time
        db.session.commit()
        return item
    return None


def update_item_as_reserved(item_id, reserved_by_user_id):
    """
    Marks a specified item as reserved.
    """
    item = Item.query.get(item_id)
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
    query = Item.query

    item = Item.query.get(item_id)

    if item:
        check_and_update_reservation(item)
        item.number_of_views += 1
        db.session.commit()
    return item


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


##### GENERAL #####

def delete_all_rows():
    """
    Resets database.
    """
    models = [Item, Box, User]
    for model in models:
        model.query.delete()