'use server'
 
export async function crearCalculadora(formulario: FormData) {
    const response = await fetch('/api/calculadoras', {
        method: 'POST',
        body: formulario
    });
    return response.json();
}

export async function crearParametro(formulario: FormData) {
    const response = await fetch('/api/parametros', {
        method: 'POST',
        body: formulario
    });
    return response.json();
}

export async function crearValor(formulario: FormData) {
    const response = await fetch('/api/valores', {
        method: 'POST',
        body: formulario
    });
    return response.json();
}