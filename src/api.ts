declare const process: { env: { EXPO_PUBLIC_API_URL?: string } };
const API_URL: string = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export type Libro = {
  id: number;
  titulo: string;
  autor: string;
  disponible: boolean;
};

export type Usuario = {
  id: number;
  nombre: string;
  email: string;
  rol: string;
};

export type Prestamo = {
  id: number;
  fechaInicio: string;
  fechaFin: string | null;
  libroId: number;
  usuarioId: number;
  libro?: Libro;
  usuario?: Usuario;
};

export type LoginResponse = {
  token?: string;
  error?: string;
};

export const api = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  registro: async (
    nombre: string,
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    const res = await fetch(`${API_URL}/auth/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });
    return res.json();
  },

  getLibros: async (token: string): Promise<Libro[]> => {
    const res = await fetch(`${API_URL}/libros`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  createLibro: async (
    token: string,
    titulo: string,
    autor: string
  ): Promise<Libro | { error: string }> => {
    const res = await fetch(`${API_URL}/libros`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ titulo, autor }),
    });
    return res.json();
  },

  deleteLibro: async (
    token: string,
    id: number
  ): Promise<{ message: string } | { error: string }> => {
    const res = await fetch(`${API_URL}/libros/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  getMisPrestamos: async (token: string): Promise<Prestamo[]> => {
    const res = await fetch(`${API_URL}/prestamos/mis-prestamos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  getAllPrestamos: async (token: string): Promise<Prestamo[]> => {
    const res = await fetch(`${API_URL}/prestamos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  createPrestamo: async (
    token: string,
    libroId: number
  ): Promise<Prestamo | { error: string }> => {
    const res = await fetch(`${API_URL}/prestamos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ libroId }),
    });
    return res.json();
  },

  devolverPrestamo: async (
    token: string,
    id: number
  ): Promise<Prestamo | { error: string }> => {
    const res = await fetch(`${API_URL}/prestamos/${id}/devolver`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};
