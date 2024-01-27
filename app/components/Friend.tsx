import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, Image, Button, Pressable } from 'react-native';


export default function Profile(props: any) {
    const [visible, setVisible] = useState(true);

  const removeElement = () => {
    setVisible((prev) => !prev);
  };

    return (
        <View>
        {visible && (
            <View style={styles.container}>
                <Text style={styles.p}>{props.text}</Text>
                {/* <Button
                    style={styles.p}
                    onPress={removeElement}
                    title="Remove Friend"
                /> */}
                <Pressable style={styles.button} onPress={removeElement}>
                    <Text style={styles.text}>Remove Friend</Text>
                </Pressable>
            </View>
      )}
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent: 'space-evenly',
        backgroundColor: '#39A7FF'
    },
    p: {
      color: "black",
      fontSize:16,
      textAlign:'left',
    },
    text: {
        fontSize:16,
        textAlign:'right',
    },
    button: {

    },
});