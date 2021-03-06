import CharacterImg from "../components/CharacterImg";
import { Button, Label } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MainCard from "../components/MainCard";
import Send from "../config/Send";
import { connect } from "react-redux";
import styles from "./Follow.module.css";
import { useParams } from "react-router-dom";

// 현재 해당 페이지에서 코드 수정 후 새로고침 하는 경우에 중복 랜더링되는 버그 존재
// useEffect 관련 이슈?

// 나랑 다른 캐릭터를 보고 있으면 버튼 안보이게 구현하자

const useInput = (initialValue, validator) => {
  const [value, setValue] = useState(initialValue);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    let willUpdate = true;
    if (typeof validator === "function") {
      willUpdate = validator(value);
    }
    if (willUpdate) {
      setValue(value);
    }
  };
  return { value, onChange };
};

// 현재 내 캐릭터의 팔로우 현황만 볼 수 있는데, characterSlice로 하는게 아니라 남의 캐릭도 볼 수 있게 바꿔야 함
// 다른 사람이 들어왔을 때 보이는 버튼 적절히 수정해야 함!
function Follow({ characterSlice }) {
  const [changePage, setChangePage] = useState(false);
  const { nickname } = useParams();
  const [character, setCharacter] = useState([]);
  const getCharacter = () => {
    Send.get(`/character/profile/${nickname}`).then((res) => {
      const characterSeq = res.data.characterSeq;
      Send.get(`/character/${characterSeq}`).then((res) => {
        setCharacter(res.data); // 페이지 유저 데이터
        // character 가져온 뒤 리스트 가져오는 함수 실행
        getFollowerList(res.data);
        getFolloweeList(res.data);
      });
    });
  };

  const searchText = useInput("");

  const [followerList, setFollowerList] = useState([]);
  const [followeeList, setFolloweeList] = useState([]);
  const getFollowerList = (character) => {
    // 해당 페이지의 캐릭터를 기준으로 리스트를 불러오는데
    // 버튼도 역시 그 캐릭터를 기준으로 랜더링 하는 현황
    const data = {
      followee: character.characterSeq, // 해당 페이지의 캐릭터
      nickname: "",
    };
    Send.post("/character/followers", JSON.stringify(data)).then((res) => {
      setFollowerList([]); // 이게 있어야 코드 수정 후 저장할 때 중복으로 안가져옴
      res.data.forEach((follower) => {
        Send.get(`/character/${follower.follower}`).then((res) => {
          // 캐릭터 데이터가 있다면
          if (res.data) {
            // setFollowerList((followerList) => [res.data, ...followerList]);
            // 팔로우or삭제 버튼 구별을 위해서 followToo를 리스트에 담아서 저장
            setFollowerList((followerList) => [[res.data, follower.followToo], ...followerList]);
          }
        });
      });
    });
  };
  const getFolloweeList = (character) => {
    const data = {
      follower: character.characterSeq, // 해당 페이지의 캐릭터
      nickname: "",
    };
    Send.post("/character/followees", JSON.stringify(data)).then((res) => {
      setFolloweeList([]); // 이게 있어야 코드 수정 후 저장할 때 중복으로 안가져옴
      res.data.forEach((followee) => {
        Send.get(`/character/${followee.followee}`).then((res) => {
          // 캐릭터 데이터가 있다면
          if (res.data) {
            setFolloweeList((followeeList) => [res.data, ...followeeList]);
          }
        });
      });
    });
  };

  useEffect(() => {
    getCharacter();
  }, []);

  useEffect(() => {
    getFollowerList(character);
    getFolloweeList(character);
  }, [changePage]);

  const [isFollowerTab, setIsFollowerTab] = useState(true);

  const follow = (followerSeq, e) => {
    e.preventDefault();
    const data = {
      followee: followerSeq,
      follower: characterSlice.characterSeq,
    };
    // 팔로우 알람 보내기
    Send.post("/character/follow", JSON.stringify(data))
      .then((res) => {
        if (res.status === 200) {
          setChangePage(!changePage);
          // 상대방 캐릭터 정보 가져와서
          Send.get(`/character/${followerSeq}`).then((res) => {
            const character = res.data;
            // 팔로우 알람 보내기
            if (character.followAlarm || character.alarmAllow) {
              const alarmData = {
                alarmDate: new Date().toISOString(),
                // alarmIsRead: false,
                // alarmText: `${followerNickname}님이 회원님을 팔로우하기 시작했습니다.`,
                alarmType: 1,
                characterSeq: followerSeq, // 상대방
                relationTb: "tb_character", // 관련 테이블
                targetSeq: characterSlice.characterSeq, // 본인 캐릭터or저장소or업적
                // userSeq: 0
              };
              Send.post("/character/alarm", JSON.stringify(alarmData)).then((res) => {
                // console.log(res)
              });
            }
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const deleteFollow = (followerSeq, e) => {
    e.preventDefault();
    const data = {
      followee: characterSlice.characterSeq,
      follower: followerSeq,
    };
    Send.delete("/character/follow", { data: JSON.stringify(data) })
      .then((res) => {
        setChangePage(!changePage);
        // console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const unfollow = (followeeSeq, e) => {
    e.preventDefault();
    const data = {
      followee: followeeSeq,
      follower: characterSlice.characterSeq,
    };
    Send.delete("/character/follow", { data: JSON.stringify(data) })
      .then((res) => {
        setChangePage(!changePage);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="px-16">
      <MainCard classes="border rounded-xl pb-8">
        <div className="flex justify-center items-center">
          <Button
            className={`px-20 py-5 w-60 text-center text-xl border-2 border-white ${isFollowerTab ? "bg-sky-500" : "bg-gray-300 text-gray-300"}`}
            buttonType="outline"
            onClick={() => {
              setIsFollowerTab(true);
            }}
          >
            팔로워
          </Button>
          <Button
            className={`px-20 py-5 w-60 text-center text-xl border-2 border-white ${isFollowerTab ? "bg-gray-300 text-gray-300" : "bg-sky-500"}`}
            buttonType="outline"
            onClick={() => {
              setIsFollowerTab(false);
            }}
          >
            팔로우
          </Button>
        </div>
        <div className="relative flex justify-center items-center p-2">
          <input className="w-96 border rounded-lg px-4 py-2" type="text" placeholder="캐릭터 검색" {...searchText} />
          <span className="material-icons absolute right-12">search</span>
        </div>
        <div className={`${styles.box} overflow-y-auto`} style={{ height: "550px" }}>
          {isFollowerTab // 팔로워 탭일 때
            ? searchText.value.length >= 2 // 2글자 이상 검색 시
              ? followerList // 리스트 필터링
                  .filter((follower) => follower[0].nickname.includes(searchText.value))
                  .map((follower) => (
                    <div className="flex justify-between mx-12 items-center" key={follower[0].characterSeq}>
                      <Link to={`../${follower[0].nickname}`} className="flex justify-between items-center">
                        <div className="m-3">
                          <CharacterImg
                            imgWidth="50px"
                            imgSrc={
                              follower[0].filePath === null || follower[0].fileName === null
                                ? "/images/default_user.png"
                                : follower[0].filePath + follower[0].fileName
                            }
                          />
                        </div>
                        <div className="w-36">{follower[0].nickname}</div>
                      </Link>
                      <div className="ml-12 mr-3">
                        {character.characterSeq === characterSlice.characterSeq ? (
                          !follower[1] ? (
                            <Link
                              to=""
                              onClick={(e) => {
                                follow(follower[0].characterSeq, e);
                              }}
                            >
                              <Label color="lightBlue" className={`${styles.customRadius} ${styles.clickFollowBtn}`}>
                                팔로우
                              </Label>
                            </Link>
                          ) : (
                            <Link
                              to=""
                              onClick={(e) => {
                                deleteFollow(follower[0].characterSeq, e);
                              }}
                            >
                              <Label color="blueGray" className={`ml-3 mr-2 ${styles.customRadius} ${styles.clickUnfollowBtn}`}>
                                삭제
                              </Label>
                            </Link>
                          )
                        ) : null}
                      </div>
                    </div>
                  ))
              : // 2글자 미만일 때 리스트 필터링X
                followerList.map((follower) => (
                  <div className="flex justify-between mx-12 items-center" key={follower[0].characterSeq}>
                    <Link to={`../${follower[0].nickname}`} className="flex justify-between items-center">
                      <div className="m-3">
                        <CharacterImg
                          imgWidth="50px"
                          imgSrc={
                            follower[0].filePath === null || follower[0].fileName === null
                              ? "/images/default_user.png"
                              : follower[0].filePath + follower[0].fileName
                          }
                        />
                      </div>
                      <div className="w-36">{follower[0].nickname}</div>
                    </Link>
                    <div className="ml-12 mr-3">
                      {character.characterSeq === characterSlice.characterSeq ? (
                        !follower[1] ? (
                          <Link
                            to=""
                            onClick={(e) => {
                              follow(follower[0].characterSeq, e);
                            }}
                          >
                            <Label color="lightBlue" className={`${styles.customRadius} ${styles.clickFollowBtn}`}>
                              팔로우
                            </Label>
                          </Link>
                        ) : (
                          <Link
                            to=""
                            onClick={(e) => {
                              deleteFollow(follower[0].characterSeq, e);
                            }}
                          >
                            <Label color="blueGray" className={`ml-3 mr-2 ${styles.customRadius} ${styles.clickUnfollowBtn}`}>
                              삭제
                            </Label>
                          </Link>
                        )
                      ) : null}
                    </div>
                  </div>
                ))
            : // 팔로우 탭일 때
            searchText.value.length >= 2 // 2글자 이상 검색 시
            ? followeeList // 리스트 필터링
                .filter((followee) => followee.nickname.includes(searchText.value))
                .map((followee) => (
                  <div className="flex justify-between mx-12 items-center" key={followee.characterSeq}>
                    <Link to={`../${followee.nickname}`} className="flex justify-between items-center">
                      <div className="m-3">
                        <CharacterImg
                          imgWidth="50px"
                          imgSrc={
                            followee.filePath === null || followee.fileName === null
                              ? "/images/default_user.png"
                              : followee.filePath + followee.fileName
                          }
                        />
                      </div>
                      <div className="w-36">{followee.nickname}</div>
                    </Link>
                    <div className="ml-12 mr-3">
                      {character.characterSeq === characterSlice.characterSeq ? (
                        <Link
                          to=""
                          onClick={(e) => {
                            unfollow(followee.characterSeq, e);
                          }}
                        >
                          <Label color="blueGray" className={`${styles.customRadius} ${styles.clickUnfollowBtn}`}>
                            언팔로우
                          </Label>
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ))
            : // 2글자 미만일 때 리스트 필터링X
              followeeList.map((followee) => (
                <div className="flex justify-between mx-12 items-center" key={followee.characterSeq}>
                  <Link to={`../${followee.nickname}`} className="flex justify-between items-center">
                    <div className="m-3">
                      <CharacterImg
                        imgWidth="50px"
                        imgSrc={
                          followee.filePath === null || followee.fileName === null
                            ? "/images/default_user.png"
                            : followee.filePath + followee.fileName
                        }
                      />
                    </div>
                    <div className="w-36">{followee.nickname}</div>
                  </Link>
                  <div className="ml-12 mr-3">
                    {character.characterSeq === characterSlice.characterSeq ? (
                      <Link
                        to=""
                        onClick={(e) => {
                          unfollow(followee.characterSeq, e);
                        }}
                      >
                        <Label color="blueGray" className={`${styles.customRadius} ${styles.clickUnfollowBtn}`}>
                          언팔로우
                        </Label>
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))}
        </div>
      </MainCard>
    </div>
  );
}

function mapStateToProps(state) {
  return { characterSlice: state.character };
}

export default connect(mapStateToProps)(Follow);
