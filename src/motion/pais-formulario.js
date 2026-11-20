// Estima apenas o país, sem GPS e sem conservar o IP retornado.
export async function paisFormulario() {
  const controle = new AbortController();
  const limite = setTimeout(() => controle.abort(), 3000);
  try {
    const resposta = await fetch('https://api.country.is/', {
      signal: controle.signal,
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      cache: 'no-store',
    });
    if (!resposta.ok) throw new Error('País indisponível');
    const { country } = await resposta.json();
    if (typeof country !== 'string' || !/^[A-Z]{2}$/.test(country)) throw new Error('País inválido');
    let nome = country;
    try { nome = new Intl.DisplayNames(['pt-BR'], { type: 'region' }).of(country) || country; } catch {}
    return {
      pais_origem: `${nome} (${country})`,
      identificacao_pais: 'Estimativa automática por IP; VPN/proxy pode alterar o país.',
    };
  } catch {
    return {
      pais_origem: 'Não identificado',
      identificacao_pais: 'Consulta por IP indisponível; o envio foi mantido.',
    };
  } finally {
    clearTimeout(limite);
  }
}
