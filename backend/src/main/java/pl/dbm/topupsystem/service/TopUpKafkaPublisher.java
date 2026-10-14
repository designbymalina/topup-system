package pl.dbm.topupsystem.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import pl.dbm.topupsystem.event.TopUpCreatedEvent;

@Component
public class TopUpKafkaPublisher {

  private final KafkaTemplate<String, TopUpCreatedEvent> kafkaTemplate;

  public TopUpKafkaPublisher(KafkaTemplate<String, TopUpCreatedEvent> kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
  }

  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void publish(TopUpCreatedEvent event) {
    kafkaTemplate.send("topup.created", event.topUpId().toString(), event);
  }
}
