import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const URL = 'https://pokeapi.co/api/v2/pokemon?limit=20';

export default function App() {
  const [pokemones, setPokemones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;

    async function cargarPokemones() {
      setCargando(true);
      setError('');
      try {
        const respuesta = await fetch(URL);
        if (!respuesta.ok) {
          throw new Error(`Error HTTP ${respuesta.status}`);
        }
        const datos = await respuesta.json();
        
        // PokeAPI devuelve un objeto con la propiedad "results" que es el arreglo
        if (!datos || !Array.isArray(datos.results)) {
          throw new Error('La respuesta no tiene el formato esperado');
        }

        const listaConDetalles = datos.results.map((item) => {
          // item.url es algo como: "https://pokeapi.co/api/v2/pokemon/1/"
          const partesUrl = item.url.split('/').filter(Boolean);
          const id = partesUrl[partesUrl.length - 1];
          return {
            id,
            name: item.name.toUpperCase(),
            urlImagen: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
          };
        });

        if (activo) setPokemones(listaConDetalles);
      } catch (e) {
        if (activo) {
          setPokemones([]);
          setError('No se pudieron cargar los Pokémon.');
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarPokemones();

    return () => {
      activo = false;
    };
  }, [intento]);

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Pokédex - Directorio</Text>
      <Text style={styles.subtitulo}>
        Datos obtenidos desde la PokeAPI
      </Text>

      {cargando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#E53935" />
          <Text style={styles.aviso}>Cargando Pokémon...</Text>
        </View>
      ) : error ? (
        <View style={styles.centro}>
          <Text style={styles.error}>{error}</Text>
          <Pressable
            style={styles.boton}
            onPress={() => setIntento((n) => n + 1)}
          >
            <Text style={styles.botonTexto}>Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={pokemones}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <Image source={{ uri: item.urlImagen }} style={styles.imagen} />
              <View style={styles.infoContainer}>
                <Text style={styles.nombre}>#{item.id} - {item.name}</Text>
                <Text style={styles.dato}>Tipo: Registro oficial de API</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.aviso}>No hay Pokémon disponibles.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F3F8FB',
    paddingTop: 50,
    paddingHorizontal: 18,
  },
  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#133A50',
  },
  subtitulo: {
    fontSize: 13,
    color: '#5E7380',
    marginTop: 6,
    marginBottom: 18,
  },
  tarjeta: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderColor: '#D8E6EC',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagen: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#133A50',
  },
  dato: {
    color: '#5E7380',
    marginTop: 4,
    fontSize: 13,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aviso: {
    marginTop: 13,
    color: '#5E7380',
    fontSize: 15,
    textAlign: 'center',
  },
  error: {
    color: '#CB5B56',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  boton: {
    backgroundColor: '#E53935',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 9,
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});