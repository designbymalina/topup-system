/**
 * Project: Prepaid Top-Up & Billing System
 *
 * @author Design by Malina
 */
package pl.dbm.topupsystem.controller;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiController {
  @GetMapping
  public Map<String, Object> index() {
    Map<String, String> endpoints = new LinkedHashMap<>();

    endpoints.put("simCards", "/api/sim-cards");
    endpoints.put("customers", "/api/customers");
    endpoints.put("topUps", "/api/top-ups");

    Map<String, Object> response = new LinkedHashMap<>();

    response.put("name", "Prepaid Top-Up & Billing System API");
    response.put("version", "1.0.0");
    response.put("endpoints", endpoints);

    // response.put("documentation", "/api/docs"); // NOTE: Swagger/OpenAPI

    return response;
  }
}
