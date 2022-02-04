package com.ssafy.persona.search.service;

import java.util.List;

import com.ssafy.persona.search.model.dto.HistoryCreateRequest;
import com.ssafy.persona.search.model.dto.SearchContentResponse;
import com.ssafy.persona.search.model.dto.SearchPeopleResponse;
import com.ssafy.persona.search.model.dto.SearchStorageResponse;
import com.ssafy.persona.search.model.dto.SearchTagResponse;

public interface SearchService {

	List<SearchPeopleResponse> searchPeople(String text);
	
	List<SearchContentResponse> searchContent(String text);
	
	List<SearchStorageResponse> searchStorage(String text);
	
	List<SearchTagResponse> searchTag(String text);
	
	int searchRecord(HistoryCreateRequest request);
	
	List<String> realTimePopularWord();
	
	List<String> getHistory(int characterSeq);
	
}
