package com.Employee_Management_System.Repository;

import com.Employee_Management_System.Entity.EmpManagement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface EmpManagementRepository extends JpaRepository<EmpManagement,Long> {

    Optional<EmpManagement> findByFirstNameAndDob(String firstName, LocalDate dob);

}
