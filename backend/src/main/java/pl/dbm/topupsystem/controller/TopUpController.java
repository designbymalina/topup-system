package pl.dbm.topupsystem.controller;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import pl.dbm.topupsystem.dto.PublicTopUpRequest;
import pl.dbm.topupsystem.dto.TopUpRequest;
import pl.dbm.topupsystem.entity.TopUp;
import pl.dbm.topupsystem.service.TopUpService;

@RestController
@RequestMapping("/api")
public class TopUpController {
  private final TopUpService topUpService;

  public TopUpController(TopUpService topUpService) {
    this.topUpService = topUpService;
  }

  @PostMapping("/sim-cards/{id}/top-ups")
  public TopUp create(@PathVariable Long id, @Valid @RequestBody TopUpRequest request) {
    return topUpService.create(id, request.getAmount());
  }

  @GetMapping("/sim-cards/{id}/top-ups")
  public List<TopUp> findBySimCardId(@PathVariable Long id) {
    return topUpService.findBySimCardId(id);
  }

  @PostMapping("/top-ups")
  public TopUp createPublic(@Valid @RequestBody PublicTopUpRequest request) {
    return topUpService.createPublic(request.getPhoneNumber(), request.getAmount());
  }

  @DeleteMapping("/top-ups/{id}")
  public void delete(@PathVariable Long id) {
    topUpService.delete(id);
  }
}
