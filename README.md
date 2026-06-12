1️⃣ HTML (Estructura + Datos):
   - Proporciona la "carcasa" visual
   - Usa atributos data-* para etiquetar botones con información que JS necesita
   - Ejemplo: <button data-op="*">× → JS lee "*", usuario ve "×"

2️⃣ CSS (Presentación):
   - Estiliza los elementos mediante clases (btn, calculator, etc.)
   - Define transiciones, colores, grid layout
   - Responsividad: media queries para móviles

3️⃣ JavaScript (Comportamiento):
   - Selecciona elementos por ID o clase: document.getElementById('display')
   - Escucha eventos: btn.addEventListener('click', ...)
   - Manipula el DOM: display.value = resultado
   - Inyecta contenido dinámico: historyList.appendChild(...)

   1️⃣ CSS Custom Properties (Variables):
   - Definidas en :root para alcance global
   - Permiten mantenimiento centralizado y creación de temas
   - Ejemplo: Cambiar --calculator-body actualiza 15+ reglas automáticamente

2️⃣ CSS Grid + Flexbox:
   - Grid para el layout de botones (bidimensional, preciso)
   - Flexbox para componentes lineales (header, wrapper, panel científico)
   - Combinación moderna para layouts complejos y responsivos

3️⃣ Mobile-First con Media Queries:
   - Estilos base para desktop
   - @media (max-width: 768px) y 480px para adaptar a móviles
   - Cambios estratégicos: flex-direction, tamaños de fuente, gaps

4️⃣ Efectos 3D con Box-Shadow:
   - Sombras múltiples para simular profundidad física
   - :active con transform: translateY para feedback táctil
   - Mejora la UX haciéndolo sentir como una calculadora real

5️⃣ Accesibilidad y UX:
   - cursor: pointer en elementos interactivos
   - outline en :focus para navegación por teclado
   - Contraste de colores verificado para legibilidad



   ┌─────────────────────────────────────────────────┐
│  1. INPUT: Usuario interactúa con la interfaz   │
└─────────────────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
┌─────────────────┐         ┌─────────────────────┐
│ A. Click botón  │         │ B. Escritura directa│
│ (HTML: data-*)  │         │ (keyboard input)    │
└─────────────────┘         └─────────────────────┘
        │                               │
        ▼                               ▼
┌─────────────────────────────────────────────┐
│  2. EVENT LISTENER (script.js)              │
│  • Captura el evento click/input            │
│  • Lee data attribute: btn.dataset.op       │
│  • Llama a: appendToDisplay(value)          │
└─────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────┐
│  3. MANIPULACIÓN DEL DOM (display.value)    │
│  • Actualiza el input visible para el usuario│
│  • Mantiene foco para entrada continua      │
│  • Aplica lógica: reset después de resultado│
└─────────────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
┌─────────────────┐         ┌─────────────────────┐
│ Usuario presiona│         │ Usuario sigue       │
│ "=" o "Enter"   │         │ escribiendo         │
└─────────────────┘         └─────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│  4. PROCESAMIENTO: computeResult()          │
│  • Lee expresión completa: display.value    │
│  • Llama a: evaluateExpression(expression)  │
│                                              │
│  ┌─ evaluateExpression() ─┐                │
│  │ 1. Normaliza: ×→*, ÷→/ │                │
│  │ 2. Convierte funciones │                │
│  │    √→Math.sqrt, cos→Math.cos │          │
│  │ 3. Evalúa con Function()│                │
│  │ 4. Valida: isNaN, isFinite │             │
│  │ 5. Redondea decimales  │                │
│  └────────────────────────┘                │
└─────────────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
┌─────────────────┐         ┌─────────────────────┐
│ ✅ Resultado válido│    │ ❌ Error detectado   │
└─────────────────┘         └─────────────────────┘
        │                               │
        ▼                               ▼
┌─────────────────┐         ┌─────────────────────┐
│ • addToHistory()│         │ • display.value =  │
│ • display.value=│         │   "Error"          │
│   resultado     │         │ • shouldReset=true │
│ • shouldReset=  │         └─────────────────────┘
│   true          │                     │
└─────────────────┘                     │
        │                               │
        └───────────────┬───────────────┘
                        ▼
┌─────────────────────────────────────────────┐
│  5. OUTPUT: Actualización visual            │
│  • DOM: display.value refleja nuevo estado │
│  • Historial: Nuevo item inyectado con     │
│    insertBefore() + límite de 10 items     │
│  • UX: shouldReset prepara próxima entrada │
└─────────────────────────────────────────────┘

📥 FASE 1: CAPTURA DEL INPUT
• HTML tiene atributos data-* (data-num="7", data-op="+")
• JavaScript usa addEventListener('click') en los botones
• Al hacer click: btn.dataset.op lee el valor del atributo

⚙️ FASE 2: PROCESAMIENTO
• appendToDisplay(): Agrega el carácter al input visible
• computeResult(): Se activa con "=" o Enter
• evaluateExpression(): 
  - Convierte símbolos visuales (×, ÷, √) a sintaxis JS (*, /, Math.sqrt)
  - Usa Function() en modo estricto para evaluar de forma segura
  - Valida con isNaN/isFinite y redondea decimales

📤 FASE 3: SALIDA Y ACTUALIZACIÓN
• display.value = resultado → El usuario ve el número
• addToHistory() → Inyecta un nuevo div en el historial con insertBefore()
• shouldResetDisplay = true → Prepara la calculadora para la siguiente operación

🔁 CICLO CONTINUO
El usuario puede seguir operando porque el foco se mantiene en el display
y el estado (shouldResetDisplay) controla cuándo limpiar para nueva entrada.
