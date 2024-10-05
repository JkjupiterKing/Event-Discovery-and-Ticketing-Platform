package com.Event.ticketing.app.api.Controller;

import com.Event.ticketing.app.api.Model.City;
import com.Event.ticketing.app.api.Repo.CityRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/cities")
@CrossOrigin
public class CityController {

    @Autowired
    private CityRepo cityRepository;

    @GetMapping("/all")
    public List<City> getAllCities() {
        return cityRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<City> getCityById(@PathVariable Long id) {
        return cityRepository.findById(id)
                .map(city -> ResponseEntity.ok().body(city))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/addCity")
    public City createCity(@RequestBody City city) {
        // Set the createdAt timestamp
        city.setCreatedAt(LocalDateTime.now());
        // Optionally set updatedAt to the same value
        city.setUpdatedAt(LocalDateTime.now());
        return cityRepository.save(city);
    }

    @PutMapping("/{id}")
    public ResponseEntity<City> updateCity(@PathVariable Long id, @RequestBody City cityDetails) {
        return cityRepository.findById(id)
                .map(city -> {
                    city.setCityName(cityDetails.getCityName());
                    city.setStateName(cityDetails.getStateName());
                    city.setCountryName(cityDetails.getCountryName());
                    // Update the updatedAt timestamp
                    city.setUpdatedAt(LocalDateTime.now());
                    City updatedCity = cityRepository.save(city);
                    return ResponseEntity.ok(updatedCity);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCity(@PathVariable Long id) {
        if (!cityRepository.existsById(id)) {
            return ResponseEntity.status(404).body("City not found.");
        }
        cityRepository.deleteById(id);
        return ResponseEntity.ok("City deleted successfully.");
    }
}
