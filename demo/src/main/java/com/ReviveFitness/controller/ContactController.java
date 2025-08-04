package com.ReviveFitness.controller;

import com.ReviveFitness.dto.ContactFormRequest;
import com.ReviveFitness.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<?> handleContactForm(@RequestBody ContactFormRequest contactRequest) {
        // --- ADDED THIS LOG LINE ---
        System.out.println("Received contact form submission.");
        // --------------------------

        try {
            // Your email address where you want to receive the messages
            String toEmail = "amyunghimire2061.62@gmail.com";
            
            String subject = "New Contact Form Submission: " + contactRequest.getSubject();
            
            String emailBody = String.format(
                "Name: %s\nEmail: %s\n\nMessage:\n%s",
                contactRequest.getName(),
                contactRequest.getEmail(),
                contactRequest.getMessage()
            );

            emailService.sendSimpleMessage(toEmail, subject, emailBody);

            return ResponseEntity.ok(Map.of("message", "Message sent successfully!"));
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("message", "Failed to send message. Please try again later."));
        }
    }
}