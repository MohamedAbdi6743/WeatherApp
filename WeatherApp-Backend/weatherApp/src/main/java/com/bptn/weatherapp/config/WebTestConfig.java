package com.bptn.weatherapp.config;

import java.sql.SQLException;

import org.h2.tools.Server;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.bptn.weatherapp.provider.ResourceProvider;

@Configuration
@Profile("test")
public class WebTestConfig {

	final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	ResourceProvider resourceProvider;

	@Bean(destroyMethod = "stop")
	Server inMemoryH2DatabaseServer() throws SQLException {

		Server server = Server.createTcpServer(this.resourceProvider.getH2ServerParams());

		try {
			server.start();
		} catch (SQLException e) {
			// Another app context (e.g. a second test class) already holds the port; the app works without it.
			logger.warn("H2 TCP server not started: {}", e.getMessage());
		}

		return server;
	}
}
