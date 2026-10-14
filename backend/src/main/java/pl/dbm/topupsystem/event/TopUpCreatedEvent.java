package pl.dbm.topupsystem.event;

import java.math.BigDecimal;

public record TopUpCreatedEvent(
    Long topUpId, Long simCardId, String phoneNumber, BigDecimal amount, String createdAt) {}
