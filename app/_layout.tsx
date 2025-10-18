import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: 'Caderneta Digital', headerStyle: { backgroundColor: '#A1CEDC' }, headerTintColor: '#fff' }}
        />
        <Stack.Screen
          name="create"
          options={{
            title: 'Novo Cliente',
            headerStyle: { backgroundColor: '#A1CEDC' },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="detalhes"
          options={{
            title: 'Detalhes da Divida',
            headerStyle: { backgroundColor: '#A1CEDC' },
            headerTintColor: '#fff',
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
