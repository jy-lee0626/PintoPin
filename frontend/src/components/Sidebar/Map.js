import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getPinList } from "../../api/pin";
import { SET_CURRENTMAP } from "../../redux/PinList";
import { SET_PINLIST } from "../../redux/PinList";
import { deleteMap, getMapList, updateMap } from "../../api/map";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import "./Sidebar.css";
import { useState } from "react";
import { SET_MAPLIST } from "../../redux/MapList";
import { createHeaders } from "../../api";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Map(props) {
  const token = useSelector((state) => state.UserInfo.accessToken);
  const dispatch = useDispatch();
  const ChannelSeq = useSelector((state) => state.ChannelList.channelSeq);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [newMapName, setNewMapName] = useState(props.mapName);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const handleClose2 = () => setOpen2(false);
  const handleOpen2 = () => setOpen2(true);
  const channelSeq = useSelector((state) => state.ChannelList.channelSeq);

  function openMap(mapSeq) {
    dispatch(SET_CURRENTMAP(mapSeq));
    getPinList(
      mapSeq,
      token,
      (response) => {
        let pinList = response.data.pinList;
        pinList.map((pin) => {
          pin.isVisible = false;
        });
        dispatch(SET_PINLIST({ pinList: pinList, mapSeq: mapSeq }));
      },
      (error) => {
        console.log(error);
      }
    );
  }
  const onChangeNewMapName = (e) => {
    setNewMapName(e.target.value);
  };

  const UpdateMap = () => {
    const updateMapInfo = {
      mapName: newMapName,
      mapSeq: props.mapSeq,
    };
    updateMap(
      updateMapInfo,
      token,
      () => {
        getMapList(
          // ???????????? ??? ????????? ????????????
          ChannelSeq,
          "channel",
          token,
          (response) => {
            const list = response.data.mapsList;
            console.log(list);
            dispatch(SET_MAPLIST(list)); // ??? redux??? ?????? ??????
            handleClose2();
            if (props.stomp) {
              let chatMessage = {
                receiver: channelSeq,
                status: "CHANGE_MAP",
              };
              props.stomp.send(
                "/app/private-message",
                createHeaders(token),
                JSON.stringify(chatMessage)
              );
            }
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const DeleteMap = () => {
    // ??? ?????? ??????
    const mapSeq = props.mapSeq;
    // ?????????
    deleteMap(
      mapSeq,
      token,
      getMapList(
        // ???????????? ??? ????????? ????????????
        ChannelSeq,
        "channel",
        token,
        (response) => {
          // ????????? ?????? response??? ????????? (?????? ??????)
          const list = response.data.mapsList;
          const arr = list.filter((data) => data.mapSeq !== mapSeq); // fliter??? ??????!
          dispatch(SET_MAPLIST(arr)); // ??? redux??? ?????? ??????
          handleClose();
          if (props.stomp) {
            let chatMessage = {
              receiver: channelSeq,
              status: "CHANGE_MAP",
            };
            props.stomp.send(
              "/app/private-message",
              createHeaders(token),
              JSON.stringify(chatMessage)
            );
          }
        }
      ),
      (error) => console.log(error) // ????????????
    );
  };

  return (
    <div>
      <span>
        <Link
          to={`/mappage/${ChannelSeq}/${props.mapSeq}`}
          onClick={() => {
            openMap(props.mapSeq);
          }}
        >
          {props.mapName}
          <button onClick={handleOpen} className="trash-outline">
            <ion-icon name="trash-outline"></ion-icon>
          </button>
          <button onClick={handleOpen2} className="settings-outline">
            <ion-icon name="settings-outline"></ion-icon>
          </button>
        </Link>
      </span>
      <span>
        <Modal
          open={open2}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={style}
            style={{ backgroundColor: "#202225", borderRadius: "10px" }}
          >
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              color="white"
            >
              <br />
              ??? ?????? ????????????
              <br />
              <input
                type="text"
                value={newMapName}
                autoFocus
                onChange={onChangeNewMapName}
              ></input>
              <Stack
                direction="row-reverse"
                alignItems="center"
                spacing={2}
                style={{ marginTop: "2rem" }}
              >
                <Button onClick={handleClose2}>??????</Button>
                <Button onClick={UpdateMap} variant="outlined" color="success">
                  ??? ????????????
                </Button>
              </Stack>
            </Typography>
          </Box>
        </Modal>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={style}
            style={{ backgroundColor: "#202225", borderRadius: "10px" }}
          >
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              color="white"
            >
              ?????? ?????? ?????????????????????????
              <Stack
                direction="row-reverse"
                alignItems="center"
                spacing={2}
                style={{ marginTop: "2rem" }}
              >
                <Button onClick={handleClose}>??????</Button>
                <Button onClick={DeleteMap} variant="outlined" color="error">
                  ??? ????????????
                </Button>
              </Stack>
            </Typography>
          </Box>
        </Modal>
      </span>
    </div>
  );
}

export default Map;
