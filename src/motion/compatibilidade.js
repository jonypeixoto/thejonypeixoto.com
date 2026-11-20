export function observaMidia(consulta, listener) {
  if (consulta.addEventListener) {
    consulta.addEventListener('change', listener);
    return () => consulta.removeEventListener('change', listener);
  }
  consulta.addListener(listener);
  return () => consulta.removeListener(listener);
}
