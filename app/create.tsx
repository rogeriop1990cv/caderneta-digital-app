
import { createCliente } from '@/database/services/ClienteService';
import { router } from 'expo-router'; // Importa o objeto de navegação
import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ClienteCreateScreen() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'O campo Nome é obrigatório.');
      return;
    }

    setLoading(true);
    try {
      // 1. Chamada ao serviço do banco de dados
      const newId = await createCliente(nome.trim(), telefone.trim(), observacoes.trim());
      
      Alert.alert('Sucesso!', `Cliente "${nome}" salvo com ID: ${newId}`);
      
      // 2. Volta para a tela principal
      router.back(); 

    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      Alert.alert('Erro', 'Não foi possível salvar o cliente. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nome Completo *</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Nome do Cliente"
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        style={styles.input}
        value={telefone}
        onChangeText={setTelefone}
        placeholder="(XX) 9XXXX-XXXX"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Observações</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={observacoes}
        onChangeText={setObservacoes}
        placeholder="Informações adicionais sobre o cliente..."
        multiline
        numberOfLines={4}
      />
      
      <View style={styles.buttonContainer}>
        <Button 
          title={loading ? "Salvando..." : "Salvar Cliente"} 
          onPress={handleSave} 
          disabled={loading}
          color="#007AFF"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top', // Garante que o texto comece no topo no Android
  },
  buttonContainer: {
    marginTop: 30,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
