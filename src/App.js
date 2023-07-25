import React, { useReducer } from 'react';
import './App.css';
import NavBar from './NavBar';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-Digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-Digit',
  EVALUATE: 'evaluate',
  FLIP: 'flip'
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (state.currentOperand === '0' && payload.digit === '0') {
        return state
      } else if (state.currentOperand.includes('.') && payload.digit === '.') {
        return state
      } else if (state.currentOperand === '0' && payload.digit === '.') {
        return {
          ...state,
          currentOperand: '0.'
        }
      } else if (state.currentOperand === '0' && payload.digit) {
        return {
          ...state,
          currentOperand: `${payload.digit}`
        }
      } else return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
    case ACTIONS.CLEAR:
      return {
        ...state,
        currentOperand: '0',
        previousOperand: '',
        operation: ''
      }
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: '0'
        }
       }
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: '0'
        }
      } else if (state.currentOperand) {
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1)
        }
      } else {
        return state
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (!state.operation) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          currentOperand: '',
          operation: payload.operation
        }
      } else if (!state.currentOperand) {
        return {
          ...state,
          operation: payload.operation,
        }
      } else {
        return state
      }

    case ACTIONS.FLIP:
      if (state.currentOperand === '0') {
        return state
      }
      if (state.currentOperand.includes('-')) {
        return {
          ...state,
          currentOperand: Math.abs(state.currentOperand).toString()
        }
      } else {
        return {
          ...state,
          currentOperand: `-${state.currentOperand}`
        }
      }
    case ACTIONS.EVALUATE:
      if (state.currentOperand === '' || state.previousOperand === '' || state.operation === '') {  
        return state
      } else {
        return {
          ...state,
          overwrite: true,
          previousOperand: '',
          operation: '',
          currentOperand: evaluate(state),
        }
      }
  default: return state;
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return ''
  let computation = ''
  switch (operation) {
    case '+':
      computation = prev + current;
      break
    case '-':
      computation = prev - current;
      break
    case '×':
      computation = prev * current;
      break
    case '÷':
      computation = prev / current;
      break
  }
  return computation.toString();
}


function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {
    previousOperand: '',
    currentOperand: '0',
    operation: '',
  })

  return (
    <div className="App">
      <NavBar />
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">{previousOperand} {operation}</div>
          <div className="current-operand">{currentOperand}</div>
        </div>
        <button className="span-two" onClick={() => {dispatch({ type: ACTIONS.CLEAR })}}>AC</button>
        <button onClick={() => {dispatch({ type: ACTIONS.DELETE_DIGIT })}}>DEL</button>
        <OperationButton operation="÷" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="×" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <button onClick={() => {dispatch({ type: ACTIONS.FLIP })}}>+/-</button>
        <DigitButton digit="0" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <button onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
      </div>
    </div>
  );
}

export default App;
