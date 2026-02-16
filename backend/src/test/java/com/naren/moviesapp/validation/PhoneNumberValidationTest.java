package com.naren.moviesapp.validation;

import org.junit.jupiter.api.Test;

import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class PhoneNumberValidationTest {

    private static final Pattern PHONE_PATTERN = Pattern.compile("^[0-9]{10}$");

    @Test
    void validPhoneNumber_ShouldPass() {
        assertTrue(PHONE_PATTERN.matcher("9876543210").matches());
        assertTrue(PHONE_PATTERN.matcher("1234567890").matches());
        assertTrue(PHONE_PATTERN.matcher("9999999999").matches());
    }

    @Test
    void invalidPhoneNumber_ShouldFail() {
        assertFalse(PHONE_PATTERN.matcher("22222222222").matches());
        assertFalse(PHONE_PATTERN.matcher("123456789").matches());
        assertFalse(PHONE_PATTERN.matcher("123456789012").matches());
        assertFalse(PHONE_PATTERN.matcher("abcdefghij").matches());
        assertFalse(PHONE_PATTERN.matcher("123-456-7890").matches());
        assertFalse(PHONE_PATTERN.matcher("123 456 7890").matches());
        assertFalse(PHONE_PATTERN.matcher("").matches());
    }
}
