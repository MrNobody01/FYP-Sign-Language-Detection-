// import * as React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import FYPIntro from './screens/FYPIntro';
// import Login from './screens/Login';
// import Register from './screens/Register';
// import CameraScreen from './screens/CameraScreen';
// import UserSelectionPage from './screens/UserSelectionPage';
// import DeafPerson from './screens/DeafPerson';
// import NormalPerson from './screens/NormalPerson';
// import TextToPSL from './screens/TextToPSL';
// import VoiceToText from './screens/VoiceToText';
// import LogoutButton from './components/LogoutButton.js'; // ✅ Import the logout button

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="FYPIntro">
//         {/* Screens without header (No logout on these) */}
//         <Stack.Screen name="FYPIntro" component={FYPIntro} options={{ headerShown: false }} />
//         <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
//         <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />

//         {/* Screens with header + logout */}
//         <Stack.Screen 
//           name="UserSelection" 
//           component={UserSelectionPage}
//           options={{ 
//             headerTitle: 'Dashboard',
//             headerRight: () => <LogoutButton />,
//           }} 
//         />
//         <Stack.Screen 
//           name="DeafPerson" 
//           component={DeafPerson}
//           options={{ 
//             headerTitle: 'Deaf Person',
//             headerRight: () => <LogoutButton />,
//           }}
//         />
//         <Stack.Screen 
//           name="NormalPerson" 
//           component={NormalPerson}
//           options={{ 
//             headerTitle: 'Normal Person',
//             headerRight: () => <LogoutButton />,
//           }}
//         />
//         <Stack.Screen 
//           name="TextToPSL" 
//           component={TextToPSL}
//           options={{ 
//             headerTitle: 'Text to PSL',
//             headerRight: () => <LogoutButton />,
//           }}
//         />
//         <Stack.Screen 
//           name="VoiceToText" 
//           component={VoiceToText}
//           options={{ 
//             headerTitle: 'Voice to Text',
//             headerRight: () => <LogoutButton />,
//           }}
//         />
//         <Stack.Screen 
//           name="Camera" 
//           component={CameraScreen}
//           options={{ 
//             headerTitle: 'Alphabet Camera',
//             headerRight: () => <LogoutButton />,
//           }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraScreen from './screens/CameraScreen';
import UserSelectionPage from './screens/UserSelectionPage';
import DeafPerson from './screens/DeafPerson';
import NormalPerson from './screens/NormalPerson';
import TextToPSL from './screens/TextToPSL';
import VoiceToText from './screens/VoiceToText';
import LogoutButton from './components/LogoutButton.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UserSelection">
        
        {/* Start directly at UserSelection */}
        <Stack.Screen 
          name="UserSelection" 
          component={UserSelectionPage}
          options={{ 
            headerTitle: 'Dashboard',
            headerRight: () => <LogoutButton />,
          }} 
        />

        <Stack.Screen 
          name="DeafPerson" 
          component={DeafPerson}
          options={{ 
            headerTitle: 'Deaf Person',
            headerRight: () => <LogoutButton />,
          }}
        />
        <Stack.Screen 
          name="NormalPerson" 
          component={NormalPerson}
          options={{ 
            headerTitle: 'Normal Person',
            headerRight: () => <LogoutButton />,
          }}
        />
        <Stack.Screen 
          name="TextToPSL" 
          component={TextToPSL}
          options={{ 
            headerTitle: 'Text to PSL',
            headerRight: () => <LogoutButton />,
          }}
        />
        <Stack.Screen 
          name="VoiceToText" 
          component={VoiceToText}
          options={{ 
            headerTitle: 'Voice to Text',
            headerRight: () => <LogoutButton />,
          }}
        />
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen}
          options={{ 
            headerTitle: 'Alphabet Camera',
            headerRight: () => <LogoutButton />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
