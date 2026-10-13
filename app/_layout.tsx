import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1e3a8a" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Iniciar sesión" }} />
      <Stack.Screen name="registro" options={{ title: "Registrarse" }} />
      <Stack.Screen name="libros/index" options={{ title: "Libros" }} />
      <Stack.Screen name="prestamos/index" options={{ title: "Mis préstamos" }} />
      <Stack.Screen name="admin/prestamos" options={{ title: "Todos los préstamos" }} />
    </Stack>
  );
}
