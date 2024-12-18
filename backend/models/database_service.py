from backend import db
from backend.models.models import User, Item, Box
from werkzeug.security import generate_password_hash, check_password_hash


def create_box(name, location):
    """
    Create a new box.
    """
    box = Box(name=name, location=location)
    db.session.add(box)
    db.session.commit()
    return box


def create_user(phone_number, first_name, last_name, password_raw):
    """
    Create a new user (first checks whether phone number has already been used).
    """
    user = User.query.filter_by(phone_number=phone_number).first()
    if user:
        return False
    
    password = generate_password_hash(password_raw)

    user = User(phone_number=phone_number, first_name=first_name, last_name=last_name, password=password)
    db.session.add(user)
    db.session.commit()
    return user, True


def create_item(image_path, category, title, description, condition, weight, box, created_by):
    """
    Add a new item to a box.
    """
    item = Item(
        image_path=image_path,
        category=category,
        title=title,
        description=description,
        condition=condition,
        weight=weight,
        box=box,
        created_by=created_by
    )
    db.session.add(item)
    db.session.commit()
    return item


def authenticate_user(phone_number, password):
    user = User.query.filter_by(phone_number=phone_number).first()
    if user and check_password_hash(user.password, password):
        return True
    else:
        return False


def update_item_as_taken(item_id, taken_by_user_id):
    """
    Mark a specified item as taken.
    """
    item = Item.query.get(item_id)
    if item:
        item.is_taken = True
        item.taken_by_user_id = taken_by_user_id
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


def get_all_users():
    """
    List all users.
    """
    return User.query.all()


def get_all_boxes():
    """
    List all boxes.
    """
    return Box.query.all()


def delete_all_rows():
    """
    Resets database.
    """
    models = [Item, Box, User]
    for model in models:
        model.query.delete()