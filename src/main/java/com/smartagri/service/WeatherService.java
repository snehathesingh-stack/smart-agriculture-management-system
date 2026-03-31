package com.smartagri.service;

import com.smartagri.dto.WeatherResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class WeatherService {

    @Value("${weather.api.key}")
    private String apiKey;

    public WeatherResponse getWeather(String city) {

        try {
            String url = "https://api.openweathermap.org/data/2.5/weather?q="
                    + city + "&appid=" + apiKey + "&units=metric";

            RestTemplate restTemplate = new RestTemplate();

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            // 🔥 SAFE EXTRACTION
            Map<String, Object> main = (Map<String, Object>) response.get("main");

            double temp = ((Number) main.get("temp")).doubleValue();
            int humidity = ((Number) main.get("humidity")).intValue();

            WeatherResponse weather = new WeatherResponse();
            weather.setTemperature(temp);
            weather.setHumidity(humidity);

            return weather;

        } catch (Exception e) {
            e.printStackTrace();

            // fallback (so API never crashes)
            WeatherResponse weather = new WeatherResponse();
            weather.setTemperature(25);
            weather.setHumidity(60);

            return weather;
        }
    }
}