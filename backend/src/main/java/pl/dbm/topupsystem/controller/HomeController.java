/**
 * Project: Prepaid Top-Up & Billing System
 *
 * @author Design by Malina @NOTE: Thymeleaf / MVC architecture W projekcie przechodzimy na React i
 *     można usunąć Thymeleaf: HomeController, home.html, spring-boot-starter-thymeleaf
 */
package pl.dbm.topupsystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

  @GetMapping("/")
  public String home(Model model) {
    model.addAttribute("systemName", "Prepaid Top-Up & Billing System");
    model.addAttribute("systemDescription", "Hello from Thymeleaf!");

    return "home";
  }
}
