from backend.models.database_service import create_box, create_item, create_user, delete_all_rows, confirm_user
#from backend.services.vision import handle_item

def seed_database():
    delete_all_rows() # Initial reset

    user_1, _ = create_user("017849385", "Dana", "Dampfbad", "passwort123")
    user_2, _ = create_user("013444485", "Elma", "Koksnase", "nananana")
    user_3, _ = create_user("023454334", "Stinktier", "Ja", "Nein")

    confirm_user(user_1.id, "1234")
    confirm_user(user_2.id, "1234")
    # Not confirming user_3

    box_1 = create_box("University Box", "Albertus-Magnus-Platz 1")
    box_2 = create_box("Neighborhood Box", "Fuck My Life Straße 11")
    
    mug = create_item(image_path="/uploads/mug.jpg", category="Dishes", title="Snoopy mug", description="Red mug with snoopy", condition="flawless", weight=200.43, box=box_1, created_by=user_1)
    #mug = handle_item(image_path="/uploads/mug.jpg", weight=200.43, box=box_1, created_by=user_1)
    #toaster = handle_item(image_path="/uploads/toaster.webp", weight=200.43, box=box_1, created_by=user_1)
    cup = create_item(image_path="/uploads/toaster.webp", category="Household Appliance", title="Toaster", description="Black toaster for two simultaneous toasts", condition="flawless", weight=989.94, box=box_2, created_by=user_2)
    arduino = create_item(image_path="/uploads/arduino.png", category="Electronics", title="Arduino Uno", description="Arduino Uno original used in university project", condition="flawless", weight=304.23, box=box_1, created_by=user_1)
    glasses_case = create_item(image_path="/uploads/glasses_case.jpg", category="Storage", title="Glasses Case", description="A case for glasses with two wipers", condition="used", weight=432.26, box=box_1, created_by=user_1)
    teddy = create_item(image_path="/uploads/teddy.jpeg", category="Toys", title="Teddy Bear", description="A teddy bear for fucking up", condition="new", weight=854.83, box=box_2, created_by=user_2)
    mouse = create_item(image_path="/uploads/mouse.webp", category="Electronics", title="Computer Mouse", description="Logitech computer mouse with cable", condition="flawless", weight=235.86, box=box_2, created_by=user_1)
