import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";
import { obtenerToken } from "../src/auth";

export default function Index() {
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificar = async () => {
      const token = await obtenerToken();
      if (token) {
        router.replace("/libros");
      } else {
        router.replace("/login");
      }
      setCargando(false);
    };
    verificar();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#1e3a8a" />
    </View>
  );
}
