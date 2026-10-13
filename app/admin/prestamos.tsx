import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { api, Prestamo } from "../../src/api";
import { decodificarToken, obtenerToken } from "../../src/auth";

export default function AdminPrestamos() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const token = await obtenerToken();
      if (!token) {
        router.replace("/login");
        return;
      }
      const payload = decodificarToken(token);
      if (payload?.rol !== "admin") {
        router.replace("/libros");
        return;
      }
      const data = await api.getAllPrestamos(token);
      setPrestamos(Array.isArray(data) ? data : []);
      setCargando(false);
    };
    cargar();
  }, []);

  return (
    <View style={styles.container}>
      {cargando ? (
        <ActivityIndicator size="large" color="#7c3aed" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={prestamos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.vacio}>No hay préstamos registrados</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.titulo}>
                {item.libro?.titulo || `Libro #${item.libroId}`}
              </Text>
              <Text style={styles.usuario}>
                Usuario: {item.usuario?.nombre || `#${item.usuarioId}`}
              </Text>
              <Text style={styles.email}>{item.usuario?.email}</Text>
              <View style={styles.divisor} />
              <Text style={styles.fecha}>
                Inicio: {new Date(item.fechaInicio).toLocaleDateString()}
              </Text>
              <Text style={styles.fecha}>
                Fin: {item.fechaFin ? new Date(item.fechaFin).toLocaleDateString() : "En curso"}
              </Text>
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
  titulo: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  usuario: { fontSize: 14, color: "#374151", marginTop: 4 },
  email: { fontSize: 13, color: "#6b7280" },
  divisor: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 8,
  },
  fecha: { fontSize: 13, color: "#6b7280" },
});
