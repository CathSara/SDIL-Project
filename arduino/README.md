# Guide to Build the Box

This guide provides step by step instructions to build the box equipped with a lock system, a camera system, and weight sensors.

## Required Components

- A box with at least one door and at least two shelves
- [Lock System](https://github.com/CathSara/SDIL-Project/tree/main/arduino/lock_system)
- [Camera System](https://github.com/CathSara/SDIL-Project/tree/main/arduino/camera)
- [Weight Sensor System](https://github.com/CathSara/SDIL-Project/tree/main/arduino/weight_sensor) for each shelf
- Door latch plate for the lock
- Mounting bracket for the camera
- An extra shelf for each shelf in the box to attach the weight sensor system
- Few screws and a screwdriver
- QR Code with a link to the take/donate page for the specific box
- (Optional) Storage box for technological components (e.g. Arduino)

## Build Instructions

### Prepare the Box

- Drill a small hole in the back of the box for routing cables.
- Place the QR Code prominently on the front of the box (e.g. on the door).

### Attach the Lock System

- **Install the Door Latch Plate**: Mount the latch plate on the interior wall of the box, close to the door.
- **Install the Lock**: Align the lock with the latch plate and mount it securely on the door, ensuring the "tongue" of the lock fits securely.
   - **WARNING**: Ensure the lock remains connected to the wiring of the lock system during installation. Optionally, keep the rest of the lock system (e.g., Arduino) outside the box at first. This prevents you from locking the box out!
- Connect the Arduino to a power supply through the hole in the box.
- (Optional) Place the lock system components inside the storage box for better organization.

### Attach the Camera System

- Insert the camera into the mounting bracket.
- Mount the bracket on the upper back of the designated **scan shelf**.
- Route the camera's power supply cable through the hole in the box.

### Attach the Weight Sensor System

- Mount each weight sensor system onto an extra shelf.
   - **Hint**: Every shelf in the box requires a weight sensor system.
- Place the extra shelf with the weight sensor system on top of the corresponding shelf inside the box.
- Connect the Arduino to a power supply through the hole in the box.
- (Optional) Store remaining components in a designated storage box.

## Notes and Best Practices

- Double-check all cable connections before attaching the hardware components on the box.
- Test the lock system, camera system, and weight sensor systems after installation to ensure functionality.
- Use a storage box to protect technological components and reduce cable clutter.

## Troubleshooting

- **General Issues with the Systems**: Make sure you have followed the instructions in the respective README's.
- **Lock System Not Opening**: Ensure all cables are securely connected and the power supply is functional.
- **Camera Not Detecting**: Verify the camera's alignment and power connection.
- **Weight Sensor Issues**: Ensure sensors are mounted flat against the shelf and calibrated correctly.
