package com.ssafy.persona.content.model.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class ReplyLike {
	@Id
	private int replyLikeSeq;
	@Column
	private int replySeq;
	@Column
	private int characterSeq;
}
