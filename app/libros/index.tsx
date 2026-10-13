import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { api, Libro } from "../../src/api";
import { decodificarToken, eliminarToken, obtenerToken } from "../../src/auth";

export default function Libros() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [rol, setRol] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevoAutor, setNuevoAutor] = useState("");

  const cargar = async () => {
    setCargando(true);
    const token = await obtenerToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    const payload = decodificarToken(token);
    if (payload) {
      setRol(payload.rol);
      setEmail(payload.email);
    }
    const data = await api.getLibros(token);
    setLibros(Array.isArray(data) ? data : []);
    setCargando(false);
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleLogout = async () => {
    await eliminarToken();
    router.replace("/login");
  };

  const handlePrestar = async (libro: Libro) => {
    const token = await obtenerToken();
    if (!token) return;
    const res = await api.createPrestamo(token, libro.id);
    if ("error" in res) {
      Alert.alert("Error", res.error);
    } else {
      Alert.alert("Listo", `Libro "${libro.titulo}" prestado`);
      cargar();
    }
  };

  const handleCrear = async () => {
    if (!nuevoTitulo || !nuevoAutor) {
      Alert.alert("Error", "Completa titulo y autor");
      return;
    }
    const token = await obtenerToken();
    if (!token) return;
    const res = await api.createLibro(token, nuevoTitulo, nuevoAutor);
    if ("error" in res) {
      Alert.alert("Error", res.error);
    } else {
      setModalVisible(false);
      setNuevoTitulo("");
      setNuevoAutor("");
      cargar();
    }
  };

  const handleEliminar = (libro: Libro) => {
    Alert.alert(
      "Confirmar",
      `Eliminar "${libro.titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const token = await obtenerToken();
            if (!token) return;
            const res = await api.deleteLibro(token, libro.id);
            if ("error" in res) {
              Alert.alert("Error", res.error);
            } else {
              cargar();
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.email}>{email}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Salir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.botones}>
        <TouchableOpacity
          style={styles.botonNav}
          onPress={() => router.push("/prestamos")}
        >
          <Text style={styles.botonNavTexto}>Mis prestamos</Text>
        </TouchableOpacity>
        {rol === "admin" && (
          <>
            <TouchableOpacity
              style={[styles.botonNav, styles.botonCrear]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.botonNavTexto}>+ Crear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botonNav, styles.botonAdmin]}
              onPress={() => router.push("/admin/prestamos")}
            >
              <Text style={styles.botonNavTexto}>Admin</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {cargando ? (
        <ActivityIndicator size="large" color="#1e3a8a" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={libros}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.vacio}>No hay libros registrados</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.titulo}>{item.titulo}</Text>
                <Text style={styles.autor}>{item.autor}</Text>
                <Text
                  style={[
                    styles.badge,
                    item.disponible ? styles.badgeOk : styles.badgeNo,
                  ]}
                >
                  {item.disponible ? "Disponible" : "Prestado"}
                </Text>
              </View>
              {item.disponible && (
                <TouchableOpacity
                  style={styles.botonPrestar}
                  onPress={() => handlePrestar(item)}
                >
                  <Text style={styles.botonPrestarTexto}>Pedir</Text>
                </TouchableOpacity>
              )}
              {rol === "admin" && (
                <TouchableOpacity
                  style={styles.botonEliminar}
                  onPress={() => handleEliminar(item)}
                >
                  <Text style={styles.botonEliminarTexto}>Eliminar</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitulo}>Nuevo libro</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Titulo"
              value={nuevoTitulo}
              onChangeText={setNuevoTitulo}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Autor"
              value={nuevoAutor}
              onChangeText={setNuevoAutor}
            />
            <View style={styles.modalBotones}>
              <TouchableOpacity
                style={[styles.modalBoton, styles.modalBotonCancelar]}
                onPress={() => {
                  setModalVisible(false);
                  setNuevoTitulo("");
                  setNuevoAutor("");
                }}
              >
                <Text style={styles.modalBotonTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBoton, styles.modalBotonCrear]}
                onPress={handleCrear}
              >
                <Text style={styles.modalBotonTexto}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  email: { fontSize: 14, color: "#374151", fontWeight: "500" },
  logout: { color: "#dc2626", fontWeight: "bold" },
  botones: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  botonNav: {
    backgroundColor: "#1e3a8a",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  botonCrear: { backgroundColor: "#059669" },
  botonAdmin: { backgroundColor: "#7c3aed" },
  botonNavTexto: { color: "#fff", fontWeight: "600", fontSize: 13 },
  vacio: { textAlign: "center", color: "#6b7280", marginTop: 40 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
    gap: 8,
  },
  titulo: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  autor: { fontSize: 14, color: "#6b7280", marginTop: 2 },
  badge: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  badgeOk: { color: "#065f46", backgroundColor: "#d1fae5" },
  badgeNo: { color: "#991b1b", backgroundColor: "#fee2e2" },
  botonPrestar: {
    backgroundColor: "#1e3a8a",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
  },
  botonPrestarTexto: { color: "#fff", fontWeight: "bold" },
  botonEliminar: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
  },
  botonEliminarTexto: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    fontSize: 16,
  },
  modalBotones: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  modalBoton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  modalBotonCancelar: { backgroundColor: "#6b7280" },
  modalBotonCrear: { backgroundColor: "#059669" },
  modalBotonTexto: { color: "#fff", fontWeight: "bold" },
});
