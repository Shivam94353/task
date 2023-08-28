const express = require('express');
const app = express();
const PORT = 3000;

const history = [];

app.use(express.json());

function calculateExpression(expression) {
  try {
    return eval(expression);
  } catch (error) {
    return null;
  }
}

app.get('/history', (req, res) => {
  res.json(history);
});

app.get('/:numbers', (req, res) => {
  const numbers = req.params.numbers.split('/');
  let expression = '';
  let answer = null;

  for (let i = 0; i < numbers.length; i += 2) {
    const num = parseFloat(numbers[i]);
    const operator = numbers[i + 1];
    if (isNaN(num)) {
      return res.status(400).json({ error: 'Invalid number provided.' });
    }
    expression += num + operator;
  }

  expression = expression.slice(0, -1); // Remove the trailing operator

  answer = calculateExpression(expression);

  if (answer === null) {
    return res.status(400).json({ error: 'Invalid expression.' });
  }

  history.push({ question: expression, answer });

  if (history.length > 20) {
    history.shift();
  }

  res.json({ question: expression, answer });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
