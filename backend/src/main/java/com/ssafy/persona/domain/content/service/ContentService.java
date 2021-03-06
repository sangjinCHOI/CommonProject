package com.ssafy.persona.domain.content.service;

import java.util.List;

import com.ssafy.persona.domain.content.model.dto.ContentCreateRequest;
import com.ssafy.persona.domain.content.model.dto.ContentGetResponse;
import com.ssafy.persona.domain.content.model.dto.ContentLikeRequest;
import com.ssafy.persona.domain.content.model.dto.ContentListRequest;
import com.ssafy.persona.domain.content.model.dto.LikeListResponse;
import com.ssafy.persona.domain.content.model.dto.ContentModifyRequest;
import com.ssafy.persona.domain.content.model.dto.ContentReportRequest;
import com.ssafy.persona.domain.content.model.dto.ReplyCreateRequest;
import com.ssafy.persona.domain.content.model.dto.ReplyGetResponse;
import com.ssafy.persona.domain.content.model.dto.ReplyLikeRequest;
import com.ssafy.persona.domain.content.model.dto.ReplyModifyRequest;
import com.ssafy.persona.domain.content.model.dto.ReplyReportRequest;

public interface ContentService {
	int contentCreate(ContentCreateRequest contentCreateRequest);
	boolean contentModify(ContentModifyRequest contentModifyRequest);
	boolean contentDelete(int contentSeq);
	ContentGetResponse contentGet(int characterNow, int contentSeq);
	
	boolean hashtagCreate(String[] hashtag, int contentSeq);
	boolean hashtagModify(String[] hashtag, int contentSeq);
	List<String> hashtagGet(int contentSeq);
	
	boolean replyCreate(ReplyCreateRequest replyCreateRequest);
	boolean replyModify(ReplyModifyRequest replyModifyRequest);
	boolean replyDelete(int replySeq);
	List<ReplyGetResponse> replyList(int characterNow, int contentSeq);
	
	boolean contentReport(ContentReportRequest contentReportRequest);
	void contentReportUpdate(int reportedContent);
	void characterReportUpdate(int reportedContent);
	
	boolean replyReport(ReplyReportRequest replyReportRequest);
	void replyReportUpdate(int reportedReply);
	void characterReplyReportUpdate(int reportedReply);
	
	boolean contentLike(ContentLikeRequest contentLikeRequest);
	void contentLikeUpdate(int contentSeq);
	
	boolean contentDislike(int characterSeq, int contentSeq);
	void contentDislikeUpdate(int contentSeq);
	
	List<LikeListResponse> contentLikeList(int contentSeq);
	List<LikeListResponse> replyLikeList(int replySeq);
	
	boolean replyLike(ReplyLikeRequest replyLikeRequest);
	void replyLikeUpdate(int replySeq);
	
	boolean replyDislike(int characterSeq, int replySeq);
	void replyDislikeUpdate(int replySeq);
	
	List<ContentGetResponse> contentList(ContentListRequest contentListRequest);

}