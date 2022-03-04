import { StatusBar } from 'expo-status-bar';
import React, { UseEffect, ueseState, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppButton from '../BoxingTimer/components/button'
import { colors } from './utils/colors'


export default function App() {

  const [numOfRounds, setNumOfRounds] = useState(4);
  const [rounds, setRounds] = useState(1)
  const [roundTime, setRoundTime] = useState(10);
  const [restTime, setRestTime] = useState(5);
  const [rest, setRest] = useState(false);
  const [warmUp, setWarmUp] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [timer, setTimer] = useState();
  const [restTimer, setRestTimer] = useState();
  const [originalRoundTime, setOriginalRoundTime] = useState(roundTime);
  const [originalRestTime, setOriginalRestTime] = useState(restTime);


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
    setRestTimer(setInterval(() => {
      setRestTime(secs => {
        if (secs > 0) return secs - 1
        else return 0
      })

    }, 1000))
  }

  const startTimer = () => {
    // push notification that round is starting
    setTimer(setInterval(() => {
      setRoundTime(secs => {
        if (secs > 0) return secs - 1
        else return 0
      })

    }, 1000))
  }
  const pauseTimer = () => {
    setTimerOn(false)
    clearInterval(timer);
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

  return (
    <View style={styles.container}>
      {timerOn ? <Text style={{ color: "white" }}>True</Text> : <Text style={{ color: "white" }}>False</Text>}
      {rest ? <Text style={{ color: "white" }}>True</Text> : <Text style={{ color: "white" }}>False</Text>}
      <Text style={{ color: "white" }}>{roundTime}</Text>

      <View style={styles.timerWrap}>
        <Text style={styles.rounds}>Round {rounds} out of {numOfRounds}</Text>

        {timerOn ? <Text style={styles.timer}>{clockify(roundTime).displayMins}:{clockify(roundTime).displaySeconds}</Text> :
          <Text style={styles.timer}>{clockify(restTime).displayMins}:{clockify(restTime).displaySeconds}</Text>}
        {timerOn ? <Text>Fight</Text> : <Text>Rest</Text>}
      </View>
      <View style={styles.buttonWrap}>
        {!timerOn ? <AppButton icon="play-circle" title="Start" backgroundColor={colors.buttonColor} onPress={() => { setTimerOn((current) => !current) }} borderRadius={15} fontSize={20} />
          : <AppButton icon="pause-circle" title="Pause" backgroundColor={colors.buttonColor} onPress={pauseTimer} borderRadius={15} fontSize={20} />}

        <AppButton icon="stop-circle" title="Stop" backgroundColor={colors.buttonColor} onPress={stopTimer} borderRadius={15} fontSize={20} />
      </View>
      <View style={styles.wrap}>
        <Text>number of rounds </Text>
        <Text>Set Round Time </Text>
        <Text>Set Rest </Text>
        <Text>warmUp </Text>
      </View>
      {Platform.OS === 'ios' ? (<StatusBar backgroundColor="#36393E" barStyle="light-content" />) : <StatusBar style="light" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  wrap: {
    padding: 30,
    justifyContent: "space-between",
    backgroundColor: colors.secondary,
  },
  timer: {
    fontSize: 80,
    color: colors.text,
    marginBottom: 5,
  },
  timerWrap: {
    width: 350,
    height: 250,
    margin: 20,
    justifyContent: "space-between",
    backgroundColor: colors.secondary,
    alignItems: "center",
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 8,
  },
  rounds: {
    marginTop: 10,
    fontSize: 18,
    color: colors.textSecondary,
  },
  buttonWrap: {
    flexDirection: "row",
    margin: 5,
  },
  status: {
    marginBottom: 20,
    fontSize: 18,
  }

});
