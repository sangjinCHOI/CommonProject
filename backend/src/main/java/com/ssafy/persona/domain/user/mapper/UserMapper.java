package com.ssafy.persona.domain.user.mapper;

import com.ssafy.persona.domain.user.model.dto.UserGetResponse;
import com.ssafy.persona.domain.user.model.entity.User;
import org.apache.ibatis.annotations.Mapper;

import com.ssafy.persona.domain.user.model.dto.UpdateCountRequest;

@Mapper
public interface UserMapper {
	int seqIsValid(String userId);
	UserGetResponse getUser(String userId);
	int userValid(String userId);
	int userSignup(User user);
	int checkPw(User user);
	int checkEmail(String userEmail);
	int changePw(User user);
	int changeBirth(User user);
	String getUserId(String userEmail);
	int userActive(String userEmail);
	int userLogin(User user);
	Integer getUserSeq(String userId);
	int emailIsValid(String userId);
	String getUserEmail(String userId);
	int getCreatableCount(int userSeq);
	int updateCreatableCount(UpdateCountRequest request);
	int isValid(String userId);
}
