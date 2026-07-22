package com.naren.moviesapp.Record;

import jakarta.validation.constraints.NotNull;

public record PaymentIntentRequest(@NotNull Long planId) {
}
