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
    if item:
        current_time = datetime.now(timezone.utc)
        new_time = current_time + timedelta(minutes=20)
        item.reserved_by_id = reserved_by_user_id
        item.reserved_at = current_time
        item.reserved_until = new_time
        db.session.commit()
        return item
    return None


def get_all_items(box_id=None):
    """
    Retrieve all items. Optionally filtered by a specific box.
    """
    query = Item.query
    if box_id:
        query = query.filter_by(box_id=box_id)
    items = query.all()
    return items


##### FAVORITING #####

#def favorite_item(user_id, item_id):
#    if user_id and item_id:
#        user = User.query.get(user_id)
#        item = Item.query.get(item_id)
#        user.favorited_items.append(item)
#        db.session.commit()
##        return True
    return False


#def unfavorite_item(user_id, item_id):
#    if user_id and item_id:
#        user = User.query.get(user_id)
#        item = Item.query.get(item_id)
#        user.favorited_items.remove(item)
#        db.session.commit()
#        return True
#    return False


##### GENERAL ###

def delete_all_rows():
    """
    Resets database.
    """
    models = [Item, Box, User]
    for model in models:
        model.query.delete()