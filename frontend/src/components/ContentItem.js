import { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { Image, Label } from "@material-tailwind/react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as hs } from "@fortawesome/free-solid-svg-icons";
import { faHeart as hr } from "@fortawesome/free-regular-svg-icons";
import MainCard from "../components/MainCard";
import ContentUpdate from "./ContentUpdate";
import Report from "../components/Report";
import NewStorage from "./NewStorage";
import Comment from "./Comment";
import Send from "../config/Send";

const timeDifference = (time) => {
  const offset = new Date().getTimezoneOffset() * 60000;
  const nowTime = new Date(Date.parse(new Date()) - offset).toISOString(); // 현재 한국 시간
  const [nowYear, nowMonth, nowDay] = nowTime
    .split("T")[0]
    .split("-")
    .map((item) => parseInt(item));
  const [nowHour, nowMinute, nowSecond] = nowTime
    .split("T")[1]
    .split(":")
    .map((item) => parseInt(item));
  const [year, month, day] = time
    .split("T")[0]
    .split("-")
    .map((item) => parseInt(item));
  const [hour, minute, second] = time
    .split("T")[1]
    .split(":")
    .map((item) => parseInt(item));

  // n일 전을 정확하게 구하기 위한 presetMonth
  let presetMonth = 30;
  if (month === 2) {
    presetMonth = 28;
  } else if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
    presetMonth = 31;
  } else {
    presetMonth = 30;
  }

  // n년 전
  if (nowYear > year) {
    if ((nowYear - year) * 12 + nowMonth - month >= 12) {
      let n = nowYear - year;
      return `${n}년 전`;
    }
  }
  // n달 전
  // 한 달이 28, 29, 30, 31일인 경우는 현재 고려하지 않은 상태
  if (nowMonth > month) {
    if ((nowMonth - month) * 30 + nowDay - day >= 30) {
      let n = nowMonth - month;
      return `${n}달 전`;
    }
  } else if (nowMonth < month) {
    let n = nowMonth + 12 - month;
    return `${n}달 전`;
  }
  // n일 전
  if (nowDay > day) {
    if ((nowDay - day) * 24 + nowHour - hour >= 24) {
      let n = nowDay - day;
      return `${n}일 전`;
    }
  } else if (nowDay < day && nowMonth % 12 === (month + 1) % 12) {
    let n = nowDay + presetMonth - day;
    return `${n}일 전`;
  }
  // n시간 전
  if (nowHour > hour) {
    if ((nowHour - hour) * 60 + nowMinute - minute >= 60) {
      let n = nowHour - hour;
      return `${n}시간 전`;
    }
  } else if (nowHour < hour && nowDay % 30 === (day + 1) % 30) {
    let n = nowHour + 24 - hour;
    return `${n}시간 전`;
  }
  // n분 전
  if (nowMinute > minute) {
    if ((nowMinute - minute) * 60 + nowSecond - second >= 60) {
      let n = nowMinute - minute;
      return `${n}분 전`;
    }
  } else if (nowMinute < minute && nowHour % 24 === (hour + 1) % 24) {
    let n = nowMinute + 60 - minute;
    return `${n}분 전`;
  }
  // n초 전
  if (nowSecond > second) {
    let n = nowSecond - second;
    return `${n}초 전`;
  } else if (nowSecond < second && nowMinute % 60 === (minute + 1) % 60) {
    let n = nowSecond + 60 - second;
    return `${n}초 전`;
  }
  // n초 전 예외
  if (nowMinute !== minute) {
    let n = nowSecond + 60 - second;
    return `${n}초 전`;
  }
  return `방금 전`;
};

function ContentItem(props) {
  const priorityContent = props.priorityContent ? props.priorityContent : null;
  // console.log("priorityContent", priorityContent);
  const [reportModal, setReportModal] = useState(false);
  const handleReportClose = () => {
    setReportModal(false);
  };
  const [newStorageModal, setNewStorageModal] = useState(false);
  const handleNewStorageClose = () => {
    setNewStorageModal(false);
  };
  const [commentModal, setCommentModal] = useState(false);
  const handleCommentClose = () => {
    setCommentModal(false);
  };

  // 피드 게시물
  let feedContents = props.contents;
  if (feedContents) {
    if (feedContents.length > 1) {
      feedContents.sort((a, b) => (a.contentSeq > b.contentSeq ? 1 : -1));
      // priorityContent가 있다면 맨 뒤에 push(나중에 reverse 하기 때문)
      if (priorityContent) {
        feedContents.push(priorityContent);
      }
    }
    // 피드 게시물은 없지만 priorityContent가 있을 때
  } else if (priorityContent) {
    feedContents = priorityContent;
  }

  // 게시글 수정
  const [contentCreateModal, setContentCreateModal] = useState(false);
  const handleClose = () => {
    setContentCreateModal(false);
  };

  // 댓글 작성
  const [replyText, setReplyText] = useState("");
  const handleReplyTextChange = (e) => {
    setReplyText(e.target.value);
  };
  const postComment = (contentSeq, replyText, e) => {
    e.preventDefault();
    const data = {
      characterSeq: props.characterSlice.characterSeq,
      contentSeq: contentSeq,
      replyText: replyText,
    };
    Send.post("/content/reply", JSON.stringify(data)).then((res) => {
      if (res.status === 200) {
        props.getFeed();
      }
      setReplyText("");
    });
  };

  //댓글 불러오기
  const [comments, setComments] = useState([]);
  const getComment = (contentSeq, e) => {
    e.preventDefault();
    console.log(contentSeq);
    console.log(e);
    Send.get(`/content/reply/${contentSeq}`, {
      params: {
        characterNow: props.characterSlice.characterSeq,
        contentSeq: contentSeq,
      },
    })
      .then((res) => {
        if (res.data) {
          setComments(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  // 좋아요
  const postLike = (contentSeq, e) => {
    e.preventDefault();
    const data = {
      characterSeq: props.characterSlice.characterSeq,
      contentSeq: contentSeq,
    };
    Send.post("/content/like", JSON.stringify(data)).then((res) => {
      if (res.status === 200) {
        props.getFeed();
      }
    });
  };

  // 좋아요취소
  const deleteLike = (contentSeq, e) => {
    e.preventDefault();
    Send.delete("/content/like", {
      params: {
        characterSeq: props.characterSlice.characterSeq,
        contentSeq: contentSeq,
      },
    }).then((res) => {
      if (res.status === 200) {
        props.getFeed();
      }
    });
  };

  // 저장하기
  const postStore = (contentSeq, storageSeq, e) => {
    e.preventDefault();
    const data = {
      characterSeq: props.characterSlice.characterSeq,
      contentSeq: contentSeq,
      storageSeq: storageSeq,
    };
    Send.post("/content/store", JSON.stringify(data)).then((res) => {
      if (res.status === 200) {
        // if (props.characterSlice.alarmAllow || props.characterSlice.modifyAlarm) {
        //   const alarmData = {
        //     alarmDate: new Date().toISOString(),
        //     alarmType: 4,
        //     characterSeq: props.characterSlice.characterSeq, // 상대방(알람을 받을) 캐릭터
        //     relationTb: "tb_storage", // 관련 테이블(tb_character or tb_storage or tb_achievement)
        //     targetSeq: storageSeq, // 본인 캐릭터or저장소or업적의 일련번호(storageSeq or achievementSeq)
        //   };
        //   Send.post("/character/alarm", JSON.stringify(alarmData)).then((res) => console.log(res));
        // }
      }
    });
  };

  return (
    <>
      <Comment comments={comments} isOpen={commentModal} onCancel={handleCommentClose} style={{ zIndex: 2 }} />
      <Report content={props.content} isOpen={reportModal} onCancel={handleReportClose} style={{ zIndex: 2 }} />
      <NewStorage content={props.content} isOpen={newStorageModal} onCancel={handleNewStorageClose} style={{ zIndex: 2 }} />
      <ContentUpdate content={props.content} isOpen={contentCreateModal} onCancel={handleClose} style={{ zIndex: 2 }} />
      <MainCard classes="mb-3" max-height="900px">
        <div style={{ height: 60 }} className="p-4 flex justify-between">
          <Link to={{ pathname: `/${props.content.contentWriter}` }}>
            <div className="text-xl flex">
              {props.content.writerProfile ? (
                <Image
                  src={require(`../assets${props.content.writerProfile}`)}
                  style={{ width: 32, height: 32 }}
                  rounded={true}
                  raised={false}
                  alt=""
                />
              ) : (
                //<Image src="../assets/images/default_user.png" rounded={true} raised={false} alt="" style={{ width: 32, height: 32 }} />
                <Image src={require(`../assets/images/default_user.png`)} rounded={true} raised={false} alt="" style={{ width: 32, height: 32 }} />
              )}
              <p className="ml-2">{props.content.contentWriter}</p>
            </div>
          </Link>
          <Menu as="div" className="mx-2 relative" style={{ zIndex: 5 }}>
            <Menu.Button className="flex text-sm">
              <span className="material-icons">more_horiz</span>
            </Menu.Button>
            {props.content.characterSeq === props.characterSlice.characterSeq ? (
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white flex flex-col border-2">
                <Menu.Item>
                  <button onClick={() => setContentCreateModal(true)}>수정</button>
                </Menu.Item>
                <Menu.Item>
                  <button
                    className="mx-4"
                    onClick={() => {
                      console.log(props.content.contentSeq);
                      Send.delete("/content", {
                        params: {
                          contentSeq: props.content.contentSeq,
                        },
                      }).then((res) => {
                        console.log(res.data);
                      });
                    }}
                  >
                    삭제
                  </button>
                </Menu.Item>
              </Menu.Items>
            ) : (
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white flex flex-col border-2">
                <Menu.Item>
                  <button className="mx-4" onClick={() => setReportModal(true)}>
                    게시글 신고
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button className="mx-4">팔로우</button>
                </Menu.Item>
              </Menu.Items>
            )}
          </Menu>
        </div>
        <div>
          {props.content.contentFileName ? (
            <Carousel dynamicHeight={true} showArrows={true} showThumbs={false} width="600px" className="flex items-center">
              {props.content.contentFilePath.split("|").map((filePath, index) => {
                return (
                  <div className="flex justify-center bg-slate-100" style={{ height: 600 }} key={index}>
                    <img
                      style={{
                        maxWidth: 600,
                        maxHeight: 600,
                        width: "auto",
                        height: "auto",
                        objectFit: "cover",
                      }}
                      src={require(`../assets${filePath + props.content.contentFileName.split("|")[index]}`)}
                      alt=""
                    />
                  </div>
                );
              })}
            </Carousel>
          ) : null}
        </div>
        <div className="px-4 py-2">
          {props.content.contentText.split("\n").map((line, index) => {
            return (
              <span key={index}>
                {line}
                <br />
              </span>
            );
          })}
        </div>
        <div className="px-4 pt-2 flex flex-wrap">
          {props.content.tags
            ? props.content.tags.split("|").map((tag, index) => {
                return (
                  <Link to={{ pathname: "/search/tag", search: `?detail=${tag}` }} className="mb-1 mr-1" key={index}>
                    <Label color="lightGreen">{tag}</Label>
                  </Link>
                );
              })
            : null}
        </div>
        <div className="text-slate-400 px-4">{timeDifference(props.content.contentCreatedDate)}</div>
        <div className="px-4 py-2 flex justify-between">
          <div className="flex items-center">
            <button className="flex items-center">
              {props.content.contentIsLike ? (
                <FontAwesomeIcon icon={hs} size="lg" style={{ color: "red" }} onClick={(e) => deleteLike(props.content.contentSeq, e)} />
              ) : (
                <FontAwesomeIcon icon={hr} size="lg" onClick={(e) => postLike(props.content.contentSeq, e)} />
              )}
            </button>
            <button className="mx-1 pb-1">
              <span>{props.content.contentLike}</span>
            </button>
            <div className="invisible">--</div>
            <button
              className="flex items-center"
              onClick={(e) => {
                setCommentModal(true);
                getComment(props.content.contentSeq, e);
              }}
            >
              <span className="material-icons mr-1">chat_bubble_outline</span>
              <span className="pb-1">{props.content.replyCount}</span>
            </button>
          </div>
          <div className="flex items-center">
            <Menu as="div" className="mx-2 relative" style={{ zIndex: 6 }}>
              <Menu.Button className="flex text-sm">
                {props.content.contentIsStore ? (
                  <span className="material-icons">library_add_check</span>
                ) : (
                  <span className="material-icons-outlined">library_add</span>
                )}
              </Menu.Button>
              <Menu.Items
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md border-2 shadow-lg py-1 bg-white flex flex-col"
                style={{ overflowY: "scroll", maxHeight: 120 }}
              >
                <Menu.Item>
                  <button className="mx-4" onClick={() => setNewStorageModal(true)}>
                    새 저장목록 생성
                  </button>
                </Menu.Item>
                {props.storages
                  ? props.storages.map((storage, index) => {
                      return (
                        <Menu.Item key={index}>
                          <button className="mx-4" onClick={(e) => postStore(props.content.contentSeq, storage.storageSeq, e)}>
                            {storage.storageName}
                          </button>
                        </Menu.Item>
                      );
                    })
                  : null}
              </Menu.Items>
            </Menu>
            <span className="pb-1">{props.content.contentSave}</span>
          </div>
        </div>
        <hr />
        <div className="px-4 py-2 flex justify-between self-center">
          <div className="flex">
            <div>
              {props.characterSlice.filePath ? (
                <Image
                  src={require(`../assets${props.characterSlice.filePath + props.characterSlice.fileName}`)}
                  style={{ width: 32, height: 32 }}
                  rounded={true}
                  raised={false}
                  alt=""
                />
              ) : (
                <Image src={require(`../assets/images/default_user.png`)} style={{ width: 32, height: 32 }} rounded={true} raised={false} alt="" />
              )}
            </div>
            <textarea
              value={replyText}
              onChange={handleReplyTextChange}
              className="mx-4"
              type="text"
              placeholder="댓글 달기..."
              style={{ height: 25, width: 400, marginTop: 3 }}
            />
          </div>
          <button
            className="px-2 pb-0.5 rounded-md bg-slate-200"
            onClick={(e) => {
              if (replyText) {
                postComment(props.content.contentSeq, replyText, e);
              }
            }}
          >
            작성
          </button>
        </div>
      </MainCard>
    </>
  );
}

function mapStateToProps(state) {
  return { characterSlice: state.character };
}

export default connect(mapStateToProps)(ContentItem);
