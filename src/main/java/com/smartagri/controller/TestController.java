package com.smartagri.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/secure")
    public String secure() {
        return "You accessed protected API 🔐";
    }
}
