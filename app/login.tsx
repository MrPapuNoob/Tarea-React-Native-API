import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { api } from "../src/api";
import { guardarToken } from "../src/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    setCargando(true);
    const data = await api.login(email, password);
    setCargando(false);
    if (data.token) {
      await guardarToken(data.token);
      router.replace("/libros");
    } else {
      Alert.alert("Error", data.error || "Credenciales inválidas");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Biblioteca</Text>
      <Text style={styles.subtitulo}>Iniciar sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.boton} onPress={handleLogin} disabled={cargando}>
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botonTexto}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={() => router.push("/registro")}>
        <Text style={styles.linkTexto}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 24,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1e3a8a",
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 18,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    fontSize: 16,
  },
  boton: {
    backgroundColor: "#1e3a8a",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  botonTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
    alignItems: "center",
  },
  linkTexto: {
    color: "#1e3a8a",
    fontSize: 14,
    fontWeight: "500",
  },
});
