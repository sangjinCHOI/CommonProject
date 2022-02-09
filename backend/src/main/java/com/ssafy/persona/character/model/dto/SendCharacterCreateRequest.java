package com.ssafy.persona.character.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@ToString
public class SendCharacterCreateRequest {
    private int userSeq;
    private int categorySeq;
    private String nickname;
    private String introduction;
}
