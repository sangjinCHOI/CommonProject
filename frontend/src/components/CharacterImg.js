// import { Image } from "@material-tailwind/react";
import styles from "./CharacterImg.module.css";
import { useState } from "react";

export default function CharacterImg({
  underText,
  imgWidth = "100px",
  imgSrc = "/images/default_user.png",
  classes,
  lock = false,
  isChange = false,
  imgChangeHandler,
}) {
  const [isClick, setIsClick] = useState(false);
  // console.log("3번", imgSrc);

  const resetImage = () => {
    const previewImage = document.getElementById("profileImg");
    // 기본 이미지도 서버에 저장해야함!(require 이슈) -> 아닐수도
    // previewImage.src = "https://cdn2.thecatapi.com/images/9gg.jpg";
    // previewImage.src = defaultUserImg; // 이건 겉보기
    // previewImage.src = "/images/default_user.png"; // 서버일 때 기본 이미지 주소
    previewImage.src = require(`../assets/images/default_user.png`);

    //// is_active = 0으로 만드는 API 호출 추가 예정
    // 부모 컴포넌트의 함수를 통해 이미지 전달(뺄수도?)
    imgChangeHandler(null);

    setIsClick(!isClick);
  };

  const readImage = (input) => {
    // 인풋 태그에 파일이 있는 경우
    if (input.files && input.files[0]) {
      // 부모 컴포넌트의 함수를 통해 이미지 전달
      imgChangeHandler(input.files[0]);
      // 이미지 파일인지 검사 (생략)

      // FileReader 인스턴스 생성
      const reader = new FileReader();
      // 이미지가 로드가 된 경우
      reader.onload = (e) => {
        const previewImage = document.getElementById("profileImg");
        // console.log(e.target);
        previewImage.src = e.target.result;
      };
      // reader가 이미지 읽도록 하기
      reader.readAsDataURL(input.files[0]);
      setIsClick(!isClick);
    }
  };

  function ProfileClick() {
    return (
      <div className={`${styles.filebox} absolute bg-white w-36 rounded-lg z-50 border`}>
        <div className={`flex justify-center p-1.5`}>
          <label htmlFor="profileChange" style={{ cursor: "pointer" }}>
            파일 선택
          </label>
          <input id="profileChange" type="file" onChange={(e) => readImage(e.target)} />
        </div>
        <hr />
        <div className={`flex justify-center p-1.5`} style={{ cursor: "pointer" }} onClick={resetImage}>
          기본 이미지로
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`${styles.center} ${classes}`}
        style={{
          // height: imgWidth,
          cursor: "pointer",
        }}
      >
        <img
          id="profileImg"
          // src={imgSrc}
          // 캐릭터 생성 후 DB에 있고 imgSrc 잘 넘어 오는데 Cannot find module './assets/files/......'?
          src={require(`../assets${imgSrc}`)}
          alt={require(`../assets${imgSrc}`)}
          // src={require(`../assets/files/2022/2/11/7f922745-e5f5-43f2-bff1-15a56bc8c704_Cross.png`)}
          className={`rounded-full bg-slate-100 ${styles.profileWrapper} ${styles.ProfileImg} ${lock ? "bg-gray-400" : null}`}
          style={{
            // border: "1px solid lightgray",
            height: imgWidth,
            width: imgWidth,
          }}
        />
      </div>
      <div className={`${styles.center}`}>
        {isChange ? (
          <div className={`p-2`}>
            <div className="relative" onClick={() => setIsClick(!isClick)}>
              <div style={{ cursor: "pointer" }}>변경</div>
            </div>
            {isClick ? <ProfileClick /> : null}
          </div>
        ) : (
          <span className="text-center">{underText}</span>
        )}
      </div>
    </div>
  );
}
