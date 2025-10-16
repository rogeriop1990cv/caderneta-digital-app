import FloatingMenuButton from '@/components/FloatingMenuButton'; // Importe o FAB
import { initDatabase } from '@/database/Database';
import { getStatusList } from '@/database/services/StatusService';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  React.useEffect(() => {
    const loadData = async () => {
      // Inicialização do DB
      await initDatabase();
      const status = await getStatusList();
      console.log('Status do DB:', status);
    };
    loadData();
  }, []);
  
  // Função de ação do Menu
  const handleMenuPress = (key: string) => {
    // Usaremos o Expo Router para navegação em seguida
    Alert.alert(`Ação de ${key}`, `Você clicou em ${key}. Implementar a navegação aqui.`);
    // router.push(`/(screens)/${key}`);
  };

  return (
    // O View principal deve ocupar toda a área da tela
    <View style={styles.container}>
      
      {/* Conteúdo Central da Tela */}
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Bem-vindo à Caderneta Digital!</Text>
        <Text style={styles.infoText}>Use o botão (+) para adicionar clientes ou dívidas.</Text>
      </View>

      <FloatingMenuButton onMenuItemPress={handleMenuPress} />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Preenche toda a tela, necessário para posicionamento absoluto do FAB
    backgroundColor: '#f0f0f0', // Fundo levemente cinza
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
