// Buzzer pasivo/activo en el pin 8 (otro pin a GND)
const int BUZZER = 8;

void setup() {
  Serial.begin(9600);
  pinMode(BUZZER, OUTPUT);
}

void loop() {
  if (Serial.available() > 0) {
    char c = Serial.read();
    if (c == '1') tone(BUZZER, 1500);      // agudo
    else if (c == '2') tone(BUZZER, 300);  // grave
    else if (c == '0') noTone(BUZZER);     // reposo
  }
}
