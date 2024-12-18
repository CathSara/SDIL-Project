from .. import db

class Box(db.Model):
    __tablename__ = 'boxes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    # Relationship with items
    items = db.relationship('Item', backref='box', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location
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
    is_taken = db.Column(db.Boolean, default=False, nullable=False)

    # Foreign key: The box where the item is stored
    box_id = db.Column(db.Integer, db.ForeignKey('boxes.id'), nullable=False)

    # Foreign key: The user who put the item in
    created_by_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_by = db.relationship('User', foreign_keys=[created_by_id], backref='items_created')

    # Foreign key: The user who took the item (optional)
    taken_by_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    taken_by = db.relationship('User', foreign_keys=[taken_by_id], backref='items_taken')

    def to_dict(self):
        return {
            "id": self.id,
            "image_path": self.image_path,
            "category": self.category,
            "title": self.title,
            "description": self.description,
            "condition": self.condition,
            "weiht": self.weight,
            "is_taken": self.is_taken,
            "box_id": self.box_id,
            "created_by_id": self.created_by_id,
            "taken_by_id": self.taken_by_id
        }


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    phone_number = db.Column(db.String(15), unique=True, index=True, nullable=False)
    first_name = db.Column(db.String(15), nullable=False)
    last_name = db.Column(db.String(15), nullable=False)
    password = db.Column(db.String(120))

    def to_dict(self):
        return {
            "id": self.id,
            "phone_number": self.phone_number,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "password": self.password,
        }
