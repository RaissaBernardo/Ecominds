#include "DHT.h"

#define DHTPIN 4
#define DHTTYPE DHT11

int sinal = 0;

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float umi = dht.readHumidity();
  float temp = dht.readTemperature();

  // Saída JSON
  Serial.print("\"temp\": ");
  Serial.print(temp, 1);
  Serial.print(", ");

  Serial.print("\"umi\": ");
  Serial.print(umi, 1);
  Serial.println("}");

  delay(100000);
}
