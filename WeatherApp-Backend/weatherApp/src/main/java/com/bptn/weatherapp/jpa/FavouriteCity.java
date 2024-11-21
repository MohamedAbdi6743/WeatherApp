package com.bptn.weatherapp.jpa;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "\"favouriteCity\"")
public class FavouriteCity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "\"favouriteCityId\"")
	private Integer favouriteCityId;

	@Column(name = "\"createdOn\"")
	private Timestamp createdOn;

	@ManyToOne
	@JsonManagedReference
	@JoinColumn(name = "\"cityId\"")
	private Integer cityId;

	@ManyToOne
	@JsonIgnore
	@JoinColumn(name = "\"userId\"")
	private Integer userId;

	public FavouriteCity() {
	}

	public Integer getFavouriteCityId() {
		return favouriteCityId;
	}

	public void setFavouriteCityId(Integer favouriteCityId) {
		this.favouriteCityId = favouriteCityId;
	}

	public Timestamp getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Timestamp createdOn) {
		this.createdOn = createdOn;
	}

	public Integer getCityId() {
		return cityId;
	}

	public void setCityId(Integer cityId) {
		this.cityId = cityId;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	@Override
	public String toString() {
		return "FavouriteCity [favouriteCityId=" + favouriteCityId + ", createdOn=" + createdOn + ", cityId=" + cityId
				+ ", userId=" + userId + "]";
	}

}
