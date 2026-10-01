package pl.dbm.topupsystem.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.dbm.topupsystem.dto.DashboardSummaryDto;
import pl.dbm.topupsystem.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
  private final DashboardService dashboardService;

  public DashboardController(DashboardService dashboardService) {
    this.dashboardService = dashboardService;
  }

  @GetMapping("/summary")
  public DashboardSummaryDto getSummary() {
    return dashboardService.getSummary();
  }
}
