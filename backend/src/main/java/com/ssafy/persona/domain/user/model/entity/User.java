package com.ssafy.persona.domain.user.model.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Getter
@AllArgsConstructor
@RequiredArgsConstructor
@ToString
@Builder
public class User {
	@Id
	private int userSeq;
	@Column
	private String userId;
	@Column
	private String userPw;
	@Column
	private String userEmail;
	@Column
	private boolean emailIsAuth;
	@Column
	private String userBirth;
	@Column
	private boolean userIsActive;
	@Column
	private LocalDateTime userCreatedDate;
	@Column
	private LocalDateTime userModifiedDate;
	@Column
	private int userCreatableCount;
	
	public void setUserPw(String userPw) {
		this.userPw = userPw;
	}
}
