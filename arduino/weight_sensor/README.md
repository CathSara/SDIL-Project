# Scale Using Four 50kg Load Cells and HX711

## Required Components

- **4x 50kg load cells**
- **1x HX711 amplifier module**
- **1x Arduino Uno R4 Wifi**
- **1x Power source for the Arduino**
- **Connection wires**

## Circuit Setup

The four load cells are arranged in a Wheatstone bridge configuration, which allows the HX711 module to accurately measure the combined weight. Each load cell contributes to the bridge by connecting its positive and negative signal wires.

### Wiring Instructions

1. **Identify the Load Cell Wires**:
   - Each load cell typically has 3 wires:
        - the resistence between the two outer wires is double the resistence between the outer and middle wire
        - the middle is most likely red but no guarantees.
   - Use a multimeter to confirm these connections.

2. **Combine the Load Cells**:
   - Link the **same-color outer wires** (e.g., **white** and **black**) of the four load cells to form a loop.
   - Validate the wiring by measuring the resistance across the two diagonals (**red wires**). Both diagonals should show a resistance of approximately **2kΩ**
   - Take the **middle wire (red)** from one diagonal and connect it to the **E+** and **E−** terminals on the HX711 module.
   - **E+** and **E−** are the power supply wires for the load cells. Polarity doesn’t matter; reversing these wires will only invert the calibration parameter in the software.
   - Take the **middle wire (red)** from the other diagonal and connect it to the **A+** and **A−** terminals on the HX711 module.
   - **A+** and **A−** are the measurement inputs from the load cells. As with the power wires, polarity is not important.

3. **Connect HX711 to Arduino**:
   - Connect the **DT (Data)** pin on the HX711 to **pin 4** on the Arduino.
   - Connect the **SCK (Clock)** pin on the HX711 to **pin 5** on the Arduino.
   - Connect the **VCC** and **GND** pins on the HX711 to the Arduino's **5V** and **GND** pins.

### Circuit Diagram
For a detailed diagram, follow the visuals provided in the tutorial at [Circuit Journal](https://circuitjournal.com/50kg-load-cells-with-HX711).

4. **install the arduino code**:
    - download the HX711 Library from the github: https://github.com/olkal/HX711_ADC.
    - Extract the downloaded ZIP file and move it into your Arduino "libraries" folder.
    -  Open Arduino IDE and then from the menu: File->Examples->HX711_ADC->Calibration.
    - It should work without any modifications if you connected the DT output of the HX711 module to the Arduino pin 4, and SCK to the Arduino pin 5
    