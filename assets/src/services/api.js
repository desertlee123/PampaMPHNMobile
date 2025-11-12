export const API_BASE_URL = "http://192.168.0.106:8000/api";
export const IMAGE_BASE_URL = "http://192.168.0.106:8000/img";

export async function getAllArticulos(){
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

export async function getLastArticulos(){
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

export async function getAllCategorias(){
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

export async function getSaveArticulos(){
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