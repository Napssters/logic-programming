import { Injectable } from '@angular/core';
import * as Blockly from 'blockly';

@Injectable({
  providedIn: 'root'
})
export class BlocklyService {
  private workspace: Blockly.WorkspaceSvg | null = null;

  constructor() { }

  initializeWorkspace(element: HTMLElement): Blockly.WorkspaceSvg {
    // Configuración personalizada para el workspace
    const options = {
      toolbox: this.getVariablesToolbox(),
      collapse: true,
      comments: true,
      disable: true,
      maxBlocks: Infinity,
      trashcan: true,
      horizontalLayout: false,
      toolboxPosition: 'start',
      css: true,
      media: 'https://unpkg.com/blockly/media/',
      rtl: false,
      scrollbars: true,
      sounds: true,
      oneBasedIndex: true,
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      }
    };

    this.workspace = Blockly.inject(element, options);

    // Crear la variable por defecto "item"
    if (this.workspace) {
      this.workspace.getVariableMap().createVariable('item');
      console.log('Variable por defecto "item" creada');
    }

    return this.workspace;
  }

  private getVariablesToolbox(): string {
    let variablesXml = '';

    // Siempre incluir la variable por defecto "item"
    variablesXml += `
        <block type="variables_set">
          <field name="VAR">item</field>
        </block>
        <block type="variables_get">
          <field name="VAR">item</field>
        </block>`;

    // Si hay workspace, incluir las variables existentes (además de item)
    if (this.workspace) {
      const variables = this.workspace.getAllVariables();
      variables.forEach(variable => {
        const varName = variable.getName();
        // Solo agregar si no es "item" para evitar duplicados
        if (varName !== 'item') {
          variablesXml += `
          <block type="variables_set">
            <field name="VAR">${varName}</field>
          </block>
          <block type="variables_get">
            <field name="VAR">${varName}</field>
          </block>`;
        }
      });
    }

    return `
    <xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
      <category name="Variables" colour="#a55b5b">
        ${variablesXml}
        <button text="Crear variable..." callbackKey="CREATE_VARIABLE"></button>
      </category>
      <category name="Lógica" colour="#5b80a5">
        <block type="logic_boolean">
          <field name="BOOL">TRUE</field>
        </block>
        <block type="logic_boolean">
          <field name="BOOL">FALSE</field>
        </block>
      </category>
      <category name="Matemáticas" colour="#5b5ba5">
        <block type="math_number">
          <field name="NUM">0</field>
        </block>
        <block type="math_arithmetic">
          <field name="OP">ADD</field>
        </block>
        <block type="math_arithmetic">
          <field name="OP">MINUS</field>
        </block>
        <block type="math_arithmetic">
          <field name="OP">MULTIPLY</field>
        </block>
        <block type="math_arithmetic">
          <field name="OP">DIVIDE</field>
        </block>
      </category>
      <category name="Texto" colour="#5ba55b">
        <block type="text">
          <field name="TEXT"></field>
        </block>
        <block type="text_join">
          <mutation items="2"></mutation>
        </block>
      </category>
    </xml>
    `;
  }  generateCode(): string {
    if (!this.workspace) {
      return '';
    }

    // Crear un generador simple para convertir bloques a código
    const topBlocks = this.workspace.getTopBlocks(true);
    let code = '';

    console.log('Bloques encontrados:', topBlocks.length);

    topBlocks.forEach((topBlock, index) => {
      console.log(`Procesando cadena de bloques iniciando con:`, topBlock.type);

      // Procesar toda la cadena de bloques conectados
      let currentBlock = topBlock;
      let chainCode = '';

      while (currentBlock) {
        console.log(`Bloque en cadena:`, currentBlock.type);
        const blockCode = this.blockToCode(currentBlock);
        if (blockCode) {
          if (chainCode) {
            chainCode += '\n';
          }
          chainCode += blockCode;
        }

        // Obtener el siguiente bloque conectado
        currentBlock = currentBlock.getNextBlock();
      }

      if (chainCode) {
        if (code) {
          code += '\n';
        }
        code += chainCode;
      }
    });

    console.log('Código generado completo:', code);
    return code;
  }  private blockToCode(block: Blockly.Block): string {
    console.log('Procesando bloque:', block.type);

    switch (block.type) {
      case 'variables_set':
        const varId = block.getFieldValue('VAR');
        // Obtener el nombre real de la variable desde el workspace
        const variable = this.workspace.getVariableById(varId);
        const varName = variable ? variable.getName() : varId;
        const valueBlock = block.getInputTargetBlock('VALUE');
        const value = valueBlock ? this.getBlockValue(valueBlock) : '';

        console.log('Variables_set - ID:', varId, 'Nombre real:', varName, 'Valor:', value);
        return `var ${varName} = ${value};`;

      case 'math_number':
        const numValue = block.getFieldValue('NUM');
        console.log('Math_number:', numValue);
        return numValue;

      case 'text':
        const textValue = block.getFieldValue('TEXT');
        console.log('Text:', textValue);
        return `"${textValue}"`;

      case 'logic_boolean':
        const boolValue = block.getFieldValue('BOOL').toLowerCase();
        console.log('Logic_boolean:', boolValue);
        return boolValue;

      case 'math_arithmetic':
        const op = block.getFieldValue('OP');
        const a = block.getInputTargetBlock('A');
        const b = block.getInputTargetBlock('B');
        const aValue = a ? this.getBlockValue(a) : '0';
        const bValue = b ? this.getBlockValue(b) : '0';

        let operator = '+';
        switch (op) {
          case 'ADD': operator = '+'; break;
          case 'MINUS': operator = '-'; break;
          case 'MULTIPLY': operator = '*'; break;
          case 'DIVIDE': operator = '/'; break;
        }

        console.log('Math_arithmetic - A:', aValue, 'Op:', operator, 'B:', bValue);
        return `${aValue} ${operator} ${bValue}`;

      case 'variables_get':
        const getVarName = block.getFieldValue('VAR');
        console.log('Variables_get:', getVarName);
        return getVarName;

      case 'text_join':
        const inputs = [];
        for (let i = 0; i < block.inputList.length; i++) {
          const input = block.inputList[i];
          if (input.type === 1) { // INPUT_VALUE = 1
            const inputBlock = input.connection?.targetBlock();
            if (inputBlock) {
              inputs.push(this.getBlockValue(inputBlock));
            }
          }
        }
        console.log('Text_join - inputs:', inputs);
        return inputs.join(' + ');

      default:
        console.log('Bloque no reconocido:', block.type);
        return '';
    }
  }

  private getBlockValue(block: Blockly.Block): string {
    console.log('getBlockValue called for block type:', block.type);

    switch (block.type) {
      case 'math_number':
        const numValue = block.getFieldValue('NUM');
        console.log('Math_number value:', numValue);
        return numValue;
      case 'text':
        const textValue = block.getFieldValue('TEXT');
        console.log('Text value:', textValue);
        return `"${textValue}"`;
      case 'logic_boolean':
        const boolValue = block.getFieldValue('BOOL').toLowerCase();
        console.log('Logic_boolean value:', boolValue);
        return boolValue;
      case 'variables_get':
        const varGetId = block.getFieldValue('VAR');
        // Obtener el nombre real de la variable desde el workspace
        const varGet = this.workspace.getVariableById(varGetId);
        const varGetName = varGet ? varGet.getName() : varGetId;
        console.log('Variables_get - ID:', varGetId, 'Nombre real:', varGetName);
        return varGetName;
      case 'math_arithmetic':
        const arithValue = this.blockToCode(block);
        console.log('Math_arithmetic value:', arithValue);
        return arithValue;
      default:
        const defaultValue = this.blockToCode(block);
        console.log('Default case - block type:', block.type, 'value:', defaultValue);
        return defaultValue;
    }
  }

  clearWorkspace(): void {
    if (this.workspace) {
      this.workspace.clear();
    }
  }

  getWorkspace(): Blockly.WorkspaceSvg | null {
    return this.workspace;
  }

  dispose(): void {
    if (this.workspace) {
      this.workspace.dispose();
      this.workspace = null;
    }
  }

  // Método para validar código generado contra código esperado
  validateCode(generatedCode: string, expectedCode: string): boolean {
    console.log('=== VALIDACIÓN DE CÓDIGO ===');
    console.log('Código generado original:', JSON.stringify(generatedCode));
    console.log('Código esperado original:', JSON.stringify(expectedCode));

    // Normalizar ambos códigos para comparación
    const normalize = (code: string) => {
      return code
        .replace(/\s+/g, ' ') // Reemplazar múltiples espacios con uno solo
        .replace(/;\s*$/, '') // Eliminar punto y coma al final si existe
        .replace(/;/g, '') // Eliminar todos los puntos y comas
        .trim()
        .toLowerCase();
    };

    const normalizedGenerated = normalize(generatedCode);
    const normalizedExpected = normalize(expectedCode);

    console.log('Código generado normalizado:', JSON.stringify(normalizedGenerated));
    console.log('Código esperado normalizado:', JSON.stringify(normalizedExpected));

    // Comparación exacta
    const exactMatch = normalizedGenerated === normalizedExpected;
    console.log('Comparación exacta:', exactMatch);

    // También probar comparación más flexible
    const flexibleMatch = this.flexibleCodeComparison(generatedCode, expectedCode);
    console.log('Comparación flexible:', flexibleMatch);

    const result = exactMatch || flexibleMatch;
    console.log('Resultado final de validación:', result);
    console.log('=== FIN VALIDACIÓN ===');

    return result;
  }

  // Comparación más flexible para diferentes formatos de código
  private flexibleCodeComparison(generated: string, expected: string): boolean {
    // Dividir en líneas y comparar cada línea por separado
    const generatedLines = generated.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const expectedLines = expected.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    if (generatedLines.length !== expectedLines.length) {
      return false;
    }

    for (let i = 0; i < generatedLines.length; i++) {
      const genLine = this.normalizeCodeLine(generatedLines[i]);
      const expLine = this.normalizeCodeLine(expectedLines[i]);

      if (genLine !== expLine) {
        console.log(`Línea ${i + 1} no coincide:`);
        console.log('  Generada:', genLine);
        console.log('  Esperada:', expLine);
        return false;
      }
    }

    return true;
  }

  private normalizeCodeLine(line: string): string {
    return line
      .replace(/\s+/g, ' ')
      .replace(/;$/, '')
      .trim()
      .toLowerCase();
  }

  // Configurar callbacks personalizados
  setupCallbacks(component?: any): void {
    if (!this.workspace) return;

    // Callback personalizado para crear nuevas variables
    this.workspace.registerButtonCallback('CREATE_VARIABLE', () => {
      console.log('Botón crear variable presionado');
      if (component) {
        component.showCreateVariableDialog((name: string) => {
          this.createVariable(name);
        });
      } else {
        // Fallback al comportamiento original
        Blockly.Variables.createVariableButtonHandler(this.workspace!);
      }
    });
  }

  // Método para crear una variable programáticamente
  createVariable(name: string): any {
    if (!this.workspace || !name.trim()) return null;

    try {
      // Usar la nueva API no deprecada
      const variable = this.workspace.getVariableMap().createVariable(name.trim());
      console.log('Variable creada con nueva API:', name);

      // Dar un pequeño delay antes de refrescar el toolbox
      setTimeout(() => {
        this.refreshToolbox();
      }, 100);

      return variable;
    } catch (error) {
      console.error('Error creando variable:', error);
      return null;
    }
  }

  // Método para refrescar el toolbox y mostrar las variables creadas
  private refreshToolbox(): void {
    if (!this.workspace) return;

    try {
      console.log('Refrescando toolbox con variables actuales...');

      // Generar el nuevo toolbox XML con las variables actuales
      const newToolboxXml = this.getVariablesToolbox();
      console.log('Nuevo toolbox XML generado');

      // Actualizar el toolbox
      this.workspace.updateToolbox(newToolboxXml);
      console.log('Toolbox actualizado exitosamente');

      // Forzar re-renderizado del toolbox
      const toolbox = this.workspace.getToolbox();
      if (toolbox) {
        toolbox.refreshSelection();
        console.log('Selección del toolbox refrescada');
      }

    } catch (error) {
      console.warn('Error refrescando toolbox:', error);

      // Fallback más agresivo: recrear workspace
      this.fallbackRefresh();
    }
  }

  // Método fallback para refrescar el toolbox
  private fallbackRefresh(): void {
    try {
      console.log('Intentando fallback refresh...');

      // Disparar evento de cambio manualmente
      if (this.workspace) {
        // Forzar actualización de la categoría Variables
        const toolbox = this.workspace.getToolbox();
        if (toolbox && (toolbox as any).refreshTheme) {
          (toolbox as any).refreshTheme();
        }

        // Renderizar toolbox nuevamente
        this.workspace.render();
      }

    } catch (fallbackError) {
      console.warn('Error en fallback refresh:', fallbackError);
    }
  }

  // Método para configurar modales personalizados
  setupCustomDialogs(component: any): void {
    // Intentar sobrescribir usando diferentes métodos disponibles en Blockly
    try {
      // Método 1: Usar Blockly.dialog si está disponible
      if (Blockly.dialog && Blockly.dialog.setPrompt) {
        Blockly.dialog.setPrompt((message: string, defaultValue: string, callback: (result: string | null) => void) => {
          if (message.toLowerCase().includes('variable') || message.toLowerCase().includes('nombre')) {
            component.showCreateVariableDialog(callback);
          } else {
            const result = prompt(message, defaultValue);
            callback(result);
          }
        });

        Blockly.dialog.setConfirm((message: string, callback: (result: boolean) => void) => {
          if (message.toLowerCase().includes('delete') || message.toLowerCase().includes('eliminar')) {
            const variableName = this.extractVariableNameFromMessage(message);
            component.showDeleteVariableDialog(variableName, () => callback(true));
            component.onCancelDeleteVariable = () => callback(false);
          } else {
            const result = confirm(message);
            callback(result);
          }
        });
      } else {
        // Método 2: Sobrescribir funciones globales del navegador
        const originalPrompt = window.prompt;
        const originalConfirm = window.confirm;

        (window as any).blocklyPrompt = originalPrompt;
        (window as any).blocklyConfirm = originalConfirm;

        window.prompt = (message?: string, defaultText?: string) => {
          if (message && (message.toLowerCase().includes('variable') || message.toLowerCase().includes('nombre'))) {
            // Para prompt síncrono, necesitamos una solución diferente
            component.showCreateVariableDialog((name: string) => {
              // Esto no funcionará perfectamente pero es mejor que nada
            });
            return null; // Cancelar por defecto
          } else {
            return originalPrompt(message, defaultText);
          }
        };

        window.confirm = (message?: string) => {
          if (message && (message.toLowerCase().includes('delete') || message.toLowerCase().includes('eliminar'))) {
            const variableName = this.extractVariableNameFromMessage(message);
            component.showDeleteVariableDialog(variableName, () => {});
            return false; // Cancelar por defecto
          } else {
            return originalConfirm(message);
          }
        };
      }
    } catch (error) {
      console.warn('No se pudieron configurar los diálogos personalizados:', error);
    }
  }

  private extractVariableNameFromMessage(message: string): string {
    // Intentar extraer el nombre de la variable del mensaje
    const match = message.match(/"([^"]+)"/);
    return match ? match[1] : 'variable';
  }
}
