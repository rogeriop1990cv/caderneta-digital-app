import FloatingMenuButton from '@/components/FloatingMenuButton'; // Importe o FAB
import { initDatabase } from '@/database/Database';
import { getClientes, ICliente } from '@/database/services/ClienteService'
import { getDividasIdByCliente } from '@/database/services/DividaService'
import somarDividas from '@/utils/somarDividas'
import * as RN from '@react-navigation/native'
import * as ER from 'expo-router'
import React from 'react'
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

// Componente para renderizar cada item da lista
const ClienteItem = ({ cliente }: { cliente: ICliente }) => {
  // Adicione a lógica para navegar para os detalhes do cliente ao clicar
  const handlePress = () => {
    // Exemplo de navegação para uma rota dinâmica como /details/[id]
    // Suponha que você tem uma tela em 'app/details/[id].tsx'
    ER.router.push(`/detalhes?id=${cliente.id}`)
  }

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={handlePress}>
      <View style={styles.textContainer}>
        <Text style={styles.clienteNome}>{cliente.nome}</Text>
      </View>
      <Text style={styles.dividaValor}>
        {/* Formatação para moeda (ajuste conforme a necessidade) */}
        R$ {cliente?.totalDivida?.toFixed(2).replace('.', ',')}
      </Text>
    </TouchableOpacity>
  )
}

export default function HomeScreen() {
  const [clientes, setClientes] = React.useState<ICliente[]>([])
  const [clientesFiltrada, setClientesFiltrada] = React.useState<ICliente[]>([])
  const [buscar, setBuscar] = React.useState('')

  RN.useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        await initDatabase()
        const clientesOriginais = await getClientes()

        const clientesComDividasPromise = clientesOriginais.map(async (cliente) => {
          const id = cliente.id

          const divida = await getDividasIdByCliente(id)

          const totalDivida = somarDividas(divida)

          const clienteComTotal = {
            ...cliente, // Copia todas as propriedades do cliente original
            totalDivida, // Adiciona a nova propriedade
          }
          return clienteComTotal
        })

        const clientesProcessados = await Promise.all(clientesComDividasPromise)
        setClientes(clientesProcessados)
        setClientesFiltrada(clientesProcessados)
      }

      loadData()
    }, [])
  )

  // Função de ação do Menu
  const handleMenuPress = (key: string) => {
    switch (key) {
      case 'cliente':
        ER.router.push('/create')
        break
      case 'divida':
        ER.router.push('/divida')
        break
    }
  }

  const renderItem = ({ item }: { item: ICliente }) => <ClienteItem cliente={item} />
  const handleBuscarCliente = (event: string) => {
    // se for input HTML comum:
    // setBuscar(event.target.value);

    // se for React Native:
    setBuscar(event)
    setClientesFiltrada(clientes.filter((c) => c.nome.includes(event)))
  }

  return (
    <View style={styles.content}>
      <View style={styles.inputContainer}>
        <TextInput
          value={buscar}
          onChangeText={handleBuscarCliente}
          style={styles.inputText}
          placeholder="Buscar Cliente..."
        />
      </View>

      <FlatList
        data={clientesFiltrada}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()} // Use um ID único
        contentContainerStyle={clientesFiltrada.length === 0 ? styles.listEmptyContent : undefined}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.welcomeText}>Bem-vindo à Caderneta Digital!</Text>
            <Text style={styles.infoText}>Use o botão (+) para adicionar clientes ou dívidas.</Text>
          </View>
        )}
        style={styles.list}
      />

      <FloatingMenuButton onMenuItemPress={handleMenuPress} />
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    marginBottom: 12,
    padding: 10,
  },
  inputText: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  content: {
    flex: 1,
    display: 'flex',
  },
  list: {
    flex: 1,
  },
  listEmptyContent: {
    flex: 1, // Para centralizar o conteúdo vazio
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // Pode querer adicionar estilos de tamanho aqui se a FlatList não estiver em flex: 1 total
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
    marginBottom: 20,
  },

  // Estilos para o item da FlatList
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50', // Uma cor para destaque
  },
  textContainer: {
    flex: 1,
  },
  clienteNome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  clienteDetalhe: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  dividaValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F', // Cor vermelha para dívidas
    marginLeft: 10,
  },
})
