package com.ssafy.persona.search.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@Getter
@ToString
public class SearchTagResponse {
	private String tagText;
	private int tagCount;

}
