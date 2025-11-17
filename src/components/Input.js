import { TextInput, StyleSheet, View, Text } from 'react-native';
import { useState, forwardRef } from 'react';

// const Input = forwardRef(
//   (
//     { title, placeholder, keyboardType, returnKeyType, value, onChangeText },
//     ref,
//   ) => {
//     const [isFocused, setIsFocused] = useState(false);
//     // const [value, setValue] = useState('');

//     return (
//       <View
//       //   style={styles.container}
//       >
//         <TextInput
//           style={
//             [
//               // styles.input,
//               // value && styles.hasValueInput,
//               // isFocused && styles.focused,
//             ]
//           }
//           ref={ref}
//           //   placehilderTextColor={}
//           returnKeyType={returnKeyType}
//           //   value={value}
//           onChangeText={onChangeText}
//           onFocus={() => setIsFocused(true)}
//           onBlur={() => setIsFocused(false)}
//           //   {...props}
//         />
//       </View>
//     );
//   },
// );

// export default Input;
