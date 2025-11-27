// assets/src/services/api.js
export const API_BASE_URL = "http://192.168.0.106:8000/api";
export const IMAGE_BASE_URL = "http://192.168.0.106:8000/img";

export async function getAllArticulos() {
    try {
        const response = await fetch(`${API_BASE_URL}/articulos`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // await new Promise(resolve => setTimeout(resolve, 7000));

        const jsonData = await response.json();

        if (!jsonData || !Array.isArray(jsonData)) {
            throw new Error('Estructura de respuesta inválida: esperaba jsonData como array');
        }

        return jsonData.map((item) => {
            const {
                id,
                titulo,
                imagen,
                para_socios,
            } = item;

            const img = imagen ? `${IMAGE_BASE_URL}/${imagen}` : null;

            return {
                id,
                titulo,
                imageUrl: img,
                para_socios,
            };

        });
    } catch (error) {
        console.error('Error al obtener artículos:', error);
        throw error;
    }
}

export async function getLastArticulos() {
    try {
        const response = await fetch(`${API_BASE_URL}/articulos/recientes`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // await new Promise(resolve => setTimeout(resolve, 7000));

        const jsonData = await response.json();

        if (!jsonData || !Array.isArray(jsonData)) {
            throw new Error('Estructura de respuesta inválida: esperaba jsonData como array');
        }

        return jsonData.map((item) => {
            const {
                id,
                titulo,
                imagen,
                para_socios,
            } = item;

            const img = imagen ? `${IMAGE_BASE_URL}/${imagen}` : null;

            return {
                id,
                titulo,
                imageUrl: img,
                para_socios,
            };

        });
    } catch (error) {
        console.error('Error al obtener artículos:', error);
        throw error;
    }
}

export async function getAllCategorias() {
    try {
        const response = await fetch(`${API_BASE_URL}/categorias`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // await new Promise(resolve => setTimeout(resolve, 7000));

        const jsonData = await response.json();

        const categoriasData = jsonData.categorias;

        if (!categoriasData || !Array.isArray(categoriasData)) {
            throw new Error('Estructura de respuesta inválida: esperaba jsonData como array');
        }

        return categoriasData.map((item) => {
            const {
                id,
                nombre,
                imagen,
            } = item;

            const img = imagen ? `${IMAGE_BASE_URL}/${imagen}` : null;

            return {
                id,
                nombre,
                imageUrl: img,
            };

        });
    } catch (error) {
        console.error('Error al obtener categorias:', error);
        throw error;
    }
}

export async function getArticuloPorId(id) {
    const url = `${API_BASE_URL}/articulos/${id}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // await new Promise(resolve => setTimeout(resolve, 7000));

        const jsonData = await response.json();

        if (!jsonData) {
            throw new Error('Estructura de respuesta inválida: esperaba jsonData como array');
        }

        const {
            id,
            autor,
            titulo,
            imagen,
            descripcion,
            fecha_publicacion,
            metadatos,
            para_socios,
        } = jsonData;

        const img = imagen ? `${IMAGE_BASE_URL}/${imagen}` : null;

        return {
            id,
            autor,
            titulo,
            descripcion,
            fecha_publicacion,
            imageUrl: img,
            metadatos,
            para_socios,
        };
    } catch (error) {
        console.error('Error al obtener artículos:', error);
        throw error;
    }
}

export async function saveArticulo(idArticulo, session) {

    if (session.role === 'visitor') {
        alert("Debes registrarse para guardar artículos");
        return;
    }

    if (!session.token) {
        alert("Token no disponible. Por favor, vuelve a iniciar sesión.");
        console.error('Token no disponible:', session);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/usuarios/articulos/guardar`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.token}`,
            },
            body: JSON.stringify({
                id_articulo: idArticulo,
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error response:', response.status, errorData);
            alert(`No se pudo guardar el artículo: ${response.status} ${errorData.message || ''}`);
            return;
        }

        const data = await response.json();
        console.log('Artículo guardado exitosamente:', data);
        // alert("Artículo guardado exitosamente");
        return data;

    } catch (error) {
        console.error('Error al guardar artículo:', error);
        alert(`Error: ${error.message}`);
        return null;
    }
}

// services/api.js - Agregar esta función
export async function checkIfArticleSaved(articleId, session) {
    if (!session?.token || session.token === "VISITOR_MODE") {
        return false;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/usuarios/articulos/guardados`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.token}`
            }
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        // Verificar si el artículo está en la lista de guardados
        return data.articulos?.some(articulo => articulo.id === articleId) || false;

    } catch (error) {
        console.error('Error al verificar artículo guardado:', error);
        return false;
    }
}

export async function isSaveArticulo(idArticulo, session) {

    if (session.role === 'visitor') {
        return false;
    }

    if (!session.token) {
        // alert("Token no disponible. Por favor, vuelve a iniciar sesión.");
        console.error('Token no disponible:', session);
        return false;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/usuarios/articulos/guardados`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.token}`,
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error response:', response.status, errorData);
            return false;
        }

        const data = await response.json();
        const { articulos } = data;
        console.log('Artículo cargados exitosamente:', data);

        for (let i = 0; i < articulos.length; i++) {
            if (articulos[i].id == idArticulo) {
                return true;
            }
        }

        return false;

    } catch (error) {
        console.error('Error al guardar artículo:', error);
        return false;
    }
}

export async function getComentarios(idArticulo) {
    try {
        const response = await fetch(`${API_BASE_URL}/comentarios/${idArticulo}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();

        if (!jsonData || !Array.isArray(jsonData)) {
            throw new Error('Estructura de respuesta inválida: esperaba jsonData como array');
        }

        // Obtener todos los IDs de usuario
        const usuarioIds = [...new Set(jsonData.map(item => item.usuarios_id))];

        // Crear una lista de promesas para cargar la información de cada usuario
        const usuarioPromises = usuarioIds.map(id => getUsuarioPorId(id));

        // Esperar a que se resuelvan todas las promesas de usuario
        const usuariosData = await Promise.all(usuarioPromises);

        // Mapear los datos de usuario por ID para una búsqueda rápida
        const usuariosMap = usuariosData.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
        }, {});

        // Mapear los comentarios e inyectar el objeto de usuario completo
        return jsonData.map((item) => {
            const {
                id,
                mensaje,
                usuarios_id,
                articulo_id,
                created_at,
            } = item;

            // Buscar el usuario ya cargado por su ID
            const usuario = usuariosMap[usuarios_id];

            return {
                id,
                mensaje,
                usuario_id: usuarios_id,
                articulo_id,
                // Usar el objeto de usuario real, o un valor por defecto si no se encontró
                usuario: usuario || { nombre: 'Usuario', id: usuarios_id },
                created_at,
            };
        });
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        throw error;
    }
}

export async function crearComentario(mensaje, id_articulo, usuario_id, session) {
    if (!session.token) {
        alert("Token no disponible. Por favor, vuelve a iniciar sesión.");
        console.error('Token no disponible:', session);
        return null;
    }

    if (!mensaje || mensaje.trim().length === 0) {
        alert("El comentario no puede estar vacío");
        return null;
    }

    if (mensaje.length > 250) {
        alert("El comentario no puede exceder 250 caracteres");
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/usuarios/comentar`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.token}`,
            },
            body: JSON.stringify({
                mensaje,
                articulos_id: id_articulo,
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error response:', response.status, errorData);
            alert(`No se pudo crear el comentario: ${response.status} ${errorData.message || ''}`);
            return null;
        }

        const data = await response.json();
        console.log('Comentario creado exitosamente:', data);
        return data;

    } catch (error) {
        console.error('Error al crear comentario:', error);
        alert(`Error: ${error.message}`);
        return null;
    }
}

export async function getUsuarioPorId(id) {
    const url = `${API_BASE_URL}/usuarios/${id}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();

        if (!jsonData || !jsonData.name) {
            throw new Error('Estructura de respuesta de usuario inválida: falta el campo name');
        }

        // Retorna solo la información relevante del usuario (id y nombre)
        return {
            id: jsonData.id,
            nombre: jsonData.name,
            role: jsonData.role,
        };
    } catch (error) {
        // En caso de error, retorna un usuario por defecto
        console.error(`Error al obtener usuario ${id}:`, error);
        return { id, nombre: 'Usuario' };
    }
}
