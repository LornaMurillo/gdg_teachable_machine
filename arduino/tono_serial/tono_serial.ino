//Importamos la librería para poder controlar el servomotor
#include <Servo.h>

// Definición de pines
// Se usan pines digitales (el 8 y el 9) ya que solo entienden de dos estados básicos: apagado o encendido (LOW/HIGH)
const int BUZZER = 8; // El pin 8 se usa para el buzzer, porque podemos encenderlo y apagarlo rápidamente con la función tone() para crear frecuencias.
const int SERVO_PIN = 9; // El Pin 9 es especial porque permite enviar pulsos rápidos, que es exactamente lo que necesita el servomotor para saber la posición exacta del ángulo

Servo miServo;

// El Arduino ejecuta este bloque de código una sola vez justo en el momento en que enciende o se presiona el botón de reinicio.
void setup() { 
  // Abre el puerto serial para que el Arduino pueda comunicarse con tu computadora, indica al Arduino y a la 
  // computadora que deben hablar y escuchar a una velocidad exacta de 9600 bits por segundo para entenderse sin errores.
  Serial.begin(9600); 

  // Le avisa al Arduino cómo se va a comportar el Pin 8. El OUTPUT envia corriente y señales hacia afuera (hacia el buzzer) para hacerlo sonar. 
  // Si fuera un botón, usaríamos INPUT porque el pin estaría recibiendo información.
  pinMode(BUZZER, OUTPUT);

  // Conecta la librería del servomotor que importamos antes, asú el Arduino sabe que cada vez que le demos una orden al objeto miServo,
  // la señal eléctrica de control debe salir exactamente por ese pin 9.
  miServo.attach(SERVO_PIN);
  
  // Posición inicial al arrancar del servomotor
  miServo.write(90); 
}

// Este bloque void loop() es el ciclo principal y continuo del Arduino. 
// A diferencia del setup (el cual solo corre una vez al arrancar), el loop se repite millones de veces por segundo de forma ininterrumpida, 
// revisando constantemente si hay nuevas órdenes llegando desde la computadora.
void loop() {

  // Revisa si la compu ha enviado algún dato o carácter a través del cable USB. El número > 0 significa "si hay al menos un mensaje nuevo esperando en la fila"
  if (Serial.available() > 0) { 
    char c = Serial.read(); // Lee el carácter que acaba de llegar (por ejemplo, '1', '3', '5') y lo guarda temporalmente
    
    // Control del Buzzer
    // Los buzzers que se está usando en esta charla casi no emiten sonido por debajo de los 100 Hz
    // solo se escucha un chasquido o un zumbido seco. El valor más grave útil suele rondar los 200 Hz - 300 Hz,
    // en cambio ek agudo puede subir hasta los 10,000 Hz o más
    if (c == '1') {
      tone(BUZZER, 1500);    // Tono agudo
    } else if (c == '2') {
      tone(BUZZER, 300);     // Tono grave
    } else if (c == '0') {
      noTone(BUZZER);        // Apagar buzzer
    }
    
    // Control del Servomotor
    if (c == '3') {
      miServo.write(0);      // Izquierda
    } else if (c == '4') {
      miServo.write(180);    // Derecha
    } else if (c == '5') {
      miServo.write(90);     // Frente
    } else if (c == '6') {
      miServo.write(45);     // Atrás
    }
  }
}