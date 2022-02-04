import "@material-tailwind/react/tailwind.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Layout from "./components/Layout";
import SettingLayout from "./components/SettingLayout";

import Characters from "./router/Characters";
import CharactersCreate from "./router/CharactersCreate";
import Home from "./router/Home";
import Signup from "./router/Signup";
import SignupEmail from "./router/SignupEmail";
import Login from "./router/Login";
import IdInquiry from "./router/IdInquiry";
import IdInquiryResult from "./router/IdInquiryResult";
import PwInquiry from "./router/PwInquiry";
import PwInquiryResult from "./router/PwInquiryResult";

import Alarm from "./router/Alarm";
import SettingsCharacter from "./router/SettingsCharacter";
import SettingsAccount from "./router/SettingsAccout";
import SettingsAlarm from "./router/SettingsAlarm";
import SettingsHelp from "./router/SettingsHelp";
import Achievement from "./router/Achievement";
import Profile from "./router/Profile";
import Follow from "./router/Follow";
import CharactersUpdate from "./router/CharactersUpdate";
import Search from "./router/Search";
import SearchCharacters from "./router/SearchCharacters";
import SearchStorages from "./router/SearchStorages";
import SearchTags from "./router/SearchTags";
import SearchTagsDetail from "./router/SearchTagsDetail";
import SearchTexts from "./router/SearchTexts";
import Storages from "./router/Storages";
import StoragesDetail from "./router/StoragesDetail";

function App() {
  return (
    <>
      <Router>
        <Switch>
          {/* Layout 필요 없는 주소 */}
          <Route exact path="/accounts/signup" component={Signup} />
          <Route path="/accounts/signup/email" component={SignupEmail} />
          <Route path="/accounts/login" component={Login} />
          <Route exact path="/accounts/id_inquiry" component={IdInquiry} />
          <Route path="/accounts/id_inquiry/result" component={IdInquiryResult} />
          <Route exact path="/accounts/pw_inquiry" component={PwInquiry} />
          <Route exact path="/accounts/pw_inquiry/result" component={PwInquiryResult} />
          <Route exact path="/characters/select" component={Characters} />
          <Route exact path="/characters/create" component={CharactersCreate} />
          <Route exact path="/characters/update" component={CharactersUpdate} />

          {/* SettingLayout 필요한 주소 */}
          <Route path="/settings/:path?" exact>
            <SettingLayout>
              <Switch>
                <Route exact path="/settings/character" component={SettingsCharacter} />
                <Route exact path="/settings/account" component={SettingsAccount} />
                <Route exact path="/settings/alarm" component={SettingsAlarm} />
                <Route exact path="/settings/help" component={SettingsHelp} />
              </Switch>
            </SettingLayout>
          </Route>

          {/* Layout 필요한 주소 */}
          <Route>
            <Layout>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/alarm/center" component={Alarm} />
                <Route exact path="/search" component={Search} />
                <Route exact path="/search/characters" component={SearchCharacters} />
                <Route exact path="/search/storages" component={SearchStorages} />
                <Route exact path="/search/tags" component={SearchTags} />
                <Route exact path="/search/tag" component={SearchTagsDetail} />
                <Route exact path="/search/texts" component={SearchTexts} />
                {/* characters, login, signup같은 닉네임이 있다면 문제 발생 가능 주의 */}
                <Route exact path="/:nickname" component={Profile} />
                <Route exact path="/:nickname/follow" component={Follow} />
                <Route exact path="/:nickname/achievement" component={Achievement} />
                <Route exact path="/:nickname/storages" component={Storages} />
                <Route exact path="/:nickname/storages/:storage_seq" component={StoragesDetail} />
              </Switch>
            </Layout>
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
