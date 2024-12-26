from backend.models.database_service import create_box, create_item, create_user, delete_all_rows
from backend.services.vision import handle_item

def seed_database():
    delete_all_rows() # Initial reset

    user_1, _ = create_user("017849385", "Dana", "Dampfbad", "passwort123")
    user_2, _ = create_user("013444485", "Elma", "Koksnase", "nananana")

    box_1 = create_box("University Box", "Albertus-Magnus-Platz 1")
    box_2 = create_box("Neighborhood Box", "Fuck My Life Straße 11")
    
    #mug = create_item(image_path="/uploads/mug.jpg", category="dishes", title="Pretty mug", description="Red mug with snoopy", condition="flawless", weight=200.43, box=box_1, created_by=user_1)
    mug = handle_item(image_path="/uploads/mug.jpg", weight=200.43, box=box_1, created_by=user_1)
    toaster = handle_item(image_path="/uploads/toaster.webp", weight=200.43, box=box_1, created_by=user_1)
    #cup = create_item(image_path="/uploads/toaster.webp", category="household appliance", title="Toaster", description="Black toaster for two simultaneous toasts", condition="flawless", weight=989.94, box=box_2, created_by=user_2)

