package com.ds_45.backend.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Login successful. Backend is up!";
    }
}