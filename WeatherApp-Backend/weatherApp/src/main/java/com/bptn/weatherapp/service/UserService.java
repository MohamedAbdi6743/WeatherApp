package com.bptn.weatherapp.service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bptn.weatherapp.exception.domain.EmailExistException;
import com.bptn.weatherapp.exception.domain.UserNotFoundException;
import com.bptn.weatherapp.exception.domain.UsernameExistException;
import com.bptn.weatherapp.jpa.User;
import com.bptn.weatherapp.repository.UserRepository;

@Service
public class UserService {

	Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	EmailService emailService;

	@Autowired
	UserRepository userRepository;

	@Autowired
	PasswordEncoder passwordEncoder;

	private void validateUsernameAndEmail(String username, String emailId) {

		// Check if Username exists
		this.userRepository.findByUsername(username).ifPresent(x -> {
			throw new UsernameExistException(String.format("Username already exist, Username - %s", x.getUsername()));
		});

		// Check if email address exists
		this.userRepository.findByEmailId(emailId).ifPresent(x -> {
			throw new EmailExistException(String.format("EmailId already exist, Email - %s", x.getEmailId()));
		});
	}

	public User signup(User user) {

		// Set username and password values to lowercase characters
		user.setUsername(user.getUsername().toLowerCase());
		user.setEmailId(user.getEmailId().toLowerCase());

		// Validate if username or password exist
		this.validateUsernameAndEmail(user.getUsername(), user.getPassword());

		// Set emailVerified to a default value, false
		user.setEmailVerified(false);

		// Encode password
		user.setPassword(this.passwordEncoder.encode(user.getPassword()));

		// Set createdOn value to the current DateTime
		user.setCreatedOn(Timestamp.from(Instant.now()));

		// Save to the database
		this.userRepository.save(user);

		// Send an email to verify the emailId
		this.emailService.sendVerificationEmail(user);

		return user;

	}

	public void sendResetPasswordEmail(String emailId) {

		Optional<User> op = this.userRepository.findByEmailId(emailId);

		if (op.isPresent()) {
			this.emailService.sendResetPasswordEmail(op.get());
		} else {
			logger.debug("Email doesn't exist, {}", emailId);
		}
	}

	public void resetPassword(String password) {

		String username = SecurityContextHolder.getContext().getAuthentication().getName();

		User user = this.userRepository.findByUsername(username)
				.orElseThrow(() -> new UserNotFoundException(String.format("Username doesn't exist, %s", username)));

		user.setPassword(this.passwordEncoder.encode(password));

		this.userRepository.save(user);
	}

}
