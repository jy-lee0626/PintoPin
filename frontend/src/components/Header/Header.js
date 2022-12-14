import * as React from "react";
import "./Header.css";
import whitePIN from "../../assets/whitePIN.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
// react-icon
import { FaHome, FaPlus, FaSearch, FaCog } from "react-icons/fa";
// mui
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Checkbox, TextField, Box, Backdrop, CircularProgress } from "@mui/material";
import { SET_CHANNELLIST } from "../../redux/ChannelList";
// import { makeStyles } from "@material-ui/core/styles";

import ChannelTest from "./ChannelTest";

// redux
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { getParticipantListByUser } from "../../api/participant";
import { registerChannel } from "../../api/channel";
import { getChannelInfo } from "../../api/channel";
import { registerParticipant } from "../../api/participant";

import { getFile, registerFile } from "../../api/file";
import MypageSetting from "../Mypage/MypageSetting";
import { getUserProfile } from "../../api/user";

// import UpdateChannelInfoDialog from "../UpdateChannelInfoDialog";

// const Transition = React.forwardRef(function Transition(
//   props: TransitionProps & {
//     children: React.ReactElement<any, any>,
//   },
//   ref: React.Ref<unknown>
// ) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// const useStyles = makeStyles({
//   input: {
//     color: "white",
//   },
// });

export default function Header(props) {
  useEffect(() => {
    getUserProfile(
      token,
      (response) => {
        console.log("", response.data.userRes);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const [backdropOpen, setBackdropOpen] = React.useState(true);
  // const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openUser, setOpenUser] = React.useState(false);
  const [checked, setChecked] = React.useState(false);

  const [channelName, setChannelName] = React.useState("");
  const [channelDesc, setChannelDesc] = React.useState("");
  const [channelTag, setChannelTag] = React.useState("");
  const [channelPassword, setChannelPassword] = React.useState("");

  const [uploadedFile, setUploadedFile] = React.useState(
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
  );
  const [channelImageId, setChannelImageId] = React.useState("");

  const dispatch = useDispatch();

  const token = useSelector((state) => state.UserInfo.accessToken);
  const userInfo = useSelector((state) => state.UserInfo.userInfo);
  const onChannelName = (event) => {
    setChannelName(event.target.value);
  };
  const onChannelDesc = (event) => {
    setChannelDesc(event.target.value);
  };
  const onChannelTag = (event) => {
    setChannelTag(event.target.value);
  };
  const onChannelPassword = (event) => {
    setChannelPassword(event.target.value);
  };

  const onSecret = () => setChecked((current) => !current);

  const handleClickOpenUser = () => {
    setOpenUser(true);
  };

  const handleCloseUser = () => {
    setOpenUser(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setChannelName(""); // value ?????????
    setChannelDesc("");
    setChannelTag("");
    setChannelPassword("");
  };

  const createChannel = () => {
    const channelInfo = {
      channelName,
      channelDesc,
      channelTag,
      channelPassword,
      channelImageId,
    };

    const success = (res) => {
      const channelSeq = res.data.channelSeq;
      const participantInfo = {
        channelPassword: channelPassword,
        channelSeq,
      };
      registerParticipant(
        participantInfo,
        token,
        (res) => {
          let list = [];
          getParticipantListByUser(
            token,
            (response) => {
              dispatch(SET_CHANNELLIST(list));
              response.data.list.map((participant) => {
                getChannelInfo(
                  participant.participantsId.channelSeq,
                  token,
                  ({ data }) => {
                    let channel = {
                      channelSeq: participant.participantsId.channelSeq,
                      channelDesc: data.channelDesc,
                      channelName: data.channelName,
                      channelTag: data.channelTag,
                      channelImageId: data.uploadedImage,
                    };
                    list = list.concat(channel);
                    dispatch(SET_CHANNELLIST(list));
                    // setChannelList(list);
                  },
                  (error) => {
                    console.log("error", error);
                  }
                );
              });
            },
            (error) => {
              console.log(error);
            }
          );
          console.log("===============??????");
          handleClose();
        },
        error
      );
      // part
    };

    const error = () => {
      console.log("====================??????");
      handleClose();
    };

    registerChannel(channelInfo, token, success, error); // ?????? ?????????,

    let list = [];
    getParticipantListByUser(
      token,
      (response) => {
        dispatch(SET_CHANNELLIST(list));
        response.data.list.map((participant) => {
          getChannelInfo(
            participant.participantsId.channelSeq,
            token,
            ({ data }) => {
              let channel = {
                channelSeq: participant.participantsId.channelSeq,
                channelDesc: data.channelDesc,
                channelName: data.channelName,
                channelTag: data.channelTag,
                channelImageId: data.uploadedImage,
              };
              list = list.concat(channel);
              dispatch(SET_CHANNELLIST(list));
              console.log("?????? ??????");
            },
            (error) => {
              console.log("error", error);
            }
          );
        });
      },
      (error) => {
        console.log(error);
      }
    );
  };
  return (
    // ????????? ?????? home, channel???, ??????,  ??????,???????????????
    <div className="container">
      <div className="header_items">
        <Link to="/homepage">
          <img src={whitePIN} class="home_svg" style={{ width: "40px" }} />
          {/* <FaHome class="home_svg" size="40" color="#e2e3e4" /> */}
          <span class="tooltiptext">???</span>
        </Link>
      </div>
      <ChannelTest />
      <div className="header_items headerSetting">
        <Link to="" onClick={handleClickOpen}>
          <FaPlus size="20" />
          <span class="tooltiptext">?????? ????????????</span>
        </Link>
      </div>
      <div className="header_items headerSetting">
        <Link to="/searchchannelpage">
          <FaSearch size="20" />
          <span class="tooltiptext">?????? ????????????</span>
        </Link>
      </div>
      <div className="header_items headerSetting">
        <Link to="" onClick={handleClickOpenUser}>
          <FaCog size="20" />
          <span class="tooltiptext">????????? ??????</span>
        </Link>
      </div>

      {/* <UpdateChannelInfoDialog open={true}></UpdateChannelInfoDialog> */}

      {/* <Dialog
        open={openUser}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseUser}
        aria-describedby="alert-dialog-slide-description"
        className="dialog"
      >
        <DialogTitle className="dialogtext">{"????????? ??????"}</DialogTitle>
        <DialogContent className="dialogtext">
          <DialogContentText id="alert-dialog-slide-description">
            <div className="dialogtext">
              ????????? ??????...
              <br />
              Let Google help apps determine location. This means sending
              anonymous location data to Google, even when no apps are running.
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions className="option-cell">
          <div className="cancel-button">
            <Button onClick={handleCloseUser}>
              <div className="cancel-button-text">Disagree</div>
            </Button>
          </div>
          <div className="accept-button">
            <Button onClick={handleCloseUser}>
              <div className="accept-button-text">Agree</div>
            </Button>
          </div>
        </DialogActions>
      </Dialog> */}

      <Dialog
        open={open}
        // TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        className="dialog"
      >
        <DialogTitle className="dialog-title">Channel Register</DialogTitle>
        <DialogContent className="dialog-content">
          <DialogContentText id="alert-dialog-slide-description" className="dialog-content-text">
            <Box
              component="img"
              sx={{
                border: "3px solid #000000",
                // height: "auto",
                width: "80%",
                borderRadius: 3,
                display: "list-item",
              }}
              // className="gradient-border"
              alt="The house from the offer."
              src={uploadedFile}
            />
            <br />
            <Button variant="contained" component="label" style={{ marginBottom: "10px" }}>
              Upload File
              <input
                type="file"
                onChange={(e) => {
                  registerFile(
                    e.target.files[0],
                    (response) => {
                      setChannelImageId(response.data.id);
                      getFile(
                        response.data.id,
                        (response) => {
                          setUploadedFile("data:image;base64, " + response.data.data);
                        },
                        (error) => {
                          console.log(error);
                        }
                      );
                      // console.log(response.data);
                    },
                    (error) => {
                      console.log(error);
                    }
                  );
                }}
                hidden
              ></input>
            </Button>
            <br />
            <br />
            <label for="channelName" className="input-label">
              ?????? ??????
            </label>
            <br />
            <Input
              sx={{ width: "100%" }}
              value={channelName}
              id="channelName"
              className="input"
              placeholder="?????? ??????..."
              onChange={onChannelName}
              // inputRef={(input) => {
              //   if(input != null) {
              //      input.focus();
              //   }
              // }}
            ></Input>
            <br />
            <br />
            <label htmlFor="channelDesc" className="input-label">
              ?????? ?????????
            </label>
            <br />
            <TextField
              sx={{ width: "100%" }}
              id="channelDesc"
              multiline
              rows={4}
              onChange={onChannelDesc}
              value={channelDesc}
              fullWidth
              placeholder="????????? ?????? ????????? ???????????????~"
              className="textField"
            />
            {/* <Input
              value={channelDesc}
              id="channelDesc"
              className="input"
              onChange={onChannelDesc}
            ></Input> */}
            <br />
            <br />
            <label htmlFor="channelTag" className="input-label">
              ??????
            </label>
            <br />
            <Input
              sx={{ width: "100%" }}
              value={channelTag}
              id="channelTag"
              className="input"
              onChange={onChannelTag}
              fullWidth
              placeholder="#?????? #?????? #??????..."
            ></Input>
            <br />
            <br />

            <label htmlFor="channelSecret" className="input-label">
              ?????????
            </label>
            <Checkbox id="channelSecret" onClick={onSecret}></Checkbox>
            <label htmlFor="channelSecret" className="input-label">
              ????????????{" "}
            </label>
            <Input
              sx={{ width: "69%", marginLeft: "30px" }}
              value={channelPassword}
              id="channelPassword"
              className="input"
              onChange={onChannelPassword}
              disabled={checked === false}
            ></Input>
            <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions className="option-cell">
          <div className="cancel-button">
            <Button onClick={handleClose}>
              <div className="cancel-button-text">CANCEL</div>
            </Button>
          </div>
          <div className="accept-button">
            <Button onClick={createChannel}>
              <div className="accept-button-text">ACCEPT</div>
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <MypageSetting
        open={openUser}
        setOpen={(b) => {
          setOpenUser(b);
        }}
        userInfo={userInfo}
      ></MypageSetting>
    </div>
  );
}
