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
@RequestMapping("/students")
@CrossOrigin
public class StudentController {

    @Autowired
    private CustomerRepo customerRepo;

    @GetMapping("/all")
    public List<Customer> getAllStudents() {
        return studentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getStudentById(@PathVariable Long id) {
        Optional<Customer> student = studentRepository.findById(id);
        return student.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).build());
    }

    @PostMapping("/create")
    public ResponseEntity<String> createStudent(@RequestBody Student student) {
        if (studentRepository.findByEmail(student.getEmail()) != null) {
            return ResponseEntity.status(400).body("Email is already in use.");
        }

        String encodedPassword = Base64.getEncoder().encodeToString(student.getPassword().getBytes(StandardCharsets.UTF_8));
        student.setPassword(encodedPassword);

        studentRepository.save(student);
        return ResponseEntity.ok("Student created successfully.");
    }

    @PostMapping("/Studentlogin")
    public ResponseEntity<Student> login(@RequestBody Student student) {
        Optional<Student> existingStudentOpt = Optional.ofNullable(studentRepository.findByEmail(student.getEmail()));

        if (existingStudentOpt.isPresent()) {
            String storedEncodedPassword = existingStudentOpt.get().getPassword();
            String decodedPassword = new String(Base64.getDecoder().decode(storedEncodedPassword), StandardCharsets.UTF_8);

            // Compare the decoded password with the provided password
            if (decodedPassword.equals(student.getPassword())) {
                return ResponseEntity.ok(existingStudentOpt.get());
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);  // Return Unauthorized if passwords don't match
    }

    // Update student details
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student updatedStudent) {
        Optional<Student> existingStudentOpt = studentRepository.findById(id);

        if (!existingStudentOpt.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Student existingStudent = existingStudentOpt.get();

        // Update only the fields provided in the request body
        if (updatedStudent.getFirstName() != null) {
            existingStudent.setFirstName(updatedStudent.getFirstName());
        }
        if (updatedStudent.getLastName() != null) {
            existingStudent.setLastName(updatedStudent.getLastName());
        }
        if (updatedStudent.getEmail() != null) {
            existingStudent.setEmail(updatedStudent.getEmail());
        }

        if (updatedStudent.getPassword() != null) {
            String encodedPassword = Base64.getEncoder().encodeToString(updatedStudent.getPassword().getBytes(StandardCharsets.UTF_8));
            existingStudent.setPassword(encodedPassword);
        }
        if (updatedStudent.getGender() != null) {
            existingStudent.setGender(updatedStudent.getGender());
        }
        if (updatedStudent.getCity() != null) {
            existingStudent.setCity(updatedStudent.getCity());
        }
        if (updatedStudent.getState() != null) {
            existingStudent.setState(updatedStudent.getState());
        }
        if (updatedStudent.getCountry() != null) {
            existingStudent.setCountry(updatedStudent.getCountry());
        }

        studentRepository.save(existingStudent);
        return ResponseEntity.ok(existingStudent);
    }

    // DELETE student by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable Long id) {
        if (!studentRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Student not found.");
        }
        studentRepository.deleteById(id);
        return ResponseEntity.ok("Student deleted successfully.");
    }
}
