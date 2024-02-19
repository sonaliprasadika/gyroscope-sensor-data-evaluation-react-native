import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gyroscope } from 'expo-sensors';

export default function App() {
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
  const [color, setColor] = useState('black');
  const [subscription, setSubscription] = useState(null);
  const [previousData, setPreviousData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const subscribeGyroscope = async () => {
      setSubscription(Gyroscope.addListener(({ x, y, z }) => {
        const threshold = 1; // Define your threshold for significant change
        const deltaX = Math.abs(x - previousData.x);
        const deltaY = Math.abs(y - previousData.y);
        const deltaZ = Math.abs(z - previousData.z);

        if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
          setColor('green'); // Change color if significant change detected
        } else {
          setColor('yellow'); // Otherwise, revert to default color
        }

        setPreviousData({ x, y, z });
        setGyroscopeData({ x, y, z });
      }));

      Gyroscope.setUpdateInterval(100); // Set your desired update interval
    };

    subscribeGyroscope();

    return () => {
      subscription && subscription.remove();
      setSubscription(null);
    };
  }, [previousData]); // Only re-subscribe if previousData changes

  return (
    <View style={styles.container}>
      <View style={[styles.horizontalContainer, { backgroundColor: color }]}>
        <Text style={styles.text}>Trigger Rotation</Text>
      </View>
      <Text style={styles.text}>Gyroscope:</Text>
      <Text style={styles.text}>x: {gyroscopeData.x}</Text>
      <Text style={styles.text}>y: {gyroscopeData.y}</Text>
      <Text style={styles.text}>z: {gyroscopeData.z}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            if (subscription) {
              subscription.remove();
              setSubscription(null);
            } else {
              setPreviousData({ x: 0, y: 0, z: 0 }); // Reset previous data
              setGyroscopeData({ x: 0, y: 0, z: 0 }); // Reset gyroscope data
            }
          }}
          style={styles.button}
        >
          <Text>{subscription ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  horizontalContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
