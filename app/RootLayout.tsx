import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import * as ER from 'expo-router'
import * as ESB from 'expo-status-bar'
import * as RN from 'react-native'

export default function RootLayout() {
  const colorScheme = RN.useColorScheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ER.Stack>
        <ER.Stack.Screen
          name="index"
          options={{
            title: 'Caderneta Digital',
            headerStyle: { backgroundColor: '#A1CEDC' },
            headerTintColor: '#fff',
          }}
        />

        <ER.Stack.Screen name="create" />
        <ER.Stack.Screen name="divida" />
        <ER.Stack.Screen name="detalhes" />
      </ER.Stack>
      <ESB.StatusBar style="auto" />
    </ThemeProvider>
  )
}
