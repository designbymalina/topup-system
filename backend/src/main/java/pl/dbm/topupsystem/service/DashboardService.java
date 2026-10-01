package pl.dbm.topupsystem.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.dbm.topupsystem.dto.DashboardSummaryDto;
import pl.dbm.topupsystem.enums.SimCardStatus;
import pl.dbm.topupsystem.repository.CustomerRepository;
import pl.dbm.topupsystem.repository.SimCardRepository;
import pl.dbm.topupsystem.repository.TopUpRepository;

@Service
public class DashboardService {
  private static final ZoneId WARSAW_ZONE = ZoneId.of("Europe/Warsaw");

  private final SimCardRepository simCardRepository;
  private final CustomerRepository customerRepository;
  private final TopUpRepository topUpRepository;

  public DashboardService(
      SimCardRepository simCardRepository,
      CustomerRepository customerRepository,
      TopUpRepository topUpRepository) {
    this.simCardRepository = simCardRepository;
    this.customerRepository = customerRepository;
    this.topUpRepository = topUpRepository;
  }

  @Transactional(readOnly = true)
  public DashboardSummaryDto getSummary() {
    LocalDate today = LocalDate.now(WARSAW_ZONE);
    LocalDateTime startOfToday = today.atStartOfDay();
    LocalDateTime startOfTomorrow = today.plusDays(1).atStartOfDay();

    LocalDate firstDayOfMonth = today.withDayOfMonth(1);
    LocalDateTime startOfMonth = firstDayOfMonth.atStartOfDay();
    LocalDateTime startOfNextMonth = firstDayOfMonth.plusMonths(1).atStartOfDay();

    return new DashboardSummaryDto(
        new DashboardSummaryDto.SimCards(
            simCardRepository.count(),
            simCardRepository.countByStatus(SimCardStatus.ACTIVE),
            simCardRepository.countRequiringAttention(SimCardStatus.ACTIVE, today)),
        new DashboardSummaryDto.Customers(customerRepository.count()),
        new DashboardSummaryDto.TopUps(
            topUpRepository.sumAmountBetween(startOfMonth, startOfNextMonth),
            topUpRepository.countByCreatedAtGreaterThanEqualAndCreatedAtLessThan(
                startOfToday, startOfTomorrow)));
  }
}
