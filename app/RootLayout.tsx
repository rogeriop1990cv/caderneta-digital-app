import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as ER from 'expo-router';
import * as ESB from 'expo-status-bar';
import * as RN from 'react-native';

export default function RootLayout() {
  const colorScheme = RN.useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ER.Stack>
        {/* Tela Inicial: index.tsx */}
        <ER.Stack.Screen 
          name="index" 
          options={{ 
            title: 'Caderneta Digital', // Título no cabeçalho
            headerStyle: {
              backgroundColor: '#A1CEDC', // A cor azul que você mencionou
            },
            headerTintColor: '#fff', // Cor do texto/ícones do cabeçalho
          }} 
        />
        
        {/* Outras telas */}
        <ER.Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </ER.Stack>
      <ESB.StatusBar style="auto" />
    </ThemeProvider>
  )
}
