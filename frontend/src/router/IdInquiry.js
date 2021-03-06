import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Signup.module.css";
import { useHistory } from "react-router";
import "@material-tailwind/react/tailwind.css";
import Logo from "../assets/images/main_logo.png";
import { CardFooter, InputIcon, Button } from "@material-tailwind/react";

import Send from "../config/Send";
import { connect } from "react-redux";
import { saveId } from "../store/user";

function IdInquiry({ userSlice, saveUserId }) {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSubmit(e);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    //  console.log("아이디 찾기");

    Send.get(`/user/email/${email}`)
      .then(({ data }) => {
        saveUserId({
          userId: data.userId,
          userEmail: email,
        });
        history.push("./id_inquiry/result");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onEmailHandler = (e) => {
    const isValidEmail = e.target.value.includes("@") && e.target.value.includes("."); //email 유효성 검사 @와 .포함

    if (!isValidEmail) {
      setShowEmailConfirm(true);
    } else setShowEmailConfirm(false);

    setEmail(e.target.value);
  };

  return (
    <div className={`${styles.center}`}>
      <div id="logo" className={`${styles.logo}`}>
        <img src={Logo} alt="" />
      </div>

      <div>
        <p align="center">가입한 이메일을 입력해 주세요.</p>
        <br />

        <div className="mt-3 mb-5 px-11">
          <div className="bg-white rounded-lg">
            <InputIcon
              type="text"
              color="lightBlue"
              placeholder="E-mail"
              outline={true}
              iconName="person"
              onChange={onEmailHandler}
              onKeyPress={handleKeyPress}
            />
          </div>
          {showEmailConfirm ? <EmailConf></EmailConf> : null}
        </div>
      </div>

      <CardFooter>
        <div className="flex justify-center">
          {/* <Link to="./id_inquiry/result"> */}
          <Button color="lightBlue" buttonType="link" size="lg" ripple="dark" onClick={onSubmit}>
            아이디 찾기
          </Button>
          {/* </Link> */}
          <Link to="../accounts/pw_inquiry">
            <Button color="lightBlue" buttonType="link" size="lg" ripple="dark">
              비밀번호 찾기
            </Button>
          </Link>
        </div>

        <div>
          <Link className="flex justify-center" to="../accounts/login">
            back
          </Link>
        </div>
      </CardFooter>
    </div>
  );
}

function EmailConf(props) {
  return (
    <div className="mb-5">
      <p>올바른 이메일 형식이 아닙니다.</p>
    </div>
  );
}

function mapStateToProps(state) {
  // console.log(state);
  return { userSlice: state.user };
}

function mapDispatchToProps(dispatch) {
  return { saveUserId: (user) => dispatch(saveId(user)) };
}

export default connect(mapStateToProps, mapDispatchToProps)(IdInquiry);
