package pl.dbm.topupsystem.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import pl.dbm.topupsystem.event.TopUpCreatedEvent;

@Component
public class TopUpKafkaConsumer {

  private static final Logger log = LoggerFactory.getLogger(TopUpKafkaConsumer.class);

  @KafkaListener(topics = "topup.created", groupId = "topup-system")
  public void consume(TopUpCreatedEvent event) {
    log.info(
        "Odebrano doładowanie: id={}, SIM={}, numer={}, kwota={}, data={}",
        event.topUpId(),
        event.simCardId(),
        event.phoneNumber(),
        event.amount(),
        event.createdAt());
  }
}
