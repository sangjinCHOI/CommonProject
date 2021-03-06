package com.ssafy.persona.domain.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
public class MailVerifyRequest {
	private String userId;
	private String authText;
}
