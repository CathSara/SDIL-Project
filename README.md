# The Smart Giveaway Box

This project was developed as part of the course "Sustainable Digital Innovation Lab" at the University of Cologne and supervised by Prof. Dr. Stefan Seidel, Dr. Katharina Drechsler and Christian Hovestadt.

## Description

This project aims to create an innovative solution for a more sustainable future through the development of the smart giveaway box as a prototype. It combines:
- The use of common giveaway boxes that you can find on the streets
- The design and fixed location of public bookcases
- Additional technological components providing security and a smart inventory management

By increasing the lifecycle of products, reducing waste, and promoting community sharing, the smart giveaway box fosters a circular economy while encouraging sustainable practices.

## Requirements

In order to use the smart giveaway box, you require the following:
- WiFi connection
- Power supply
- Hardware components (more information [here](https://github.com/CathSara/SDIL-Project/tree/main/arduino))
- Install [Arduino IDE](https://www.arduino.cc/en/software)
    
## Installation

- Clone this repository to your local machine
- [Set up the backend](https://github.com/CathSara/SDIL-Project/tree/main/backend)
- [Set up the frontend](https://github.com/CathSara/SDIL-Project/tree/main/website-sharingbox)
- [Build the box](https://github.com/CathSara/SDIL-Project/tree/main/arduino)
  - [Build the lock system](https://github.com/CathSara/SDIL-Project/tree/main/arduino/lock_system)
  - [Build the camera system](https://github.com/CathSara/SDIL-Project/tree/main/arduino/camera)
  - [Build the weight sensor system](https://github.com/CathSara/SDIL-Project/tree/main/arduino/weight_sensor)

## Usage

### Discover the Smart Inventory

1. Run the backend and frontend of the website.
2. On the website, if you are not logged in yet, log in with your existing account or sign up with a new account.
3. Open the inventory page to view all items currently available in each active box.
4. You can filter the inventory by the category of items and a specific box.
   
![Picture of the inventory page](https://github.com/user-attachments/assets/9794a9bd-ed35-4de6-a1a6-a9481d68a7c3)

5. By clicking on an item, you can like or reserve it. You can easily access these items again through your profile.
6. If you reserve an item, it will tell other users to **not** take it from the box.
   
![Picture of item detail view](https://github.com/user-attachments/assets/baf30f1f-e290-407f-8c71-ff7e8109f997)


### Take or Donate Items

1. Run the backend and frontend of the website
2. Scan the QR code on the box to access the take/donate page
3. On the website, if you are not logged in yet, log in with your existing account or sign up with a new account.
4. Press the button "Unlock" to unlock the box. You will have 15 seconds to open the door before it gets locked again.
5. You are then redirected to the inventory for the specific box you opened.
6. If you **take** an item from the box,
    - the inventory will automatically recognize the item by its weight and mark it as "taken" as long as you keep it.
    - When you close the door, the item will be fully removed from the inventory.
7. If you **donate** an item to the box,
    - you are required to put it on the **scan shelf** first to let the box take a picture of the item, save its weight and automatically recognize the item.
    - An item is allowed to be put on the **storage shelf** for donation if it is a material good that is **not** a food item and **not** in poor condition.
    - The allowance of an item is determined by the integrated item recognition by [OpenAI](https://platform.openai.com/docs/guides/vision).
    - If the item is allowed, put it in the box and it will be saved in the inventory.
8. Close the door after using the box. The open "tongue" of the lock will be pushed inside by the built-in door latch plate and stay locked within that plate.

**Edge Cases**

- If you take an item from the box that has the same weight as another item in the same box:
  - On the website, a pop up message will appear where you have to choose which item you took out of the two.
  - You will not be able to proceed further on the website if you do not choose anything.
  - If you just take the item anyway, the host or the next user will be asked to choose which item is still in the box.
- If you donate an item to the box and do not put it on the scan shelf, but immediately on the storage shelf:
  - The increased weight will still be detected by the box.
  - The host or the next user will be asked to take the item that is not in the inventory and remove it or put it on the scan shelf for the item recognition.

## Feedback and Contributions

We welcome feedback, bug reports, and contributions! If you encounter any issues or have suggestions for improvement, please [open an issue](https://github.com/CathSara/SDIL-Project/issues/new) or [submit a pull request](https://github.com/CathSara/SDIL-Project/pulls).

### Contributors

These are the current contributors for this repository. Feel free to contribute!

<a href="https://github.com/CathSara/SDIL-Project/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=CathSara/SDIL-Project" />
</a>

## Contact

For any further inquiries or assistance, feel free to contact us!

**GitHub Profiles:** 
- [Tim Hebestreit](https://github.com/timheb16)
- [Chiara Seidenath](https://github.com/CathSara)
- [Johannes Simon](https://github.com/JS-10)
- [Max Unterbusch](https://github.com/maxiloo)
- [Leonard Glock](https://github.com/leolabla)

## License
This project is available under the [MIT License](LICENSE).
