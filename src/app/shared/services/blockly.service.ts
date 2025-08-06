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
        <block type="logic_compare">
          <field name="OP">EQ</field>
        </block>
        <block type="logic_compare">
          <field name="OP">NEQ</field>
        </block>
        <block type="logic_compare">
          <field name="OP">GT</field>
        </block>
        <block type="logic_compare">
          <field name="OP">GTE</field>
        </block>
        <block type="logic_compare">
          <field name="OP">LT</field>
        </block>
        <block type="logic_compare">
          <field name="OP">LTE</field>
        </block>
        <block type="logic_operation">
          <field name="OP">AND</field>
        </block>
        <block type="logic_operation">
          <field name="OP">OR</field>
        </block>
        <block type="logic_negate"></block>
      </category>
      <category name="Control" colour="#e1a91a">
        <block type="controls_if"></block>
        <block type="controls_if">
          <mutation else="1"></mutation>
        </block>
        <block type="controls_if">
          <mutation elseif="1" else="1"></mutation>
        </block>
      </category>
      <category name="Bucles" colour="#5ba58c">
        <block type="controls_repeat_ext">
          <value name="TIMES">
            <shadow type="math_number">
              <field name="NUM">10</field>
            </shadow>
          </value>
        </block>
        <block type="controls_whileUntil">
          <field name="MODE">WHILE</field>
        </block>
        <block type="controls_whileUntil">
          <field name="MODE">UNTIL</field>
        </block>
        <block type="controls_for">
          <field name="VAR">i</field>
          <value name="FROM">
            <shadow type="math_number">
              <field name="NUM">1</field>
            </shadow>
          </value>
          <value name="TO">
            <shadow type="math_number">
              <field name="NUM">10</field>
            </shadow>
          </value>
          <value name="BY">
            <shadow type="math_number">
              <field name="NUM">1</field>
            </shadow>
          </value>
        </block>
        <block type="controls_forEach">
          <field name="VAR">j</field>
        </block>
        <block type="controls_flow_statements">
          <field name="FLOW">BREAK</field>
        </block>
        <block type="controls_flow_statements">
          <field name="FLOW">CONTINUE</field>
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
        <block type="math_single">
          <field name="OP">ROOT</field>
        </block>
        <block type="math_single">
          <field name="OP">ABS</field>
        </block>
        <block type="math_single">
          <field name="OP">NEG</field>
        </block>
        <block type="math_single">
          <field name="OP">LN</field>
        </block>
        <block type="math_single">
          <field name="OP">LOG10</field>
        </block>
        <block type="math_single">
          <field name="OP">EXP</field>
        </block>
        <block type="math_single">
          <field name="OP">POW10</field>
        </block>
        <block type="math_trig">
          <field name="OP">SIN</field>
        </block>
        <block type="math_trig">
          <field name="OP">COS</field>
        </block>
        <block type="math_trig">
          <field name="OP">TAN</field>
        </block>
        <block type="math_constant">
          <field name="CONSTANT">PI</field>
        </block>
        <block type="math_constant">
          <field name="CONSTANT">E</field>
        </block>
        <block type="math_constant">
          <field name="CONSTANT">GOLDEN_RATIO</field>
        </block>
        <block type="math_number_property">
          <mutation divisor_input="false"></mutation>
          <field name="PROPERTY">EVEN</field>
        </block>
        <block type="math_round">
          <field name="OP">ROUND</field>
        </block>
        <block type="math_on_list">
          <mutation op="SUM"></mutation>
          <field name="OP">SUM</field>
        </block>
        <block type="math_modulo"></block>
        <block type="math_constrain">
          <value name="LOW">
            <shadow type="math_number">
              <field name="NUM">1</field>
            </shadow>
          </value>
          <value name="HIGH">
            <shadow type="math_number">
              <field name="NUM">100</field>
            </shadow>
          </value>
        </block>
        <block type="math_random_int">
          <value name="FROM">
            <shadow type="math_number">
              <field name="NUM">1</field>
            </shadow>
          </value>
          <value name="TO">
            <shadow type="math_number">
              <field name="NUM">100</field>
            </shadow>
          </value>
        </block>
        <block type="math_random_float"></block>
      </category>
      <category name="Texto" colour="#5ba55b">
        <block type="text">
          <field name="TEXT"></field>
        </block>
        <block type="text_join">
          <mutation items="2"></mutation>
        </block>
        <block type="text_append">
          <field name="VAR">item</field>
        </block>
        <block type="text_length"></block>
        <block type="text_isEmpty"></block>
        <block type="text_indexOf">
          <field name="END">FIRST</field>
          <value name="VALUE">
            <block type="variables_get">
              <field name="VAR">texto</field>
            </block>
          </value>
        </block>
        <block type="text_charAt">
          <mutation at="true"></mutation>
          <field name="WHERE">FROM_START</field>
          <value name="VALUE">
            <block type="variables_get">
              <field name="VAR">texto</field>
            </block>
          </value>
        </block>
        <block type="text_getSubstring">
          <mutation at1="true" at2="true"></mutation>
          <field name="WHERE1">FROM_START</field>
          <field name="WHERE2">FROM_START</field>
          <value name="STRING">
            <block type="variables_get">
              <field name="VAR">texto</field>
            </block>
          </value>
        </block>
        <block type="text_changeCase">
          <field name="CASE">UPPERCASE</field>
        </block>
        <block type="text_trim">
          <field name="MODE">BOTH</field>
        </block>
        <block type="text_print">
          <value name="TEXT">
            <shadow type="text">
              <field name="TEXT">abc</field>
            </shadow>
          </value>
        </block>
        <block type="text_prompt_ext">
          <mutation type="TEXT"></mutation>
          <field name="TYPE">TEXT</field>
          <value name="TEXT">
            <shadow type="text">
              <field name="TEXT">abc</field>
            </shadow>
          </value>
        </block>
      </category>
      <category name="Salida" colour="#745ba5">
        <block type="text_print">
          <value name="TEXT">
            <shadow type="text">
              <field name="TEXT">abc</field>
            </shadow>
          </value>
        </block>
      </category>
      <category name="Listas" colour="#745ba5">
        <block type="lists_create_with">
          <mutation items="0"></mutation>
        </block>
        <block type="lists_create_with">
          <mutation items="3"></mutation>
        </block>
        <block type="lists_repeat">
          <value name="NUM">
            <shadow type="math_number">
              <field name="NUM">5</field>
            </shadow>
          </value>
        </block>
        <block type="lists_length"></block>
        <block type="lists_isEmpty"></block>
        <block type="lists_indexOf">
          <field name="END">FIRST</field>
          <value name="VALUE">
            <block type="variables_get">
              <field name="VAR">lista</field>
            </block>
          </value>
        </block>
        <block type="lists_getIndex">
          <mutation statement="false" at="true"></mutation>
          <field name="MODE">GET</field>
          <field name="WHERE">FROM_START</field>
          <value name="VALUE">
            <block type="variables_get">
              <field name="VAR">lista</field>
            </block>
          </value>
        </block>
        <block type="lists_setIndex">
          <mutation at="true"></mutation>
          <field name="MODE">SET</field>
          <field name="WHERE">FROM_START</field>
          <value name="LIST">
            <block type="variables_get">
              <field name="VAR">lista</field>
            </block>
          </value>
        </block>
        <block type="lists_getSublist">
          <mutation at1="true" at2="true"></mutation>
          <field name="WHERE1">FROM_START</field>
          <field name="WHERE2">FROM_START</field>
          <value name="LIST">
            <block type="variables_get">
              <field name="VAR">lista</field>
            </block>
          </value>
        </block>
        <block type="lists_split">
          <mutation mode="SPLIT"></mutation>
          <field name="MODE">SPLIT</field>
          <value name="DELIM">
            <shadow type="text">
              <field name="TEXT">,</field>
            </shadow>
          </value>
        </block>
        <block type="lists_sort">
          <field name="TYPE">NUMERIC</field>
          <field name="DIRECTION">1</field>
        </block>
      </category>
      <category name="Color" colour="#a5745b">
        <block type="colour_picker">
          <field name="COLOUR">#ff0000</field>
        </block>
        <block type="colour_random"></block>
        <block type="colour_rgb">
          <value name="RED">
            <shadow type="math_number">
              <field name="NUM">100</field>
            </shadow>
          </value>
          <value name="GREEN">
            <shadow type="math_number">
              <field name="NUM">50</field>
            </shadow>
          </value>
          <value name="BLUE">
            <shadow type="math_number">
              <field name="NUM">0</field>
            </shadow>
          </value>
        </block>
        <block type="colour_blend">
          <value name="COLOUR1">
            <shadow type="colour_picker">
              <field name="COLOUR">#ff0000</field>
            </shadow>
          </value>
          <value name="COLOUR2">
            <shadow type="colour_picker">
              <field name="COLOUR">#3333ff</field>
            </shadow>
          </value>
          <value name="RATIO">
            <shadow type="math_number">
              <field name="NUM">0.5</field>
            </shadow>
          </value>
        </block>
      </category>
      <category name="Funciones" colour="#9a5ba5" custom="PROCEDURE">
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

      case 'text_print':
        const printValueBlock = block.getInputTargetBlock('TEXT');
        const printValue = printValueBlock ? this.getBlockValue(printValueBlock) : '""';
        console.log('Text_print - value:', printValue);
        return `print(${printValue});`;

      case 'logic_compare':
        const compareOp = block.getFieldValue('OP');
        const compareA = block.getInputTargetBlock('A');
        const compareB = block.getInputTargetBlock('B');
        const compareAValue = compareA ? this.getBlockValue(compareA) : '';
        const compareBValue = compareB ? this.getBlockValue(compareB) : '';

        let compareOperator = '==';
        switch (compareOp) {
          case 'EQ': compareOperator = '=='; break;
          case 'NEQ': compareOperator = '!='; break;
          case 'LT': compareOperator = '<'; break;
          case 'LTE': compareOperator = '<='; break;
          case 'GT': compareOperator = '>'; break;
          case 'GTE': compareOperator = '>='; break;
        }

        console.log('Logic_compare - A:', compareAValue, 'Op:', compareOperator, 'B:', compareBValue);
        return `${compareAValue} ${compareOperator} ${compareBValue}`;

      case 'logic_operation':
        const logicOp = block.getFieldValue('OP');
        const logicA = block.getInputTargetBlock('A');
        const logicB = block.getInputTargetBlock('B');
        const logicAValue = logicA ? this.getBlockValue(logicA) : '';
        const logicBValue = logicB ? this.getBlockValue(logicB) : '';

        let logicOperator = '&&';
        switch (logicOp) {
          case 'AND': logicOperator = '&&'; break;
          case 'OR': logicOperator = '||'; break;
        }

        console.log('Logic_operation - A:', logicAValue, 'Op:', logicOperator, 'B:', logicBValue);
        return `${logicAValue} ${logicOperator} ${logicBValue}`;

      case 'logic_negate':
        const negateBlock = block.getInputTargetBlock('BOOL');
        const negateValue = negateBlock ? this.getBlockValue(negateBlock) : '';
        console.log('Logic_negate - value:', negateValue);
        return `!(${negateValue})`;

      case 'controls_if':
        let ifCode = '';
        let conditionBlock = block.getInputTargetBlock('IF0');
        const condition = conditionBlock ? this.getBlockValue(conditionBlock) : '';

        let doBlock = block.getInputTargetBlock('DO0');
        let doCode = '';
        if (doBlock) {
          // Procesar todos los bloques conectados en la sección DO
          let currentBlock = doBlock;
          while (currentBlock) {
            const blockCode = this.blockToCode(currentBlock);
            if (blockCode) {
              doCode += (doCode ? '\n  ' : '  ') + blockCode;
            }
            currentBlock = currentBlock.getNextBlock();
          }
        }

        ifCode = `if (${condition}) {\n${doCode}\n}`;

        // Verificar si hay bloque ELSE
        const elseBlock = block.getInputTargetBlock('ELSE');
        if (elseBlock) {
          let elseCode = '';
          let currentElseBlock = elseBlock;
          while (currentElseBlock) {
            const blockCode = this.blockToCode(currentElseBlock);
            if (blockCode) {
              elseCode += (elseCode ? '\n  ' : '  ') + blockCode;
            }
            currentElseBlock = currentElseBlock.getNextBlock();
          }
          ifCode += ` else {\n${elseCode}\n}`;
        }

        console.log('Controls_if - condition:', condition, 'code:', ifCode);
        return ifCode;

      case 'controls_repeat_ext':
        const timesBlock = block.getInputTargetBlock('TIMES');
        const times = timesBlock ? this.getBlockValue(timesBlock) : '10';
        let repeatDoBlock = block.getInputTargetBlock('DO');
        let repeatDoCode = '';
        if (repeatDoBlock) {
          let currentRepeatBlock = repeatDoBlock;
          while (currentRepeatBlock) {
            const blockCode = this.blockToCode(currentRepeatBlock);
            if (blockCode) {
              repeatDoCode += (repeatDoCode ? '\n  ' : '  ') + blockCode;
            }
            currentRepeatBlock = currentRepeatBlock.getNextBlock();
          }
        }
        const repeatCode = `for (let i = 0; i < ${times}; i++) {\n${repeatDoCode}\n}`;
        console.log('Controls_repeat_ext - times:', times, 'code:', repeatCode);
        return repeatCode;

      case 'controls_whileUntil':
        const mode = block.getFieldValue('MODE');
        const boolBlock = block.getInputTargetBlock('BOOL');
        const condition2 = boolBlock ? this.getBlockValue(boolBlock) : 'false';
        let whileDoBlock = block.getInputTargetBlock('DO');
        let whileDoCode = '';
        if (whileDoBlock) {
          let currentWhileBlock = whileDoBlock;
          while (currentWhileBlock) {
            const blockCode = this.blockToCode(currentWhileBlock);
            if (blockCode) {
              whileDoCode += (whileDoCode ? '\n  ' : '  ') + blockCode;
            }
            currentWhileBlock = currentWhileBlock.getNextBlock();
          }
        }
        const whileCondition = mode === 'WHILE' ? condition2 : `!(${condition2})`;
        const whileCode = `while (${whileCondition}) {\n${whileDoCode}\n}`;
        console.log('Controls_whileUntil - mode:', mode, 'condition:', whileCondition);
        return whileCode;

      case 'controls_for':
        const varName2 = block.getFieldValue('VAR');
        const fromBlock = block.getInputTargetBlock('FROM');
        const toBlock = block.getInputTargetBlock('TO');
        const byBlock = block.getInputTargetBlock('BY');
        const fromValue = fromBlock ? this.getBlockValue(fromBlock) : '1';
        const toValue = toBlock ? this.getBlockValue(toBlock) : '10';
        const byValue = byBlock ? this.getBlockValue(byBlock) : '1';
        let forDoBlock = block.getInputTargetBlock('DO');
        let forDoCode = '';
        if (forDoBlock) {
          let currentForBlock = forDoBlock;
          while (currentForBlock) {
            const blockCode = this.blockToCode(currentForBlock);
            if (blockCode) {
              forDoCode += (forDoCode ? '\n  ' : '  ') + blockCode;
            }
            currentForBlock = currentForBlock.getNextBlock();
          }
        }
        const forCode = `for (let ${varName2} = ${fromValue}; ${varName2} <= ${toValue}; ${varName2} += ${byValue}) {\n${forDoCode}\n}`;
        console.log('Controls_for - var:', varName2, 'from:', fromValue, 'to:', toValue, 'by:', byValue);
        return forCode;

      case 'math_single':
        const singleOp = block.getFieldValue('OP');
        const numBlock = block.getInputTargetBlock('NUM');
        const numValue2 = numBlock ? this.getBlockValue(numBlock) : '0';
        let singleFunction = '';
        switch (singleOp) {
          case 'ROOT': singleFunction = `Math.sqrt(${numValue2})`; break;
          case 'ABS': singleFunction = `Math.abs(${numValue2})`; break;
          case 'NEG': singleFunction = `-(${numValue2})`; break;
          case 'LN': singleFunction = `Math.log(${numValue2})`; break;
          case 'LOG10': singleFunction = `Math.log10(${numValue2})`; break;
          case 'EXP': singleFunction = `Math.exp(${numValue2})`; break;
          case 'POW10': singleFunction = `Math.pow(10, ${numValue2})`; break;
        }
        console.log('Math_single - op:', singleOp, 'result:', singleFunction);
        return singleFunction;

      case 'math_trig':
        const trigOp = block.getFieldValue('OP');
        const trigBlock = block.getInputTargetBlock('NUM');
        const trigValue = trigBlock ? this.getBlockValue(trigBlock) : '0';
        let trigFunction = '';
        switch (trigOp) {
          case 'SIN': trigFunction = `Math.sin(${trigValue})`; break;
          case 'COS': trigFunction = `Math.cos(${trigValue})`; break;
          case 'TAN': trigFunction = `Math.tan(${trigValue})`; break;
          case 'ASIN': trigFunction = `Math.asin(${trigValue})`; break;
          case 'ACOS': trigFunction = `Math.acos(${trigValue})`; break;
          case 'ATAN': trigFunction = `Math.atan(${trigValue})`; break;
        }
        console.log('Math_trig - op:', trigOp, 'result:', trigFunction);
        return trigFunction;

      case 'math_constant':
        const constantValue = block.getFieldValue('CONSTANT');
        let constantResult = '';
        switch (constantValue) {
          case 'PI': constantResult = 'Math.PI'; break;
          case 'E': constantResult = 'Math.E'; break;
          case 'GOLDEN_RATIO': constantResult = '1.618033988749895'; break;
          case 'SQRT2': constantResult = 'Math.SQRT2'; break;
          case 'SQRT1_2': constantResult = 'Math.SQRT1_2'; break;
          case 'INFINITY': constantResult = 'Infinity'; break;
        }
        console.log('Math_constant - constant:', constantValue, 'result:', constantResult);
        return constantResult;

      case 'math_random_int':
        const randomFromBlock = block.getInputTargetBlock('FROM');
        const randomToBlock = block.getInputTargetBlock('TO');
        const randomFrom = randomFromBlock ? this.getBlockValue(randomFromBlock) : '1';
        const randomTo = randomToBlock ? this.getBlockValue(randomToBlock) : '100';
        const randomIntCode = `Math.floor(Math.random() * (${randomTo} - ${randomFrom} + 1)) + ${randomFrom}`;
        console.log('Math_random_int - from:', randomFrom, 'to:', randomTo);
        return randomIntCode;

      case 'math_random_float':
        console.log('Math_random_float');
        return 'Math.random()';

      case 'lists_create_with':
        const listInputs = [];
        for (let i = 0; i < block.inputList.length; i++) {
          const input = block.inputList[i];
          if (input.type === 1) { // INPUT_VALUE
            const inputBlock = input.connection?.targetBlock();
            if (inputBlock) {
              listInputs.push(this.getBlockValue(inputBlock));
            }
          }
        }
        const listCode = `[${listInputs.join(', ')}]`;
        console.log('Lists_create_with - items:', listInputs);
        return listCode;

      case 'lists_length':
        const lengthListBlock = block.getInputTargetBlock('VALUE');
        const lengthList = lengthListBlock ? this.getBlockValue(lengthListBlock) : '[]';
        const lengthCode = `${lengthList}.length`;
        console.log('Lists_length - list:', lengthList);
        return lengthCode;

      case 'text_length':
        const textLengthBlock = block.getInputTargetBlock('VALUE');
        const textLengthValue = textLengthBlock ? this.getBlockValue(textLengthBlock) : '""';
        const textLengthCode = `${textLengthValue}.length`;
        console.log('Text_length - text:', textLengthValue);
        return textLengthCode;

      case 'text_isEmpty':
        const isEmptyBlock = block.getInputTargetBlock('VALUE');
        const isEmptyValue = isEmptyBlock ? this.getBlockValue(isEmptyBlock) : '""';
        const isEmptyCode = `${isEmptyValue}.length === 0`;
        console.log('Text_isEmpty - text:', isEmptyValue);
        return isEmptyCode;

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
      case 'logic_compare':
        const compareValue = this.blockToCode(block);
        console.log('Logic_compare value:', compareValue);
        return compareValue;
      case 'logic_operation':
        const logicOpValue = this.blockToCode(block);
        console.log('Logic_operation value:', logicOpValue);
        return logicOpValue;
      case 'logic_negate':
        const negateValue = this.blockToCode(block);
        console.log('Logic_negate value:', negateValue);
        return negateValue;
      case 'text_join':
        const joinValue = this.blockToCode(block);
        console.log('Text_join value:', joinValue);
        return joinValue;
      case 'math_single':
        const mathSingleValue = this.blockToCode(block);
        console.log('Math_single value:', mathSingleValue);
        return mathSingleValue;
      case 'math_trig':
        const mathTrigValue = this.blockToCode(block);
        console.log('Math_trig value:', mathTrigValue);
        return mathTrigValue;
      case 'math_constant':
        const mathConstantValue = this.blockToCode(block);
        console.log('Math_constant value:', mathConstantValue);
        return mathConstantValue;
      case 'math_random_int':
        const mathRandomIntValue = this.blockToCode(block);
        console.log('Math_random_int value:', mathRandomIntValue);
        return mathRandomIntValue;
      case 'math_random_float':
        const mathRandomFloatValue = this.blockToCode(block);
        console.log('Math_random_float value:', mathRandomFloatValue);
        return mathRandomFloatValue;
      case 'lists_create_with':
        const listValue = this.blockToCode(block);
        console.log('Lists_create_with value:', listValue);
        return listValue;
      case 'lists_length':
        const listLengthValue = this.blockToCode(block);
        console.log('Lists_length value:', listLengthValue);
        return listLengthValue;
      case 'text_length':
        const textLengthValue2 = this.blockToCode(block);
        console.log('Text_length value:', textLengthValue2);
        return textLengthValue2;
      case 'text_isEmpty':
        const textIsEmptyValue = this.blockToCode(block);
        console.log('Text_isEmpty value:', textIsEmptyValue);
        return textIsEmptyValue;
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
