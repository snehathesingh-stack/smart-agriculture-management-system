package com.smartagri.dto;

public class WeatherResponse {

    private double temperature;
    private int humidity;

    // ✅ Default constructor (VERY IMPORTANT)
    public WeatherResponse() {
    }

    // ✅ Getter
    public double getTemperature() {
        return temperature;
    }

    public int getHumidity() {
        return humidity;
    }

    // ✅ Setter
    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public void setHumidity(int humidity) {
        this.humidity = humidity;
    }
}