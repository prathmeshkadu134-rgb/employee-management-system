package com.Employee_Management_System.Controller;

import com.Employee_Management_System.Entity.EmpManagement;
import com.Employee_Management_System.Repository.EmpManagementRepository;
import com.Employee_Management_System.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class EmpManagementController {

    @Autowired
    private EmpManagementRepository empManagementRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private void updateJsonFile() throws IOException {
        try {
            List<EmpManagement> allEmployees = empManagementRepository.findAll();

            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());

            String filePath = "C:\\Users\\prathmesh kadu\\Desktop\\Angular20\\Employee-Management-System\\src\\employee_record.json";
            File file = new File(filePath);

            try (FileWriter writer = new FileWriter(file)) {
                mapper.writerWithDefaultPrettyPrinter().writeValue(writer, allEmployees);
            }
            System.out.println("Successfully Updated Json File at :" + filePath);
        } catch (Exception e) {
            System.out.println("Failed to Update Json :" + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String firstName = payload.get("firstName");
        LocalDate dob = LocalDate.parse(payload.get("dob"));

        Optional<EmpManagement> empManagementOptional = empManagementRepository.findByFirstNameAndDob(firstName, dob);

        if (empManagementOptional.isPresent()) {
            String token = jwtUtil.generateToken(firstName);
            return ResponseEntity.ok(Map.of("token", token, "user", empManagementOptional.get()));
        }
        return ResponseEntity.status(401).body("Invalid firstname or date of birth");
    }   

    @GetMapping("/employee")
    public ResponseEntity<Map<String, Object>> getAllEmployee(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        try {
            if(size<1){
                size=5;
            }
            Pageable paging = PageRequest.of(page, size, Sort.by("id").ascending());

            Page<EmpManagement> pageEmp = empManagementRepository.findAll(paging);

            Map<String, Object> response = Map.of(
                    "employees", pageEmp.getContent(),
                    "currentPage", pageEmp.getNumber(),
                    "totalItems", pageEmp.getTotalElements(),
                    "totalPages", pageEmp.getTotalPages()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/employee")
    public EmpManagement createEmployee(@RequestBody EmpManagement empManagement) throws IOException {
        EmpManagement savedEmp = empManagementRepository.save(empManagement);
        updateJsonFile();
        return savedEmp;
    }

    @PutMapping("/employee/{id}")
    public ResponseEntity<EmpManagement> updateEmployee(@PathVariable Long id, @RequestBody EmpManagement empDetails) throws IOException {
        EmpManagement empManagement = empManagementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        empManagement.setFirstName(empDetails.getFirstName());
        empManagement.setLastName(empDetails.getLastName());
        empManagement.setContact(empDetails.getContact());
        empManagement.setEmail(empDetails.getEmail());
        empManagement.setDob(empDetails.getDob());
        empManagement.setAddress(empDetails.getAddress());

        EmpManagement updatedEmp = empManagementRepository.save(empManagement);
        updateJsonFile();
        return ResponseEntity.ok(updatedEmp);
    }

    @DeleteMapping("/employee/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) throws IOException {
        empManagementRepository.deleteById(id);
        updateJsonFile();
        return ResponseEntity.ok(Map.of("deleted", true));
    }
}