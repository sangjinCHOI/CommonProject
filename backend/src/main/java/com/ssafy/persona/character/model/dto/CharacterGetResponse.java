package com.ssafy.persona.character.model.dto;

import java.time.LocalDateTime;

import com.ssafy.persona.character.model.Entity.CharacterEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@Getter
@ToString
@AllArgsConstructor
public class CharacterGetResponse {
	private int characterSeq;
	private int userSeq;
	private String userId;
	private String filePath;
	private String nickname;
	private int categorySeq;
	private String introduction;
	private int representativeAchievement;
	private boolean alarmAllow;
	private boolean likeAlarm;
	private boolean replyAlarm;
	private boolean followAlarm;
	private boolean modifyAlarm;
	private int reportedTime;
	private boolean characterActive;
	private LocalDateTime characterCreatedDate;
	private LocalDateTime characterModifiedDate;

}