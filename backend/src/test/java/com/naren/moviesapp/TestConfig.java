package com.naren.moviesapp;

import com.naren.moviesapp.Utils.EmailService;
import com.naren.moviesapp.Utils.OtpService;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@TestConfiguration
public class TestConfig {

    @Bean
    @Primary
    public EmailService emailService() {
        return new EmailService() {
            @Override
            public void sendOTPEmail(String toEmail, String otp) {
                System.out.println("Mock OTP email sent to: " + toEmail + " with OTP: " + otp);
            }

            @Override
            public void sendPasswordResetMail(String toEmail, String token) {
                System.out.println("Mock password reset email sent to: " + toEmail + " with token: " + token);
            }
        };
    }

    @Bean
    @Primary
    public OtpService otpService(EmailService emailService) {
        return new OtpService(emailService);
    }

    @Bean
    @Primary
    public LettuceConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration();
        config.setHostName("localhost");
        config.setPort(6379);
        return new LettuceConnectionFactory(config);
    }

    @Bean
    @Primary
    public RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory());
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
        return template;
    }
}
