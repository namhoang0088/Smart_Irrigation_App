import React, { useState,useEffect } from "react";
import {
  Box,
  ListItemButton,
  ListItemIcon,
  Typography,
  Collapse,
  List,
  Button,
  Checkbox,
  TextField,
  Autocomplete,
  TimePicker,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import Header from "../../components/Header";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { API_BASE_URL } from "../../data/link_api";
import LiquidGauge from "../../components/LiquidGauge";
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Filter1Icon from '@mui/icons-material/Filter1';
import Filter2Icon from '@mui/icons-material/Filter2';
import Filter3Icon from '@mui/icons-material/Filter3';
import Filter4Icon from '@mui/icons-material/Filter4';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import WaterIcon from '@mui/icons-material/Water';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import PercentIcon from '@mui/icons-material/Percent';
import mqtt from 'mqtt';
const LiveAd = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const hardcodedOptions = ["1", "2", "3"];
  let time  = new Date().toLocaleTimeString()

  const [ctime,setTime] = useState(time)
  const UpdateTime=()=>{
    time =  new Date().toLocaleTimeString()
    setTime(time)
  }
  setInterval(UpdateTime)

  const [flow1, setFlow1] = useState(0);
  const [flow2, setFlow2] = useState(0);
  const [flow3, setFlow3] = useState(0);
  const [pump, setPump] = useState(0);

  const [currentTask, setCurrentTask] = useState("");
  const [mixer1Percent, setMixer1Percent] = useState(0);
  const [mixer2Percent, setMixer2Percent] = useState(0);
  const [mixer3Percent, setMixer3Percent] = useState(0);
  const [pumpout, setPumpout] = useState(0);
  const [id, setId] = useState(null);
  const [label, setLabel] = useState(null);

const [taskState, setTaskState] = useState(null);
useEffect(() => {
  // Xét giá trị cho flow1 dựa trên giá trị của mixer1Percent
  if (mixer1Percent > 0) {
    setFlow1(1);
  }  else if (mixer1Percent < 0) {
    setFlow1(-1);
  }
  else {
    setFlow1(0);
  }
}, [mixer1Percent]);

useEffect(() => {
  // Xét giá trị cho flow2 dựa trên giá trị của mixer2Percent
  if (mixer2Percent > 0) {
    setFlow2(1);
  } else if (mixer2Percent < 0) {
    setFlow2(-1);
  }
  else {
    setFlow2(0);
  }
}, [mixer2Percent]);

useEffect(() => {
  // Xét giá trị cho flow3 dựa trên giá trị của mixer3Percent
  if (mixer3Percent > 0) {
    setFlow3(1);
  } else if (mixer3Percent < 0) {
    setFlow3(-1);
  } else {
    setFlow3(0);
  }
}, [mixer3Percent]);

useEffect(() => {
  // Xét giá trị cho flow3 dựa trên giá trị của pumpout
  if (pumpout > 0) {
    setPump(1);
  } else if (pumpout < 0) {
    setPump(-1);
  } else {
    setPump(0);
  }
}, [pumpout]);

useEffect(() => {
  const ADAFRUIT_IO_USERNAME = 'GutD';
  const ADAFRUIT_IO_KEY = 'aio_TNaU20Pmw9L7x41vHH4ifs3ZKSit';
  const FEED_KEY = 'task';

  const client = mqtt.connect('mqtt://io.adafruit.com', {
    username: ADAFRUIT_IO_USERNAME,
    password: ADAFRUIT_IO_KEY
  });

  client.on('connect', () => {
    console.log('Connected to Adafruit IO');
    client.subscribe(`${ADAFRUIT_IO_USERNAME}/feeds/${FEED_KEY}`, (err) => {
      if (err) {
        console.error('Failed to subscribe to feed:', err);
      } else {
        console.log(`Subscribed to ${FEED_KEY} feed`);
      }
    });
  });

  client.on('message', (topic, message) => {
      console.log(`New message from ${FEED_KEY} feed: ${message.toString()}`);
      const data = JSON.parse(message.toString());
      setCurrentTask(data.current_task || "");
      setMixer1Percent(data.mixer1_percent || 0);
      setMixer2Percent(data.mixer2_percent || 0);
      setMixer3Percent(data.mixer3_percent || 0);
      setPumpout(data.pumpout || 0);
      setId(data.id || null);
      setLabel(data.label || null);

      console.log("Current Task:", data.current_task || "");
      console.log("Mixer 1 Percent:", data.mixer1_percent || 0);
      console.log("Mixer 2 Percent:", data.mixer2_percent || 0);
      console.log("Mixer 3 Percent:", data.mixer3_percent || 0);
      console.log("Pumpout:", data.pumpout || 0);
      console.log("ID:", data.id || null);
      console.log("Label:", data.label || null);
      console.log("mixxxxx1",flow1)
  });

  client.on('error', (err) => {
    console.error('Connection error:', err);
  });

  return () => {
    client.end();
  };
}, []);


  return (
    <Box m="20px">
      <Header title="Theo dõi hệ thống" subtitle="Giao diện theo dõi lịch tưới gần nhất" />
      <Box
        display="grid"
        gridTemplateColumns="72% 28%"
        gap="20px"
        alignItems="start"
      >
        <Box //phần live
          backgroundColor={colors.primary[400]}
          borderRadius="10px"
          padding="5px"
          height="auto"
          display="flex"
          flexDirection="column"
          // justifyContent="center" // căn video theo chiều dọc
          // alignItems="center" // căn video theo chiều ngang
          style={{ overflow: "hidden", position: "relative" }}
        >
            <Box display="flex">
            {/* Box thông tin task-----------------------end-------------------------- */}
            <Box backgroundColor = {colors.white[100]} borderRadius="10px" padding="10px" style={{ width: '570px', height: 'auto' }} marginBottom="10px">
            <Box marginBottom="10px" display="flex" alignItems="center">
              <InfoIcon sx={{ color: "#4cceac", fontSize: "36px" }} />
              <Typography variant="h4" marginRight="10px" paddingLeft="10px">
                <strong>Tên lịch tưới</strong>
              </Typography>
              <TextField
                label="Tên của lịch tưới"
                variant="outlined"
                sx={{ width: "300px" }}
              />
            </Box>
            <Box
            marginBottom="10px"
            display="flex"
            alignItems="center"
          >
            <ChangeCircleIcon sx={{ color: "#4cceac", fontSize: "36px" }} />
            <Typography variant="h5" marginRight="10px" paddingLeft="10px">
              <strong>Khu vực tưới</strong>
            </Typography>
            <Autocomplete
              sx={{ width: 300 }}
              multiple
              id="list-pole-autocomplete"
              // onChange={(event, newValue) => {
              //   setSelectedOptions(newValue);
              //   onChangeContentDaily(newValue, boxDailyIdCounter.toString());
              // }}
              options={hardcodedOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Khu vực"
                />
              )}
            />
            </Box>
                      <Box display="flex" alignItems="center" marginBottom="10px">
            <TextField
              label="Thời gian bắt đầu"
              // onChange={(newTime) => {
              //   const hours = newTime.$d.getHours().toString().padStart(2, "0");
              //   const minutes = newTime.$d
              //     .getMinutes()
              //     .toString()
              //     .padStart(2, "0");
              //   const formattedTime = `${hours}:${minutes}`;
              //   console.log("Giá trị mới: ", formattedTime);
              //   onChangeTimeStartDaily(
              //     formattedTime,
              //     boxDailyIdCounter.toString(),
              //   );
              // }}
            />
            <span
              style={{
                fontSize: "1.5em",
                margin: "0 10px",
              }}
            >
              -
            </span>
            <TextField
              label="Thời gian kết thúc"
              // onChange={(newTime) => {
              //   const hours = newTime.$d.getHours().toString().padStart(2, "0");
              //   const minutes = newTime.$d
              //     .getMinutes()
              //     .toString()
              //     .padStart(2, "0");
              //   const formattedTime = `${hours}:${minutes}`;
              //   console.log("Giá trị mới: ", formattedTime);
              //   onChangeTimeEndDaily(
              //     formattedTime,
              //     boxDailyIdCounter.toString(),
              //   );
              // }}
            />
          </Box>

          <Box
            marginBottom="10px"
            display="flex"
            alignItems="center"
          >
            <WaterIcon sx={{ color: "#4cceac", fontSize: "36px" }} />
            <Typography variant="h5" marginRight="10px" paddingLeft="10px">
              <strong>Flow 1</strong>
            </Typography>
            <TextField
              label="ml"
              variant="outlined"
              sx={{ width: "60px"}}
              // onChange={(event) => {
              //   const newValue = event.target.value;
              //   onChangeFlow1Daily(newValue, boxDailyIdCounter);
              // }}
            />

            <Typography variant="h5" marginRight="10px" paddingLeft="10px">
              <strong>Flow 2</strong>
            </Typography>
            <TextField
              label="ml"
              variant="outlined"
              sx={{ width: "60px" }}
              // onChange={(event) => {
              //   const newValue = event.target.value;
              //   onChangeFlow2Daily(newValue, boxDailyIdCounter);
              // }}
            />

            
            <Typography variant="h5" marginRight="10px" paddingLeft="10px">
              <strong>Flow 3</strong>
            </Typography>
            <TextField
              label="ml"
              variant="outlined"
              sx={{ width: "60px" }}
              // onChange={(event) => {
              //   const newValue = event.target.value;
              //   onChangeFlow3Daily(newValue, boxDailyIdCounter);
              // }}
            /> 

          </Box>
          </Box>
          {/* Box thông tin task-----------------------end-------------------------- */}
          <Box backgroundColor = {colors.white[100]} borderRadius="10px" padding="10px" style={{ width: '400px', height: 'auto' }} marginBottom="10px" marginLeft="10px" flexDirection="column">

          <Box padding="20px" backgroundColor = "#4cceac" borderRadius="20px" alignItems="center" marginTop="5px">

          <Typography variant="h1" sx={{ color: 'white' }} marginLeft="70px">{ctime}</Typography>
          </Box>

          <Box 
            padding="10px" 
            borderRadius="20px" 
            alignItems="center" 
            display="flex"
        >
            <Box 
                backgroundColor="#4cceac" 
                borderRadius="20px" 
                alignItems="center" 
                marginTop="5px"
                flex="1"
                
                justifyContent="center"
                marginRight="10px"
            >         

                      <Box 
                          backgroundColor="#4cceac" 
                          borderRadius="20px" 
                          marginTop="5px"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                      >  
                      <ThermostatIcon style={{ fontSize: "32px", color: "white" }} />
                      <Typography variant="h2" sx={{ color: 'white' }}>
                              Nhiệt độ
                          </Typography>
                      </Box>

                      <Box 
                          backgroundColor="#4cceac" 
                          borderRadius="20px" 
                          marginTop="5px"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          height="80px"
                      >  
                          <Typography variant="h1" sx={{ color: 'white' }}>
                              30℃
                          </Typography>
                      </Box>
            </Box>

            <Box 
                backgroundColor="#4cceac" 
                borderRadius="20px" 
                alignItems="center" 
                marginTop="5px"
                flex="1"
                justifyContent="center"
            >
            
            <Box 
                          backgroundColor="#4cceac" 
                          borderRadius="20px" 
                          marginTop="5px"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                      >  
                      <PercentIcon style={{ fontSize: "32px", color: "white" }} />
                      <Typography variant="h2" sx={{ color: 'white' }}>
                              Độ ẩm
                          </Typography>
                      </Box>

                      <Box 
                          backgroundColor="#4cceac" 
                          borderRadius="20px" 
                          marginTop="5px"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          height="80px"
                      >  
                          <Typography variant="h1" sx={{ color: 'white' }}>
                              30%
                          </Typography>
                      </Box>
            </Box>

        </Box>

          </Box>

          </Box>
{/*---------------------------------------------------------------------------------------------------------------------------------------------*/ }
          <Box display="flex" backgroundColor = {colors.white[100]} borderRadius="10px" padding="10px" style={{ width: 'auto', height: 'auto' }}>
         {/* tiến trình begin */}
          <Box 
          borderRadius="10px"
          padding="10px"
          height="auto"
          display="flex"
          flexDirection="column"
          style={{ opacity: flow1 === 1 ? 1 : 0.2 }}
        >
        <Box display="flex" marginLeft="23px" marginBottom="5px">
        <Filter1Icon sx={{ color: "#4cceac", fontSize: "24px" }} />
              <Typography variant="h5" marginRight="10px" paddingLeft="10px">
                <strong>Trộn thùng 1</strong>
              </Typography>
        </Box>

        <LiquidGauge percentage={mixer1Percent > 0 ? mixer1Percent : 0} width={190} height={190} />
        </Box>

        {flow2 !== 0 ? (
                <ArrowCircleRightIcon sx={{ color: "#4cceac", fontSize: "36px", marginTop: 'auto', marginBottom: 'auto' }} />
            ) : (
                <DoNotDisturbOnIcon sx={{ color: "#ff0000", fontSize: "36px", marginTop: 'auto', marginBottom: 'auto' }} />
            )}

        <Box 
          borderRadius="10px"
          padding="10px"
          height="auto"
          display="flex"
          flexDirection="column"
          style={{ opacity: flow2 === 1 ? 1 : 0.2 }}
        >

                <Box display="flex" marginLeft="23px" marginBottom="5px">
        <Filter2Icon sx={{ color: "#4cceac", fontSize: "24px" }} />
              <Typography variant="h5" marginRight="10px" paddingLeft="10px">
                <strong>Trộn thùng 2</strong>
              </Typography>
        </Box>

        <LiquidGauge percentage={mixer2Percent > 0 ? mixer2Percent : 0} width={190} height={190} />
        </Box>
        
        {flow3 !== 0 ? (
                <ArrowCircleRightIcon sx={{ color: "#4cceac", fontSize: "36px", marginTop: 'auto', marginBottom: 'auto' }} />
            ) : (
                <DoNotDisturbOnIcon sx={{ color: "#ff0000", fontSize: "36px", marginTop: 'auto', marginBottom: 'auto' }} />
            )}

        <Box 
          borderRadius="10px"
          padding="10px"
          height="auto"
          display="flex"
          flexDirection="column"
          style={{ opacity: flow3 === 1 ? 1 : 0.2 }}
        >

<Box display="flex" marginLeft="23px" marginBottom="5px">
        <Filter3Icon sx={{ color: "#4cceac", fontSize: "24px" }} />
              <Typography variant="h5" marginRight="10px" paddingLeft="10px">
                <strong>Trộn thùng 3</strong>
              </Typography>
        </Box>

        <LiquidGauge percentage={mixer3Percent > 0 ? mixer3Percent : 0} width={190} height={190} />
        </Box>

                
        {pump !== 0 ? (
                <ArrowCircleRightIcon sx={{ color: "#4cceac", fontSize: "36px", marginTop: 'auto', marginBottom: 'auto' }} />
            ) : (
                <DoNotDisturbOnIcon sx={{ color: "#ff0000", fontSize: "36px", marginTop: 'auto', marginBottom: 'auto' }} />
            )}

        <Box 
          borderRadius="10px"
          padding="10px"
          height="auto"
          display="flex"
          flexDirection="column"
          style={{ opacity: pump === 1 ? 1 : 0.2 }}
        >

<Box display="flex" marginLeft="23px" marginBottom="5px">
        <Filter4Icon sx={{ color: "#4cceac", fontSize: "24px" }} />
              <Typography variant="h5" marginRight="10px" paddingLeft="10px">
                <strong>Tưới khu vực</strong>
              </Typography>
        </Box>

        <LiquidGauge percentage={pumpout > 0 ? pumpout : 0} width={190} height={190} />
        </Box>

        {/* tiến trình end */}
          </Box>
        </Box>

        <Box // phần chọn smart pole
          backgroundColor={colors.primary[400]}
          borderRadius="10px"
          padding="5px"
          height="auto"
        >
        <Box display="flex" alignItems="center">
            <EventNoteIcon style={{ fontSize: "32px", color: "#4cceac" }} />
            <h2
              style={{
                marginLeft: "10px",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              Nhật ký hệ thống
            </h2>
          </Box>
          
          <Box backgroundColor = {colors.white[100]} borderRadius="10px" padding="10px" style={{ width: 'auto', height: 'auto' }}>
          <Box display="flex" alignItems="center">
          <h4>10:30 AM:</h4> Bắt đầu trộn thùng 1 
          </Box>
          <Box display="flex" alignItems="center">
          <h4>10:31 AM:</h4> Hoàn thành trộn thùng 1 
          </Box>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default LiveAd;
