import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { api, Prestamo } from "../../src/api";
import { obtenerToken } from "../../src/auth";

export default function MisPrestamos() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = async () => {
    setCargando(true);
    const token = await obtenerToken();
    if (!token) return;
    const data = await api.getMisPrestamos(token);
    setPrestamos(Array.isArray(data) ? data : []);
    setCargando(false);
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleDevolver = async (id: number) => {
    const token = await obtenerToken();
    if (!token) return;
    const res = await api.devolverPrestamo(token, id);
    if ("error" in res) {
      Alert.alert("Error", res.error);
    } else {
      Alert.alert("Listo", "Libro devuelto");
      cargar();
    }
  };

  return (
    <View style={styles.container}>
      {cargando ? (
        <ActivityIndicator size="large" color="#1e3a8a" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={prestamos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.vacio}>No tienes préstamos</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.titulo}>{item.libro?.titulo || `Libro #${item.libroId}`}</Text>
              <Text style={styles.fecha}>
                Inicio: {new Date(item.fechaInicio).toLocaleDateString()}
              </Text>
              <Text style={styles.fecha}>
                Fin: {item.fechaFin ? new Date(item.fechaFin).toLocaleDateString() : "En curso"}
              </Text>
              {!item.fechaFin && (
                <TouchableOpacity
                  style={styles.botonDevolver}
                  onPress={() => handleDevolver(item.id)}
                >
                  <Text style={styles.botonDevolverTexto}>Devolver</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  vacio: { textAlign: "center", color: "#6b7280", marginTop: 40 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  titulo: { fontSize: 16, fontWeight: "bold", color: "#111827", marginBottom: 6 },
  fecha: { fontSize: 14, color: "#6b7280", marginTop: 2 },
  botonDevolver: {
    backgroundColor: "#059669",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 12,
  },
  botonDevolverTexto: { color: "#fff", fontWeight: "bold" },
});
