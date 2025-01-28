from backend.models.database_service import create_box, create_item, create_user, delete_all_rows, confirm_user
#from backend.services.vision import handle_item

def seed_database():
    delete_all_rows() # Initial reset

    user_1, _ = create_user("017849385", "Dana", "Dampfbad", "passwort123", "/profiles/dana.jpg")
    user_2, _ = create_user("013444485", "Elma", "Elmshüttel", "nananana", "/profiles/dana.jpg")
    user_3, _ = create_user("023454334", "Stinktier", "Ja", "Nein", "/profiles/dana.jpg")

    confirm_user(user_1.id, "1234")
    confirm_user(user_2.id, "1234")
    # Not confirming user_3


    box_1 = create_box("University Box", "Albertus-Magnus-Platz 1", "/boxes/uni.jpg", "https://www.google.com/maps/dir//University+of+Cologne,+Albertus-Magnus-Platz,+Lindenthal/@50.928256,6.8881616,12368m/data=!3m2!1e3!5s0x47b8d45b3ff58309:0x7be41fe05b085d5a!4m9!4m8!1m0!1m5!1m1!1s0x47bf24e5d9cbb35b:0x21c4c1ace6430b3c!2m2!1d6.9293608!2d50.9282632!3e0?entry=ttu&g_ep=EgoyMDI1MDEwOC4wIKXMDSoASAFQAw%3D%3D")
    box_2 = create_box("Neighborhood Box", "Sülzburgstrasse 1", "/boxes/sülz.jpeg", "https://www.google.com/maps/dir//Sülz,+Cologne-Lindenthal/@50.9122095,6.8966718,6186m/data=!3m1!1e3!4m9!4m8!1m0!1m5!1m1!1s0x47bf24c00e5ba8f1:0x52760fc4a2db6a0!2m2!1d6.9274744!2d50.915748!3e0?entry=ttu&g_ep=EgoyMDI1MDEwOC4wIKXMDSoASAFQAw%3D%3D")
    
    mug = create_item(image_path="/uploads/mug.jpg", category="Dishes", title="Snoopy mug", description="Red mug with snoopy", condition="flawless", weight=429.43, box=box_1, created_by=user_1, item_state="stored")
    cup = create_item(image_path="/uploads/toaster.webp", category="Household Appliance", title="Toaster", description="Black toaster for two simultaneous toasts", condition="flawless", weight=989.94, box=box_2, created_by=user_2, item_state="stored")
    arduino = create_item(image_path="/uploads/arduino.png", category="Electronics", title="Arduino Uno", description="Arduino Uno original used in university project", condition="flawless", weight=304.23, box=box_1, created_by=user_1, item_state="stored")
    glasses_case = create_item(image_path="/uploads/glasses_case.jpg", category="Storage", title="Glasses Case", description="A case for glasses with two wipers", condition="used", weight=432.26, box=box_1, created_by=user_1, item_state="stored")
    teddy = create_item(image_path="/uploads/teddy.jpeg", category="Toys", title="Teddy Bear", description="A teddy bear for fucking up", condition="new", weight=854.83, box=box_2, created_by=user_2, item_state="stored")
    mouse = create_item(image_path="/uploads/mouse.webp", category="Electronics", title="Computer Mouse", description="Logitech computer mouse with cable", condition="flawless", weight=235.86, box=box_2, created_by=user_1, item_state="stored")
