import React, { useState } from "react";
//import userStore from "../store/userStore";
import styles from "./Signup.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Card, CardBody, Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, InputIcon } from "@material-tailwind/react";
import Send from "../config/Send";
import { save } from "../store/characterStore";
import { connect } from "react-redux";

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

function SettingsAccount({ userSlice }) {
  const [showPwModal, setShowPwModal] = useState(false);
  const [showBirthModal, setShowBirthModal] = useState(false);

  const [birth, setBirth] = useState(new Date());
  const [date, setDate] = useState("");

  const [password, setPassword] = useState("");
  // const [changePassword, setChangePassword] = useState("");
  // const [passwordcheck, setpasswordCheck] = useState("");
  const [showPassConfirm, setShowPassConfirm] = useState(false);
  const [showPassEqual, setShowPassEqual] = useState(false);
  const [PassCheckEqual, setPassCheckEqual] = useState(false);
  const [showPassCheckConfirm, setShowPassCheckConfirm] = useState(false);
  const [iddata, setIddata] = useState(userSlice.userId);
  const [emildata, setEmildata] = useState(userSlice.userEmail);
  const [mode, setMode] = useState("pass");

  const changePassword = useInput("");
  const passwordcheck = useInput("");

  const onPasswordHandler = (e) => {
    setPassword(e.target.value);
  };

  const pwd1Valid = () => {
    var regExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
    const specialLetter = regExp.test(changePassword.value);
    const isValidPassword = changePassword.value.length >= 8 && specialLetter >= 1;

    if (!isValidPassword) {
      setShowPassConfirm(true);
    } else {
      setShowPassConfirm(false);
    }
    if (password === changePassword.value) {
      setPassCheckEqual(true);
    } else {
      setPassCheckEqual(false);
    }
  };
  const pwd2Valid = () => {
    if (changePassword.value !== passwordcheck.value) {
      setShowPassCheckConfirm(true);
    } else {
      setShowPassCheckConfirm(false);
    }
  };

  const pwData = {
    userId: iddata,
    userPw: passwordcheck.value,
  };
  const ChangePassBtn = (e) => {
    if (showPassConfirm || showPassEqual || showPassCheckConfirm) {
      alert("??????????????? ????????? ?????????");
    } else {
      Send.put("/user/setting/account", JSON.stringify(pwData))
        .then((data) => {
          if (data.status === 200) {
            setPassword(passwordcheck.value);
            alert("??????????????? ??????????????? ?????????????????????.");
            //^^ ???????????? ????????? ???????????????????????? ?????????
            setShowPwModal(false);
            deleteInput();
          }
        })
        .catch((e) => {
          console.log(e);
          alert("???????????? ????????? ?????????????????????.");
        });
    }
  };

  const deleteInput = () => {
    changePassword.onChange = () => {
      changePassword = "";
    };
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setPassword(e.target.value);

      settingChange();
    }
  };

  const onBirthHandler = (e) => {
    var year = birth.getFullYear();
    var month = birth.getMonth() + 1;
    var day = birth.getDate();

    changeBirthHandler(year + "-" + month + "-" + day);
  };

  const changeBirthHandler = (props) => {
    const birthData = {
      userBirth: props,
      userId: iddata,
    };
    Send.put("/user/setting/account", JSON.stringify(birthData))
      .then((data) => {
        if (data.status === 200) {
          alert("??????????????? ??????????????? ?????????????????????.");
        }
        setShowBirthModal(false);
      })
      .catch((e) => {
        console.log(e);
        alert("???????????? ????????? ?????????????????????.");
      });
  };

  const data = {
    userId: iddata,
    userPw: password,
  };

  const settingChange = (e) => {
    Send.post("/user/setting/verification", JSON.stringify(data))
      .then((data) => {
        if (data.status === 200) {
          // console.log(data);
          setMode("setting");
        } else {
          alert("??????????????? ??????????????????");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getContent = () => {
    if (mode === "pass") {
      return (
        <div className={`${styles.center2}`}>
          <div className="flex mx-20 px-5">
            <div className="bg-white rounded-lg">
              <InputIcon
                type="password"
                color="lightBlue"
                placeholder="password??? ??????????????????"
                outline={true}
                iconName="pin"
                // value={_id}
                onChange={onPasswordHandler}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
        </div>
      );
    } else if (mode === "setting") {
      return (
        <>
          <div className="flex mx-10 mt-20">
            <Card>
              <CardBody className="pt-0 mx-5">
                <div className="overflow-x-auto">
                  <table className="items-center w-full bg-transparent border-collapse">
                    <tbody>
                      <tr>
                        <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-10 py-4 text-left">
                          <span className="text-lg font-bold">?????????</span>
                          <br />
                          <span>{iddata.iddata}</span>
                        </th>
                        <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left"></th>
                      </tr>
                      <tr>
                        <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-10 py-4 text-left">
                          <span className="text-lg font-bold">?????????</span>
                          <br />
                          <span>helloworld@gmail.com </span>
                          {/* <span>{emildata.emildata}</span> */}
                        </th>
                        <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-left"></th>
                      </tr>
                      <tr>
                        <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-10 py-4 text-left">
                          <span className="text-lg font-bold">????????????</span>
                          <br />
                          <span className="invisible">password</span>
                        </th>
                        <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-center">
                          <button className="material-icons" onClick={(e) => setShowPwModal(true)}>
                            arrow_forward_ios
                          </button>
                        </th>
                      </tr>
                      <tr>
                        <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-10 py-4 text-left">
                          <span className="text-lg font-bold">????????????</span>
                          <br />
                          <span>{date}</span>
                        </th>
                        <th className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-center">
                          <button className="material-icons" onClick={(e) => setShowBirthModal(true)}>
                            arrow_forward_ios
                          </button>
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </div>
          {/* ???????????? ?????? modal */}
          <Modal size="regular" active={showPwModal} toggler={() => setShowPwModal(false)}>
            <ModalHeader toggler={() => setShowPwModal(false)} className="text-center">
              ???????????? ??????
            </ModalHeader>
            <hr className="mb-5" />
            <ModalBody>
              <p className="text-base leading-relaxed text-gray-600 font-normal">????????? ??????????????? ???????????????.</p>
              {/* <Input type="password" placeholder="" onKeyUp={ChangePasswordHandler}></Input> */}
              <Input type="password" placeholder="" onKeyUp={pwd1Valid} {...changePassword}></Input>
              {showPassConfirm ? <PassConf></PassConf> : null}
              {PassCheckEqual ? <PassCheckEqualConf></PassCheckEqualConf> : null}
              <span className="invisible">-------------------------------------------------</span>
              <p className="text-base leading-relaxed text-gray-600 font-normal">????????? ??????????????? ?????? ??? ??? ???????????????.</p>
              {/* <Input type="password" placeholder="" onKeyUp={ChangePasswordCheckHandler}></Input> */}
              <Input type="password" placeholder="" onKeyUp={pwd2Valid} {...passwordcheck}></Input>
              {showPassCheckConfirm ? <PassCheckConf></PassCheckConf> : null}
            </ModalBody>
            <ModalFooter>
              {/* <Button color="black" buttonType="link" onClick={(e) => setShowPwModal(false)} ripple="dark"> */}
              <Button color="black" buttonType="link" onClick={() => setShowPwModal(false)} ripple="dark">
                Close
              </Button>

              <Button color="lightBlue" onClick={(e) => ChangePassBtn()} ripple="light">
                ??????
              </Button>
            </ModalFooter>
          </Modal>

          {/* ???????????? ?????? modal */}
          <Modal size="regular" active={showBirthModal} toggler={() => setShowBirthModal(false)}>
            <ModalHeader toggler={() => setShowBirthModal(false)} className="text-center">
              ???????????? ??????
            </ModalHeader>
            <hr className="mb-5" />
            <ModalBody>
              <p className="text-base leading-relaxed text-gray-600 font-normal">??????????????? ???????????????.</p>
              {/* <Input
                id="birthDate"
                name="birthDate"
                type="date"
                placeholder=""
                min="1900-01-01"
                max="2500-12-31"
              ></Input> */}
              <DatePicker selected={birth} onChange={(date) => setBirth(date)}></DatePicker>
              <span className="invisible">-------------------------------------------------</span>
            </ModalBody>
            <ModalFooter>
              <Button color="black" buttonType="link" onClick={(e) => setShowBirthModal(false)} ripple="dark">
                Close
              </Button>

              <Button color="lightBlue" onClick={onBirthHandler} ripple="light">
                ??????
              </Button>
            </ModalFooter>
          </Modal>
        </>
      );
    }
  };

  return <div>{getContent()}</div>;
}

function PassConf(props) {
  return (
    <div className="mb-5">
      <p>??????????????? ????????? ??????, ??????????????? ?????? 8??? ?????? 16?????? ????????? ????????? ?????????.</p>
    </div>
  );
}

function PassCheckConf(props) {
  return (
    <div className="mb-5">
      <p>??????????????? ?????? ?????? ????????????.</p>
    </div>
  );
}

function PassCheckEqualConf(props) {
  return (
    <div className="mb-5">
      <p>?????? ???????????? ?????????????????????.</p>
    </div>
  );
}

function mapStateToProps(state) {
  return { userSlice: state.user };
}

function mapDispatchToProps(dispatch) {
  return { saveCharacter: (user) => dispatch(save(user)) };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsAccount);
