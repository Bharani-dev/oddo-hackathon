package com.traveloop.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.traveloop.backend.model.AppUser;
import com.traveloop.backend.repository.UserRepository;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner dataLoader(UserRepository userRepository) {
		return args -> {
			if (userRepository.count() == 0) {
				AppUser user = new AppUser();
				user.setName("Traveler");
				user.setEmail("dummy@traveloop.com");
				user.setPasswordHash("password");
				userRepository.save(user);
			}
		};
	}

}
