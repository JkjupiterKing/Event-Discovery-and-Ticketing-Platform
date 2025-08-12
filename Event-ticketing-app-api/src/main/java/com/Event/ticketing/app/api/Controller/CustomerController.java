package com.Event.ticketing.app.api.Controller;

import com.Event.ticketing.app.api.Model.Customer;
import com.Event.ticketing.app.api.Repo.CustomerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/customers")
@CrossOrigin
public class CustomerController {

    @Autowired
    private CustomerRepo customerRepo;

    @GetMapping("/all")
    public List<Customer> getAllCustomers() {
        return customerRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        Optional<Customer> customer = customerRepo.findById(id);
        return customer.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).build());
    }

    @PostMapping("/create")
    public ResponseEntity<String> createCustomer(@RequestBody Customer customer) {
        if (customerRepo.findByEmail(customer.getEmail()) != null) {
            return ResponseEntity.status(400).body("Email is already in use.");
        }

        String encodedPassword = Base64.getEncoder().encodeToString(customer.getPassword().getBytes(StandardCharsets.UTF_8));
        customer.setPassword(encodedPassword);

        customerRepo.save(customer);
        return ResponseEntity.ok("Customer created successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<Customer> login(@RequestBody Customer customer) {
        Optional<Customer> existingCustomerOpt = Optional.ofNullable(customerRepo.findByEmail(customer.getEmail()));

        if (existingCustomerOpt.isPresent()) {
            String storedEncodedPassword = existingCustomerOpt.get().getPassword();
            String decodedPassword = new String(Base64.getDecoder().decode(storedEncodedPassword), StandardCharsets.UTF_8);

            if (decodedPassword.equals(customer.getPassword())) {
                return ResponseEntity.ok(existingCustomerOpt.get());
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer updatedCustomer) {
        Optional<Customer> existingCustomerOpt = customerRepo.findById(id);

        if (!existingCustomerOpt.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Customer existingCustomer = existingCustomerOpt.get();

        if (updatedCustomer.getFirstName() != null) {
            existingCustomer.setFirstName(updatedCustomer.getFirstName());
        }
        if (updatedCustomer.getLastName() != null) {
            existingCustomer.setLastName(updatedCustomer.getLastName());
        }
        if (updatedCustomer.getEmail() != null) {
            existingCustomer.setEmail(updatedCustomer.getEmail());
        }
        if (updatedCustomer.getPassword() != null) {
            String encodedPassword = Base64.getEncoder().encodeToString(updatedCustomer.getPassword().getBytes(StandardCharsets.UTF_8));
            existingCustomer.setPassword(encodedPassword);
        }
        if (updatedCustomer.getGender() != null) {
            existingCustomer.setGender(updatedCustomer.getGender());
        }
        if (updatedCustomer.getPhoneNumber() != null) {
            existingCustomer.setPhoneNumber(updatedCustomer.getPhoneNumber());
        }
        if (updatedCustomer.getCity() != null) {
            existingCustomer.setCity(updatedCustomer.getCity());
        }
        if (updatedCustomer.getState() != null) {
            existingCustomer.setState(updatedCustomer.getState());
        }
        if (updatedCustomer.getCountry() != null) {
            existingCustomer.setCountry(updatedCustomer.getCountry());
        }

        customerRepo.save(existingCustomer);
        return ResponseEntity.ok(existingCustomer);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable Long id) {
        if (!customerRepo.existsById(id)) {
            return ResponseEntity.status(404).body("Customer not found.");
        }
        customerRepo.deleteById(id);
        return ResponseEntity.ok("Customer deleted successfully.");
    }
}
