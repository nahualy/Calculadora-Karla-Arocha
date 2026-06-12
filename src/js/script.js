// ============================================
// CALCULADORA CLÁSICA - SCRIPT.JS
// Lógica principal: Manejo de eventos, cálculo y DOM
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    
    // ===== REFERENCIAS A ELEMENTOS DEL DOM =====
    const display = document.getElementById('display');
    const toggleBtn = document.getElementById('toggleHistory');
    const historyPanel = document.getElementById('historyPanel');
    const closeBtn = document.getElementById('closeHistory');
    const clearBtn = document.getElementById('btn-clear');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const historyList = document.getElementById('historyList');
    const numberBtns = document.querySelectorAll('.btn-number');
    const dotBtn = document.querySelector('.btn-dot');
    const equalBtn = document.querySelector('.btn-equal');
    
    // Elementos para el Toast
    const operatorToastEl = document.getElementById('operatorToast');
    const toastMessage = document.getElementById('toastMessage');
    const operatorBtnsQuery = document.querySelectorAll('.QuerySelect');

    // Inicializar Toast de Bootstrap
    const operatorToast = new bootstrap.Toast(operatorToastEl, {
        delay: 2000,
        autohide: true
    });

    // Variables de estado
    let shouldResetDisplay = false;

    // ===== FUNCIONES DE CÁLCULO =====
    
    function evaluateExpression(expression) {
        let evalExpression = expression;
        
        // Normalizar operadores visuales a sintaxis JS
        evalExpression = evalExpression.replace(/×/g, '*');
        evalExpression = evalExpression.replace(/÷/g, '/');
        evalExpression = evalExpression.replace(/π/g, 'Math.PI');
        evalExpression = evalExpression.replace(/\^/g, '**');
        
        // Lógica inteligente para % (Módulo vs Porcentaje)
        evalExpression = evalExpression.replace(/(\d+\.?\d*)%(\D|$)/g, '($1/100)$2');
        
        // Funciones científicas
        evalExpression = evalExpression.replace(/√(\d+\.?\d*)/g, 'Math.sqrt($1)');
        evalExpression = evalExpression.replace(/cos\(([^)]+)\)/g, 'Math.cos($1)');
        evalExpression = evalExpression.replace(/sin\(([^)]+)\)/g, 'Math.sin($1)');
        evalExpression = evalExpression.replace(/tan\(([^)]+)\)/g, 'Math.tan($1)');
        evalExpression = evalExpression.replace(/log\(([^)]+)\)/g, 'Math.log10($1)');
        evalExpression = evalExpression.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');
        
        try {
            // Evaluación segura con Function constructor
            let result = Function('"use strict"; return (' + evalExpression + ')')();
            
            // Validar resultado numérico
            if (isNaN(result) || !isFinite(result)) {
                return 'Error';
            }
            
            // Redondear a 6 decimales
            result = Math.round(result * 1000000) / 1000000;
            return result;
            
        } catch (error) {
            return 'Error';
        }
    }
    
    function computeResult() {
        const expression = display.value;
        
        if (expression === '' || expression === '0') return;
        
        const result = evaluateExpression(expression);
        
        if (result !== 'Error') {
            addToHistory(`${expression} = ${result}`);
            display.value = result;
            shouldResetDisplay = true;
        } else {
            display.value = 'Error';
            shouldResetDisplay = true;
        }
    }
    
    function appendToDisplay(value) {
        // Auto-limpieza de errores
        if (display.value === 'Error') {
            display.value = '';
            shouldResetDisplay = false;
        }
        
        // Reset después de resultado
        if (shouldResetDisplay) {
            if (display.value !== 'Error') {
                display.value = '';
            }
            shouldResetDisplay = false;
        }
        
        // Manejo del valor inicial "0"
        if (display.value === '0' && !isNaN(value) && value !== '.') {
            display.value = value;
        } else {
            // Valores especiales
            switch(value) {
                case 'sqrt':
                    display.value += '√';
                    break;
                case 'cos':
                case 'sin':
                case 'tan':
                case 'log':
                case 'ln':
                    display.value += value + '(';
                    break;
                case 'pi':
                    display.value += 'π';
                    break;
                case '^':
                    display.value += '^';
                    break;
                case '/':
                    display.value += '÷';
                    break;
                case '*':
                    display.value += '×';
                    break;
                default:
                    // Evitar múltiples puntos decimales
                    if (value === '.' && /[\d.]+$/.test(display.value) && display.value.match(/[\d.]+$/)[0].includes('.')) {
                        return;
                    }
                    display.value += value;
            }
        }
        
        display.focus();
    }
    
    function clearCalculator() {
        display.value = '0';
        shouldResetDisplay = false;
        display.focus();
    }

    // ===== FUNCIONES DEL HISTORIAL =====
    
    function addToHistory(calculation) {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.textContent = calculation;
        
        const firstItem = historyList.querySelector('.text-muted');
        if (firstItem) {
            firstItem.remove();
        }
        
        historyList.insertBefore(historyItem, historyList.firstChild);
        
        const historyItems = historyList.querySelectorAll('.history-item');
        if (historyItems.length > 10) {
            historyItems[historyItems.length - 1].remove();
        }
    }
    
    function clearHistory() {
        historyList.innerHTML = '<div class="history-item text-muted text-center">Sin historial</div>';
    }
    
    function togglePanel() {
        historyPanel.classList.toggle('show');
    }

    // ===== EVENT LISTENERS =====
    
    // Botones numéricos
    numberBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            appendToDisplay(btn.dataset.num);
        });
    });
    
    // Botones operadores con Toast (QuerySelect)
    operatorBtnsQuery.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const operator = btn.dataset.op;
            
            let operatorName = '';
            switch(operator) {
                case '+': operatorName = 'Suma (+)'; break;
                case '-': operatorName = 'Resta (-)'; break;
                case '*': operatorName = 'Multiplicación (×)'; break;
                case '/': operatorName = 'División (÷)'; break;
                case '%': operatorName = 'Módulo/Porcentaje (%)'; break;
                case 'sqrt': operatorName = 'Raíz Cuadrada (√)'; break;
                case 'cos': operatorName = 'Coseno (cos)'; break;
                case 'sin': operatorName = 'Seno (sin)'; break;
                case 'tan': operatorName = 'Tangente (tan)'; break;
                case 'log': operatorName = 'Logaritmo base 10 (log)'; break;
                case 'ln': operatorName = 'Logaritmo natural (ln)'; break;
                case '^': operatorName = 'Potencia (x^y)'; break;
                case 'pi': operatorName = 'Pi (π)'; break;
                case '(': operatorName = 'Paréntesis apertura'; break;
                case ')': operatorName = 'Paréntesis cierre'; break;
                default: operatorName = operator;
            }
            
            toastMessage.innerHTML = `Has seleccionado: <strong>${operatorName}</strong>`;
            operatorToast.show();
            
            appendToDisplay(operator);
        });
    });
    
    // Botones individuales
    dotBtn.addEventListener('click', () => {
        appendToDisplay('.');
    });
    
    equalBtn.addEventListener('click', () => {
        computeResult();
    });
    
    clearBtn.addEventListener('click', () => {
        clearCalculator();
    });
    
    // Toggle historial
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePanel();
    });
    
    closeBtn.addEventListener('click', togglePanel);
    
    // Cerrar panel al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!historyPanel.contains(e.target) && !toggleBtn.contains(e.target)) {
            historyPanel.classList.remove('show');
        }
    });
    
    // Limpiar historial
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Entrada directa en display (sanitización)
    display.addEventListener('input', (e) => {
        let value = e.target.value;
        value = value.replace(/[^0-9+\-*/.%()√cosintalgpexyπ]/g, '');
        e.target.value = value;
    });
    
    // Atajos de teclado
    display.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            computeResult();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            clearCalculator();
        }
    });
    
    // Comportamiento de foco
    display.addEventListener('focus', () => {
        if (display.value === '0') display.value = '';
    });
    
    display.addEventListener('blur', () => {
        if (display.value === '') display.value = '0';
    });
    
    // Inicialización final
    display.value = '0';
    
}); // ← ✅ FIN DEL ARCHIVO: Nada después de este cierre