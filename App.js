import { StatusBar } from 'expo-status-bar';
import React, { UseEffect, ueseState, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Animated, Dimensions, TextInput, SectionList, SafeAreaView, FlatList } from 'react-native';
import AppButton from '../BoxingTimer/components/button'
import { colors } from './utils/colors'
import Modal from "react-native-modal";
import { immediates } from 'react-native-timer';


const { width, height } = Dimensions.get('window');

let animValue = 0;
let resetAnimValue = animValue;
export default function App() {

  const [numOfRounds, setNumOfRounds] = useState(4); // number of rounds 
  const [rounds, setRounds] = useState(1) // current rounds 
  const [roundTime, setRoundTime] = useState(10); // time of each round 
  const [restTime, setRestTime] = useState(5); // rest time between rounds 
  const [rest, setRest] = useState(false); // rest flag 
  const [warmUp, setWarmUp] = useState(0); // warm up time 
  const [timerOn, setTimerOn] = useState(false); // start round flag
  const [timer, setTimer] = useState(); // state for the interval 
  const [restTimer, setRestTimer] = useState(); // interval for the rest time  
  const [originalRoundTime, setOriginalRoundTime] = useState(roundTime); // used to reset number of rounds 
  const [originalRestTime, setOriginalRestTime] = useState(restTime); // used to reset rest  time 
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const DATA = [

    {
      id: 'roundTime',
      title: 'Round Time',
      value: roundTime,
    },
    {
      id: 'restTime',
      title: 'Rest Time',
      value: restTime,
    },
    {
      id: 'numOfRounds',
      title: '# of Rounds',
      value: numOfRounds,
    },
  ];


  useEffect(() => {
    if (timerOn) startTimer();
    else pauseTimer();

  }, [timerOn])

  useEffect(() => {
    if (rest) StartRestTime();
  }, [rest])

  useEffect(() => {

    if (roundTime === 0) {
      if (rounds != numOfRounds) {
        setRoundTime(originalRoundTime);
        setTimerOn(false)
        setRounds(rounds + 1);
        // push notification that round is over
        setRest(true);
        clearInterval(timer)
      }
      else {
        // push notification that the workout is over
        clearInterval(timer);
        clearInterval(restTimer);
      }

    }

  }, [roundTime])

  useEffect(() => {
    if (restTime === 0) {
      // push notification that rest is over
      setRestTime(originalRestTime)
      setRest(false);
      setTimerOn(true);

      clearInterval(restTimer);
    }
  }, [restTime])


  const StartRestTime = () => {
    // push notification that rest is starting
    animation();
    setRestTimer(setInterval(() => {
      setRestTime(secs => {
        if (secs > 0) return secs - 1
        else return 0
      })

    }, 1000))
  }

  const startTimer = () => {
    // push notification that round is starting
    animation();
    setTimer(setInterval(() => {
      setRoundTime(secs => {
        if (secs > 0) return secs - 1
        else return 0
      })

    }, 1000))
  }
  const pauseTimer = () => {
    setTimerOn(false);
    Animated.timing(timerAnimation).stop();
    clearInterval(timer);
    animValue = resetAnimValue;
  }

  const stopTimer = () => {
    clearInterval(timer);
    setTimerOn(false)
    setRoundTime(originalRoundTime);

  }

  const clockify = (time) => {
    let mins = Math.floor((time / 60) % 60);
    let seconds = Math.floor(time % 60);

    let displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
    let displayMins = mins < 10 ? `0${mins}` : mins;

    return {
      displaySeconds,
      displayMins
    }
  }


  let timerAnimation = React.useRef(new Animated.Value(height + 65)).current;
  timerAnimation.addListener(({ value }) => animValue = value); // used to track the current animation value 
  const animation = React.useCallback(() => {

    Animated.sequence([
      Animated.timing(timerAnimation, {
        toValue: animValue,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(timerAnimation, {
        toValue: height + 65,
        duration: rest ? restTime * 1000 : roundTime * 1000,
        useNativeDriver: true
      })
    ]).start(() => {

    })

  }, [roundTime, restTime])

  const Item = ({ title, value }) => (
    <View style={{ flexDirection: "row", alignItems: "center", margin: 5, }}>
      <Text style={{ color: "white" }}>{title}</Text>
      <TextInput
        style={styles.input}
        keyboardType={"decimal-pad"}
        value={`${value}`}
      />
    </View>
  );
  const renderItem = ({ item }) => (
    <Item title={item.title} value={item.value} />
  );

  return (

    <View style={styles.container}>
      <Modal isVisible={isModalVisible}>
        <View style={{ flex: 1 }}>

          <SafeAreaView>
            <FlatList
              data={DATA}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </SafeAreaView>

          <AppButton icon="gears" title={"Save"} backgroundColor={colors.background} iconColor={colors.text} onPress={toggleModal} borderRadius={15} fontSize={20} />
        </View>
      </Modal>
      <View style={styles.settingsContainer}>
        <AppButton icon="gear" backgroundColor={colors.background} iconColor={colors.text} onPress={toggleModal} borderRadius={15} fontSize={20} />
      </View>
      {Platform.OS === 'ios' ? (<StatusBar backgroundColor="#36393E" barStyle="light-content" />) : <StatusBar style="light" />}

      <Animated.View style={[StyleSheet.absoluteFillObject, { height: height + 65, width, backgroundColor: rest ? colors.yellow : colors.red, transform: [{ translateY: timerAnimation }] }]} />

      <View style={styles.timerWrap}>

        <Text style={styles.rounds}>Round {rounds} out of {numOfRounds}</Text>
        <Text style={{ color: "white" }}>{animValue}</Text>
        {rest ? <Text style={{ color: "white" }}>True</Text> : <Text style={{ color: "white" }}>False</Text>}

        {!rest ? <Text style={styles.timer}>{clockify(roundTime).displayMins}:{clockify(roundTime).displaySeconds}</Text> :
          <Text style={styles.timer}>{clockify(restTime).displayMins}:{clockify(restTime).displaySeconds}</Text>}
        {timerOn ? <Text>Fight</Text> : <Text>Rest</Text>}

      </View>
      <View style={styles.buttonWrap}>
        {timerOn || rest ? <AppButton icon="pause-circle"
          title="Pause"
          backgroundColor={colors.secondary}
          iconColor={colors.text} onPress={pauseTimer}
          borderRadius={15}
          fontSize={24}
          width={110}
          height={70}
          iconSize={35} />
          :

          <AppButton icon="play-circle"
            title="Start" backgroundColor={colors.secondary}
            iconColor={colors.text}
            onPress={setTimerOn} borderRadius={15}
            fontSize={24}
            width={110}
            height={70}
            iconSize={35} />}

        <AppButton
          icon="stop-circle"
          title="Stop"
          backgroundColor={colors.secondary}
          iconColor={colors.text}
          onPress={stopTimer} borderRadius={15}
          fontSize={24}
          width={110}
          height={70}
          iconSize={35} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  timer: {
    fontSize: 80,
    color: colors.text,
  },
  timerWrap: {
    width: 350,
    margin: 20,
    marginTop: 60,
    padding: 10,
    left: 0,
    right: 0,
    justifyContent: "space-between",
    backgroundColor: colors.secondary,
    alignItems: "center",
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },

  },
  rounds: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  buttonWrap: {
    flexDirection: "row",
    margin: 5,
  },
  settingsContainer: {
    alignSelf: 'flex-end',
    marginTop: 60,
    backgroundColor: colors.background
  },
  input: {
    backgroundColor: colors.white,
    marginLeft: 5,
    flex: 1,
  },

  header: {
    fontSize: 32,
    backgroundColor: "#fff"
  },
});
