from sqlalchemy import func
from .. import db

class Box(db.Model):
    __tablename__ = 'boxes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    items = db.relationship('Item', backref='box', lazy=True)  # Relationship with items
    box_picture_path = db.Column(db.String(255), nullable=True)
    maps_link = db.Column(db.String(255), nullable=True)
    opened = db.Column(db.Boolean, default=False)

    # Foreign key to reference the user who opened the box
    opened_by_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', name='fk_boxes_opened_by_id'),
        nullable=True
    )
    opened_by = db.relationship('User', backref='opened_boxes', foreign_keys=[opened_by_id])

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "box_picture_path": self.box_picture_path,
            "maps_link": self.maps_link,
            "opened": self.opened,
            "opened_by_id": self.opened_by_id,
        }


class Item(db.Model):
    __tablename__ = 'items'
    id = db.Column(db.Integer, primary_key=True)
    image_path = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    condition = db.Column(db.String(50), nullable=False)
    weight = db.Column(db.Float, nullable=False)
    number_of_views = db.Column(db.Integer, default=0)
    item_state = db.Column(db.String(20), nullable=False, default='stored') # ["created", "scanned", "stored", "picked", "taken"]

    box_id = db.Column(
        db.Integer,
        db.ForeignKey('boxes.id', name='fk_items_box_id'),
        nullable=False
    )  # Foreign key: The box where the item is stored

    created_by_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', name='fk_items_created_by_id'),
        nullable=False
    )  # Foreign key: The user who put the item in
    created_by = db.relationship('User', foreign_keys=[created_by_id], backref='items_created')
    created_at = db.Column(db.DateTime, nullable=True, default=func.now())    
    
    reserved_by_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', name='fk_items_reserved_by_id'),
        nullable=True
    )  # Foreign key: The user reserved the item (optional)
    reserved_by = db.relationship('User', foreign_keys=[reserved_by_id], backref='items_reserved')
    reserved_at = db.Column(db.DateTime, nullable=True)
    reserved_until = db.Column(db.DateTime, nullable=True)

    def to_overview_dict(self):
        return {
            "id": self.id,
            "image_path": self.image_path,
            "category": self.category,
            "title": self.title,
            "description": self.description,
            "condition": self.condition,
            "box_id": self.box_id,
            "item_state": self.item_state,
            "reserved_by_id": self.reserved_by_id,
        }
    
    def to_detail_dict(self):
        return {
            "id": self.id,
            "image_path": self.image_path,
            "category": self.category,
            "title": self.title,
            "description": self.description,
            "condition": self.condition,
            "weight": self.weight,
            "box_id": self.box_id,
            "item_state": self.item_state,
            "number_of_views": self.number_of_views,
            "created_by_id": self.created_by_id,
            "created_at": self.created_at,
            "reserved_by_id": self.reserved_by_id,
            "reserved_until": self.reserved_until,
        }


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    phone_number = db.Column(db.String(15), unique=True, index=True, nullable=False)
    first_name = db.Column(db.String(15), nullable=False)
    last_name = db.Column(db.String(15), nullable=False)
    password = db.Column(db.String(120))
    created_at = db.Column(db.DateTime, default=func.now())
    is_confirmed = db.Column(db.Boolean, default=False)
    profile_picture_path = db.Column(db.String(255), default="")

    def to_dict(self):
        return {
            "id": self.id,
            "phone_number": self.phone_number,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "password": self.password,
            "is_confirmed": self.is_confirmed,
            "profile_picture_path": self.profile_picture_path
        }


class Favorite(db.Model):
    __tablename__ = 'favorites'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', name='fk_favorites_user_id'), primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id', name='fk_favorites_item_id'), primary_key=True)
    created_at = db.Column(db.DateTime, default=func.now())

    user = db.relationship('User', backref=db.backref('favorites', lazy='dynamic'))
    item = db.relationship('Item', backref=db.backref('favorited_by', lazy='dynamic'))

    def to_dict(self):
        return {
            "item_id": self.item_id,
            "created_at": self.created_at
        }
