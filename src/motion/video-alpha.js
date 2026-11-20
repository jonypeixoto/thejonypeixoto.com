// A metade direita do MP4 transporta a máscara, sincronizada com a cor à esquerda.
export function videoAlpha(video, { fluido, packed = true } = {}) {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
  if (!gl) return null;
  const shader = (tipo, codigo) => {
    const s = gl.createShader(tipo);
    gl.shaderSource(s, codigo);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
    return s;
  };
  const vertex = shader(gl.VERTEX_SHADER, 'attribute vec2 p; varying vec2 uv; void main(){uv=vec2((p.x+1.0)*0.5,(1.0-p.y)*0.5);gl_Position=vec4(p,0.0,1.0);}');
  const fragment = shader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    uniform sampler2D frame;
    uniform sampler2D flow;
    uniform float uPacked;
    uniform float reveal;
    varying vec2 uv;
    void main(){
      vec4 color=texture2D(frame,vec2(uv.x*mix(1.0,0.5,uPacked),uv.y));
      float a=mix(color.a,texture2D(frame,vec2(0.5+uv.x*0.5,uv.y)).r,uPacked);
      float ribbon=smoothstep(0.025,0.15,texture2D(flow,uv).r);
      // Recorta a faixa dos óculos e conserva somente a luz azul/violeta.
      // A pele e os movimentos da cabeça continuam pertencendo à foto estática.
      float band=smoothstep(0.255,0.28,uv.y)*(1.0-smoothstep(0.42,0.445,uv.y));
      band*=smoothstep(0.055,0.09,uv.x)*(1.0-smoothstep(0.91,0.955,uv.x));
      float light=smoothstep(0.035,0.15,max(color.b,color.g)-color.r);
      float violet=smoothstep(0.06,0.18,color.b-color.g)*smoothstep(-0.12,0.02,color.b-color.r);
      float highlight=smoothstep(0.55,0.85,min(max(color.r,color.b),color.g));
      light=max(light,max(violet,highlight));
      light*=smoothstep(0.25,0.5,max(color.b,color.g));
      gl_FragColor=vec4(color.rgb,a*mix(1.0,ribbon*band*light,reveal));
    }
  `);
  if (!vertex || !fragment) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  const p = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(p);
  gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniform1i(gl.getUniformLocation(program, 'frame'), 0);
  const packedUniform = gl.getUniformLocation(program, 'uPacked');
  gl.uniform1f(packedUniform, packed ? 1 : 0);
  const revealUniform = gl.getUniformLocation(program, 'reveal');
  gl.uniform1f(revealUniform, fluido ? 1 : 0);
  gl.uniform1i(gl.getUniformLocation(program, 'flow'), 1);
  gl.activeTexture(gl.TEXTURE1);
  const flow = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, flow);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
  gl.activeTexture(gl.TEXTURE0);
  canvas.className = 'hero__video hero__video--alpha';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.width = 540;
  canvas.height = 960;
  let instante = -1;
  const desenha = () => {
    if (gl.isContextLost() || video.readyState < 2) return false;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    if (instante !== video.currentTime) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    if (fluido) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, flow);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fluido.width, fluido.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, fluido.pixels);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    instante = video.currentTime;
    return true;
  };
  return { canvas, desenha, setReveal(value) {
    gl.uniform1f(revealUniform, value);
  }, setPacked(value) {
    gl.uniform1f(packedUniform, value ? 1 : 0);
    instante = -1;
  } };
}
